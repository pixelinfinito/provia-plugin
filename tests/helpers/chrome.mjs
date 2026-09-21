// Minimal headless Chrome driver over the DevTools Protocol: no dependencies, skipped when no Chrome is installed.
import { spawn, execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CANDIDATES = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Chromium.app/Contents/MacOS/Chromium', 'google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'chrome'].filter(Boolean);
export function findChrome() {
  for (const candidate of CANDIDATES) {
    if (candidate.includes('/')) { if (existsSync(candidate)) return candidate; continue; }
    try { return execFileSync('which', [candidate], { encoding: 'utf8' }).trim() || null; } catch { /* next */ }
  }
  return null;
}

export async function launch() {
  const binary = findChrome();
  if (!binary || typeof WebSocket !== 'function') return null;
  const profile = mkdtempSync(join(tmpdir(), 'provia-chrome-'));
  const child = spawn(binary, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--window-size=1280,900', 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
  const endpoint = await new Promise((resolve, reject) => {
    let buffer = '';
    const timer = setTimeout(() => reject(new Error('Chrome did not expose DevTools')), 15000);
    child.stderr.on('data', chunk => { buffer += chunk; const match = /DevTools listening on (ws:\/\/[^\s]+)/.exec(buffer); if (match) { clearTimeout(timer); resolve(match[1]); } });
    child.on('exit', () => { clearTimeout(timer); reject(new Error('Chrome exited')); });
  });
  const http = endpoint.replace(/^ws:\/\/([^/]+)\/.*$/, 'http://$1');
  const target = await (await fetch(`${http}/json/new?about:blank`, { method: 'PUT' })).json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
  let id = 0;
  const pending = new Map();
  const events = [];
  ws.onmessage = event => { const message = JSON.parse(event.data); if (message.id && pending.has(message.id)) { const { resolve, reject } = pending.get(message.id); pending.delete(message.id); message.error ? reject(new Error(message.error.message)) : resolve(message.result); } else if (message.method) events.push(message); };
  const send = (method, params) => new Promise((resolve, reject) => { id += 1; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params: params ?? {} })); });
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Log.enable');
  const page = {
    send, events,
    async goto(url) {
      // A fragment-only navigation is same-document and fires no load event, so every navigation goes through about:blank.
      const load = async target => { events.length = 0; await send('Page.navigate', { url: target }); await new Promise((resolve, reject) => { const started = Date.now(); const check = () => events.some(e => e.method === 'Page.loadEventFired') ? resolve() : Date.now() - started > 20000 ? reject(new Error('load timeout: ' + target)) : setTimeout(check, 20); check(); }); };
      await load('about:blank');
      await load(url);
    },
    async eval(expression) { const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }); if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text); return result.result.value; },
    errors() { return events.filter(e => e.method === 'Runtime.exceptionThrown').map(e => e.params.exceptionDetails.exception?.description ?? e.params.exceptionDetails.text).concat(events.filter(e => e.method === 'Log.entryAdded' && e.params.entry.level === 'error').map(e => e.params.entry.text)); },
    async viewport(width, height) { await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 900 }); },
    async screenshot(path) { const { data } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false }); (await import('node:fs')).writeFileSync(path, Buffer.from(data, 'base64')); },
    async media(type) { await send('Emulation.setEmulatedMedia', { media: type }); },
    async close() { try { ws.close(); } catch { /* ignore */ } child.kill('SIGKILL'); await new Promise(resolve => child.once('exit', resolve)); rmSync(profile, { recursive: true, force: true }); },
  };
  return page;
}
