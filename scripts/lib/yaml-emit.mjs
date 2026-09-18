// Minimal YAML emitter for the plain scalars, maps and lists used by portable workflow documents.
const PLAIN = /^[A-Za-z0-9_][A-Za-z0-9_ .\/@()\-]*$/;
const RESERVED = new Set(['true', 'false', 'null', 'yes', 'no', 'on', 'off', '~', '']);

function scalar(value) {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  const text = String(value);
  if (text.includes('\n')) return null; // block scalar, handled by the caller
  if (PLAIN.test(text) && !RESERVED.has(text.toLowerCase()) && !/^[\d.+-]/.test(text) && !/:\s|\s#|^[-?]/.test(text) && text.trim() === text) return text;
  return JSON.stringify(text);
}

export function emit(value, indent = 0) {
  const pad = ' '.repeat(indent);
  if (Array.isArray(value)) {
    if (!value.length) return `${pad}[]\n`;
    return value.map(item => {
      if (item && typeof item === 'object') {
        const body = emit(item, indent + 2);
        return `${pad}- ${body.slice(indent + 2)}`;
      }
      return `${pad}- ${scalar(item) ?? JSON.stringify(item)}\n`;
    }).join('');
  }
  if (value && typeof value === 'object') {
    const keys = Object.keys(value);
    if (!keys.length) return `${pad}{}\n`;
    return keys.map(key => {
      const item = value[key];
      if (Array.isArray(item)) return item.length ? `${pad}${key}:\n${emit(item, indent + 2)}` : `${pad}${key}: []\n`;
      if (item && typeof item === 'object') return Object.keys(item).length ? `${pad}${key}:\n${emit(item, indent + 2)}` : `${pad}${key}: {}\n`;
      const text = scalar(item);
      if (text === null) return `${pad}${key}: |\n${String(item).replace(/\n$/, '').split('\n').map(line => `${pad}  ${line}`).join('\n')}\n`;
      return `${pad}${key}: ${text}\n`;
    }).join('');
  }
  return `${pad}${scalar(value)}\n`;
}
