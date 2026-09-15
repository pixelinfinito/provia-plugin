#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, extname } from 'node:path';

const icons = new Set(JSON.parse(readFileSync(new URL('../references/entity-icons.json', import.meta.url), 'utf8')).icons);
const fieldTypes = new Set(['text', 'number', 'date', 'datetime', 'boolean', 'select', 'multi_select', 'url', 'email', 'phone', 'currency', 'user', 'entity', 'file', 'rich_text', 'color', 'rating', 'percentage']);
const text = value => typeof value === 'string' && value.trim().length > 0;
const key = value => text(value) && /^[a-z][a-z0-9_]*$/.test(value);
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
function ensure(condition, location) {
  if (!condition) throw new Error(`Invalid catalogue: ${location}`);
}
function strings(values, location) {
  ensure(Array.isArray(values) && values.every(text), location);
}

function validate(catalogue) {
  ensure(object(catalogue) && catalogue.schemaVersion === 'provia-entity-catalogue/v1', 'schemaVersion');
  for (const name of ['title', 'language', 'country']) ensure(text(catalogue[name]), name);
  strings(catalogue.notes, 'notes');
  ensure(Array.isArray(catalogue.types) && catalogue.types.length > 0, 'types');
  const keys = new Set();
  for (const [index, type] of catalogue.types.entries()) {
    ensure(object(type) && key(type.key) && !keys.has(type.key), `types[${index}].key`);
    keys.add(type.key);
  }
  for (const [index, type] of catalogue.types.entries()) {
    const at = `types[${index}]`;
    for (const name of ['name', 'description', 'namePattern', 'purpose', 'owner']) ensure(text(type[name]), `${at}.${name}`);
    ensure(icons.has(type.icon), `${at}.icon`);
    ensure(Array.isArray(type.coverage) && type.coverage.length > 0, `${at}.coverage`);
    for (const entry of type.coverage) ensure(object(entry) && text(entry.dimension) && ['included', 'external', 'case', 'not_applicable', 'pending'].includes(entry.decision) && text(entry.reason), `${at}.coverage entry`);
    strings(type.setup, `${at}.setup`);
    strings(type.readiness, `${at}.readiness`);
    ensure(Array.isArray(type.fields), `${at}.fields`);
    const fields = new Set();
    for (const [fieldIndex, field] of type.fields.entries()) {
      const loc = `${at}.fields[${fieldIndex}]`;
      ensure(object(field) && key(field.key) && !fields.has(field.key), `${loc}.key`);
      fields.add(field.key);
      for (const name of ['label', 'group', 'helpText', 'purpose', 'source', 'maintainer', 'sensitivity']) ensure(text(field[name]), `${loc}.${name}`);
      ensure(fieldTypes.has(field.type), `${loc}.type`);
      ensure(typeof field.required === 'boolean', `${loc}.required`);
      ensure(['core', 'conditional', 'optional'].includes(field.priority), `${loc}.priority`);
      ensure(Object.hasOwn(field, 'example'), `${loc}.example`);
      if (field.type === 'entity') ensure(keys.has(field.targetType), `${loc}.targetType`);
      else ensure(!Object.hasOwn(field, 'targetType'), `${loc}.targetType only applies to entity fields`);
      if (!['select', 'multi_select'].includes(field.type)) ensure(!Object.hasOwn(field, 'options'), `${loc}.options only applies to select fields`);
      if (['select', 'multi_select'].includes(field.type)) {
        ensure(Array.isArray(field.options) && field.options.length > 0, `${loc}.options`);
        const values = new Set();
        for (const option of field.options) {
          ensure(object(option) && key(option.value) && text(option.label) && !values.has(option.value), `${loc}.options entry`);
          values.add(option.value);
        }
        for (const property of ['example', 'defaultValue']) if (Object.hasOwn(field, property)) {
          const selected = field.type === 'multi_select' ? field[property] : [field[property]];
          ensure(Array.isArray(selected) && selected.every(value => values.has(value)), `${loc}.${property}`);
        }
      }
      for (const property of ['example', 'defaultValue']) if (Object.hasOwn(field, property)) {
        const value = field[property];
        if (['number', 'currency', 'rating', 'percentage'].includes(field.type)) ensure(typeof value === 'number' && Number.isFinite(value), `${loc}.${property}`);
        if (field.type === 'boolean') ensure(typeof value === 'boolean', `${loc}.${property}`);
        if (['text', 'date', 'datetime', 'url', 'email', 'phone', 'rich_text', 'color'].includes(field.type)) ensure(typeof value === 'string', `${loc}.${property}`);
      }
    }
  }
}

const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const display = value => typeof value === 'string' ? value : JSON.stringify(value, null, 2);

function render(catalogue) {
  const pt = catalogue.language.toLowerCase().startsWith('pt');
  const labels = pt ? {
    copy: 'Copiar', copied: 'Copiado.', fallback: 'Texto seleccionado. Use Ctrl+C ou ⌘C para copiar.', search: 'Pesquisar tipos e campos',
    download: 'Descarregar JSON', print: 'Imprimir', name: 'Nome do tipo', description: 'Descrição', icon: 'Ícone', pattern: 'Convenção do Nome nativo',
    fields: 'Campos', group: 'Grupo', purpose: 'Finalidade', owner: 'Responsável', key: 'Chave', label: 'Rótulo', type: 'Tipo', helpText: 'Texto de ajuda',
    priority: 'Prioridade', required: 'Obrigatório na criação', source: 'Origem', maintainer: 'Manutenção', sensitivity: 'Sensibilidade',
    example: 'Exemplo sintético', defaultValue: 'Valor predefinido', optionValue: 'Valor da opção', optionLabel: 'Rótulo da opção', target: 'Tipo relacionado',
    coverage: 'Cobertura funcional', setup: 'Configuração e dependências', readiness: 'Verificações antes de executar o processo',
    json: 'JSON deste tipo', yes: 'Sim', no: 'Não', core: 'Essencial ao modelo', conditional: 'Condicional', optional: 'Opcional',
    included: 'Incluído', external: 'Sistema externo', case: 'Caso', not_applicable: 'Não aplicável', pending: 'Por decidir',
    warning: 'Especificação para criação manual. Este JSON não é um contrato de importação Provia. Os ícones provêm da referência incluída; confirme a versão de destino. Copiar não cria tipos, campos ou registos.',
    instructions: 'Crie os tipos antes de configurar as relações. Copie cada valor para o campo correspondente. Os nomes relacionados são referências do catálogo, não IDs de destino. Campos essenciais ao modelo podem ser opcionais na criação.'
  } : {
    copy: 'Copy', copied: 'Copied.', fallback: 'Text selected. Press Ctrl+C or ⌘C to copy.', search: 'Search types and fields',
    download: 'Download JSON', print: 'Print', name: 'Type name', description: 'Description', icon: 'Icon', pattern: 'Native Name convention',
    fields: 'Fields', group: 'Group', purpose: 'Purpose', owner: 'Owner', key: 'Key', label: 'Label', type: 'Type', helpText: 'Help text',
    priority: 'Priority', required: 'Required at creation', source: 'Source', maintainer: 'Maintainer', sensitivity: 'Sensitivity',
    example: 'Synthetic example', defaultValue: 'Default value', optionValue: 'Option value', optionLabel: 'Option label', target: 'Related type',
    coverage: 'Functional coverage', setup: 'Setup and dependencies', readiness: 'Checks before process execution', json: 'Type JSON', yes: 'Yes', no: 'No',
    core: 'Core to the model', conditional: 'Conditional', optional: 'Optional', included: 'Included', external: 'External system', case: 'Case', not_applicable: 'Not applicable', pending: 'Pending',
    warning: 'Manual setup specification. This JSON is not a Provia import contract. Icons come from the bundled reference; confirm the destination version. Copying does not create types, fields or records.',
    instructions: 'Create the types before configuring relationships. Copy each value into its corresponding field. Related type names are catalogue references, not destination IDs. Core model fields can be optional at creation.'
  };
  let sequence = 0;
  const box = (label, value) => {
    const id = `value-${sequence++}`;
    return `<div class="value"><div class="value-heading"><label for="${id}">${escape(label)}</label><button type="button" data-copy="${id}" aria-label="${escape(labels.copy + ': ' + label)}">${labels.copy}</button></div><textarea id="${id}" rows="${Math.min(6, Math.max(1, Math.ceil(display(value).length / 85)))}" readonly>${escape(display(value))}</textarea></div>`;
  };
  const list = (title, entries) => `<h3>${escape(title)}</h3><ul>${entries.map(entry => `<li>${escape(entry)}</li>`).join('')}</ul>`;
  const sections = catalogue.types.map((type, index) => `<section id="type-${index}" data-catalogue-type>
    <h2>${index + 1}. ${escape(type.name)} <small>${type.fields.length} ${labels.fields.toLowerCase()}</small></h2>
    <p>${escape(type.purpose)}</p><p>${labels.owner}: ${escape(type.owner)}</p>
    <div class="grid">${box(labels.name, type.name)}${box(labels.icon, type.icon)}${box(labels.description, type.description)}${box(labels.pattern, type.namePattern)}</div>
    <h3>${labels.fields}</h3>${type.fields.map(field => `<article><h4>${escape(field.label)} <small>${escape(field.group)}</small></h4>
      <p>${escape(labels[field.priority])} · ${labels.required}: ${field.required ? labels.yes : labels.no} · ${escape(field.type)}</p>
      <div class="grid">${box(labels.key, field.key)}${box(labels.label, field.label)}${box(labels.type, field.type)}${box(labels.group, field.group)}${box(labels.helpText, field.helpText)}${box(labels.example, field.example)}
      ${field.targetType ? box(labels.target, field.targetType) : ''}${Object.hasOwn(field, 'defaultValue') ? box(labels.defaultValue, field.defaultValue) : ''}</div>
      ${(field.options ?? []).map(option => `<div class="grid option">${box(labels.optionValue, option.value)}${box(labels.optionLabel, option.label)}</div>`).join('')}
      <dl>${['purpose', 'source', 'maintainer', 'sensitivity'].map(name => `<dt>${labels[name]}</dt><dd>${escape(field[name])}</dd>`).join('')}</dl></article>`).join('')}
    <h3>${labels.coverage}</h3><ul>${type.coverage.map(entry => `<li><strong>${escape(entry.dimension)}</strong>: ${escape(labels[entry.decision])}. ${escape(entry.reason)}</li>`).join('')}</ul>
    ${list(labels.setup, type.setup)}${list(labels.readiness, type.readiness)}<details><summary>${labels.json}</summary>${box(labels.json, type)}</details></section>`).join('');
  const json = JSON.stringify(catalogue, null, 2).replace(/</g, '\\u003c');
  return `<!doctype html><html lang="${escape(catalogue.language)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(catalogue.title)}</title>
  <style>
  *{box-sizing:border-box}body{margin:0;background:#f4f6f9;color:#182230;font:16px/1.55 system-ui,sans-serif}header,main{max-width:1120px;margin:auto;padding:24px}h1{font-size:30px}h2{font-size:24px}h4{margin:0 0 12px;font-size:18px}small{font-size:13px;font-weight:400;color:#475467}button,input,textarea{font:inherit}button{padding:6px 12px;border:1px solid #98a2b3;border-radius:6px;background:white;color:#1d2939;cursor:pointer}button:hover{background:#eaf0ff}button:focus-visible,input:focus-visible,textarea:focus-visible,a:focus-visible{outline:3px solid #2563eb;outline-offset:2px}nav{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0}nav a{color:#244da8;padding:4px 8px}.toolbar{display:flex;flex-wrap:wrap;gap:10px;align-items:center}input{padding:10px;border:1px solid #98a2b3;border-radius:6px;min-width:260px}section{background:#fff;border:1px solid #d0d5dd;border-radius:12px;margin:20px 0;padding:24px;scroll-margin-top:16px}article{border-top:1px solid #d0d5dd;padding:22px 0}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.value-heading{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:4px}label{font-size:13px;font-weight:600}textarea{display:block;width:100%;min-height:44px;padding:9px;border:1px solid #c7cdd6;border-radius:6px;background:#f9fafb;resize:vertical;color:#182230}dl{display:grid;grid-template-columns:140px 1fr;gap:4px 12px;font-size:14px}dt{color:#475467}dd{margin:0}.option{padding:8px 0}.notice{padding:14px;background:#eaf0ff;border-radius:8px}#status{min-height:24px}summary{cursor:pointer}li{margin-bottom:8px}[hidden]{display:none!important}@media(max-width:650px){.grid{grid-template-columns:1fr}header,main,section{padding:16px}dl{grid-template-columns:1fr}}@media print{body{background:white}button,nav,.toolbar,#status,details{display:none}section{break-before:page;border:0;padding:0}section[hidden]{display:block!important}textarea{border:0;resize:none;overflow:visible}article{break-inside:avoid}header,main{max-width:none;padding:0}}
  </style></head><body><header><h1>${escape(catalogue.title)}</h1><p>${escape(catalogue.country)} · ${catalogue.types.length} ${pt ? 'tipos de entidade' : 'entity types'}</p>
  <p class="notice">${labels.warning}</p><p>${labels.instructions}</p><ul>${catalogue.notes.map(note => `<li>${escape(note)}</li>`).join('')}</ul>
  <div class="toolbar"><label for="search">${labels.search}</label><input id="search" type="search"><button id="download">${labels.download}</button><button id="print">${labels.print}</button></div>
  <p id="status" role="status" aria-live="polite"></p><nav aria-label="${pt ? 'Tipos' : 'Types'}">${catalogue.types.map((type, i) => `<a href="#type-${i}">${escape(type.name)}</a>`).join('')}</nav></header><main>${sections}</main>
  <script type="application/json" id="catalogue-data">${json}</script><script>
  const status = document.getElementById('status');
  const fitText = () => document.querySelectorAll('textarea').forEach(area => {
    area.style.height = 'auto';
    area.style.height = (area.scrollHeight + 2) + 'px';
  });
  fitText();
  window.addEventListener('resize', fitText);
  window.addEventListener('beforeprint', fitText);
  window.addEventListener('afterprint', fitText);
  document.querySelectorAll('details').forEach(panel => panel.addEventListener('toggle', fitText));
  document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
    const area = document.getElementById(button.dataset.copy);
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('fallback');
      await navigator.clipboard.writeText(area.value);
      status.textContent = ${JSON.stringify(labels.copied)};
    } catch {
      area.focus(); area.select();
      let copied = false;
      try { copied = document.execCommand('copy'); } catch {}
      status.textContent = copied ? ${JSON.stringify(labels.copied)} : ${JSON.stringify(labels.fallback)};
    }
  }));
  document.getElementById('search').addEventListener('input', event => {
    const term = event.target.value.toLocaleLowerCase();
    document.querySelectorAll('[data-catalogue-type]').forEach(section => {
      const values = Array.from(section.querySelectorAll('textarea')).map(area => area.value).join(' ');
      section.hidden = !(section.textContent + values).toLocaleLowerCase().includes(term);
    });
    fitText();
  });
  document.querySelectorAll('nav a').forEach(link => link.addEventListener('click', () => {
    document.getElementById('search').value = '';
    document.querySelectorAll('[data-catalogue-type]').forEach(section => { section.hidden = false; });
    fitText();
  }));
  document.getElementById('download').addEventListener('click', () => {
    const blob = new Blob([document.getElementById('catalogue-data').textContent], {type:'application/json'});
    const url = URL.createObjectURL(blob), link = document.createElement('a');
    link.href = url; link.download = 'catalogue.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  document.getElementById('print').addEventListener('click', () => window.print());
  </script></body></html>`;
}

try {
  const [input, flag, output, ...extra] = process.argv.slice(2);
  if (!input || extra.length || !((flag === '--check' && !output) || (flag === '--output' && output))) throw new Error('Usage: node scripts/build-entity-catalogue.mjs catalogue.json --check | --output catalogue.html');
  if (output && (resolve(input) === resolve(output) || extname(output).toLowerCase() !== '.html')) throw new Error('Output must be a separate .html file');
  const catalogue = JSON.parse(readFileSync(input, 'utf8'));
  validate(catalogue);
  if (output) writeFileSync(output, render(catalogue));
  console.log(`${catalogue.types.length} types checked. Editorial catalogue only, not Provia import validation.${output ? ' HTML created.' : ''}`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
