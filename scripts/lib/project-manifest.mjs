// Shared logic for provia-project/v1 manifests: shape checks, reference resolution and the generated handover.
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { validateTypes } from '../build-entity-catalogue.mjs';
import * as engine from '../../contracts/workflow-v1/engine.mjs';

export const SCHEMA = 'provia-project/v1';
const KEY = /^[A-Za-z0-9][A-Za-z0-9_.-]*$/;
const ACTION_TYPES = new Set(['standard', 'decision', 'sub_workflow', 'notification', 'wait', 'http_request', 'form_fill']);
const SOURCE_KINDS = new Set(['sop', 'policy', 'checklist', 'export', 'interview', 'catalogue', 'other']);
const WORKFLOW_STATUS = new Set(['design', 'packaged', 'validated', 'imported', 'change_planned']);
const FORM_STATUS = new Set(['designed', 'created', 'linked']);
const RECEIPT_KINDS = new Set(['entity_type', 'group', 'workflow', 'form', 'tag']);
const RESOLVING = new Set(['created', 'updated', 'no_op']);
const GROUP_FLAGS = new Set(['single_person', 'alias', 'segregation', 'requester', 'external', 'unnamed']);

const text = value => typeof value === 'string' && value.trim().length > 0;
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const list = value => Array.isArray(value) ? value : [];

/** Returns { errors, warnings }. Errors make the manifest unusable; warnings are design gaps the map also shows. */
export function checkManifest(manifest, baseDir) {
  const errors = [], warnings = [];
  const error = (location, message) => errors.push({ path: location, message });
  const warn = (location, message) => warnings.push({ path: location, message });
  if (!object(manifest) || manifest.schemaVersion !== SCHEMA) return { errors: [{ path: 'schemaVersion', message: `Expected ${SCHEMA}` }], warnings };
  const project = manifest.project;
  if (!object(project)) error('project', 'Missing project block');
  else {
    for (const name of ['key', 'title', 'language', 'country']) if (!text(project[name])) error(`project.${name}`, 'Required text');
    if (text(project.key) && !KEY.test(project.key)) error('project.key', 'Use a stable ASCII identifier');
  }
  const organization = manifest.organization;
  if (!object(organization)) error('organization', 'Missing organization block');
  else if (!['disconnected', 'connected'].includes(organization.mode)) error('organization.mode', 'Use disconnected or connected');
  else if (organization.mode === 'connected' && !(text(organization.tenantId) && text(organization.productRevision))) error('organization', 'Connected mode requires tenantId and productRevision from org_get_context');

  const unique = (items, location, field) => {
    const seen = new Set();
    for (const [index, item] of items.entries()) {
      const value = item?.[field];
      if (!text(value) || !KEY.test(value)) error(`${location}[${index}].${field}`, 'Required stable ASCII identifier');
      else if (seen.has(value)) error(`${location}[${index}].${field}`, `Duplicate ${field} ${value}`);
      seen.add(value);
    }
    return seen;
  };
  for (const name of ['sources', 'entityTypes', 'groups', 'workflows', 'forms', 'aiProfiles', 'decisions', 'receipts']) {
    if (manifest[name] !== undefined && !Array.isArray(manifest[name])) error(name, 'Must be an array');
  }
  const sources = list(manifest.sources), groups = list(manifest.groups), workflows = list(manifest.workflows);
  const forms = list(manifest.forms), profiles = list(manifest.aiProfiles), decisions = list(manifest.decisions), receipts = list(manifest.receipts);
  const sourceIds = unique(sources, 'sources', 'id');
  const sections = new Map();
  for (const [index, source] of sources.entries()) {
    if (!text(source.title)) error(`sources[${index}].title`, 'Required');
    if (!SOURCE_KINDS.has(source.kind)) error(`sources[${index}].kind`, 'Unknown source kind');
    const anchors = new Set();
    for (const [i, section] of list(source.sections).entries()) {
      if (!object(section) || !text(section.anchor)) error(`sources[${index}].sections[${i}]`, 'Section needs an anchor');
      else if (anchors.has(section.anchor)) error(`sources[${index}].sections[${i}]`, `Duplicate anchor ${section.anchor}`);
      else anchors.add(section.anchor);
    }
    if (text(source.id)) sections.set(source.id, anchors);
  }
  const checkSourceRefs = (refs, location) => {
    for (const [i, ref] of list(refs).entries()) {
      if (!object(ref) || !sourceIds.has(ref.source)) { error(`${location}[${i}]`, 'Unknown source id'); continue; }
      const anchors = sections.get(ref.source);
      if (ref.section !== undefined && anchors.size && !anchors.has(ref.section)) error(`${location}[${i}].section`, `Source ${ref.source} has no section ${ref.section}`);
    }
  };
  const typeKeys = unique(list(manifest.entityTypes), 'entityTypes', 'key');
  if (list(manifest.entityTypes).length) {
    try { validateTypes(manifest.entityTypes); } catch (caught) { error('entityTypes', caught.message); }
  }
  const groupKeys = unique(groups, 'groups', 'key');
  const parents = new Map(groups.map(group => [group.key, group.parentKey ?? null]));
  for (const [index, group] of groups.entries()) {
    if (!text(group.name)) error(`groups[${index}].name`, 'Required');
    if (group.parentKey != null) {
      if (!groupKeys.has(group.parentKey)) error(`groups[${index}].parentKey`, 'Unknown group key');
      else if (parents.get(group.parentKey)) error(`groups[${index}].parentKey`, 'Provia allows one level of sub-groups; the parent already has a parent');
      if (group.parentKey === group.key) error(`groups[${index}].parentKey`, 'A group cannot be its own parent');
    }
    for (const [i, member] of list(group.members).entries()) {
      if (!object(member) || !(text(member.role) || text(member.email))) error(`groups[${index}].members[${i}]`, 'A member needs a role or an email');
      if (member.email != null && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) error(`groups[${index}].members[${i}].email`, 'Not an email address; never use IDs here');
    }
    for (const [i, flag] of list(group.flags).entries()) {
      if (!object(flag) || !GROUP_FLAGS.has(flag.code)) error(`groups[${index}].flags[${i}]`, 'Unknown flag code');
    }
    checkSourceRefs(group.sourceRefs, `groups[${index}].sourceRefs`);
  }
  const workflowKeys = unique(workflows, 'workflows', 'key');
  const formKeys = unique(forms, 'forms', 'key');
  const profileKeys = unique(profiles, 'aiProfiles', 'key');
  const actionsByWorkflow = new Map();
  const ownedGroups = new Set();
  for (const [index, workflow] of workflows.entries()) {
    const at = `workflows[${index}]`;
    if (!text(workflow.name)) error(`${at}.name`, 'Required');
    if (workflow.prefix !== undefined && !/^[A-Z0-9]{2,10}$/.test(workflow.prefix)) error(`${at}.prefix`, 'Prefix is 2–10 uppercase alphanumeric characters');
    if (workflow.status !== undefined && !WORKFLOW_STATUS.has(workflow.status)) error(`${at}.status`, 'Unknown workflow status');
    checkSourceRefs(workflow.sourceRefs, `${at}.sourceRefs`);
    const localIds = unique(list(workflow.actions), `${at}.actions`, 'localId');
    actionsByWorkflow.set(workflow.key, localIds);
    for (const [i, action] of list(workflow.actions).entries()) {
      const loc = `${at}.actions[${i}]`;
      if (!text(action.name)) error(`${loc}.name`, 'Required');
      if (!ACTION_TYPES.has(action.type)) error(`${loc}.type`, 'Unsupported action type');
      checkSourceRefs(action.sourceRefs, `${loc}.sourceRefs`);
      const ref = action.assigneeRef;
      if (ref != null) {
        if (!text(ref)) error(`${loc}.assigneeRef`, 'Use a group key, creator, previous or ai:<profile key>');
        else if (ref.startsWith('ai:')) { if (!profileKeys.has(ref.slice(3))) error(`${loc}.assigneeRef`, 'Unknown AI profile key'); }
        else if (!['creator', 'previous'].includes(ref)) {
          if (!groupKeys.has(ref)) error(`${loc}.assigneeRef`, `Unknown group key ${ref}`);
          else ownedGroups.add(ref);
        }
      } else if (['standard', 'decision', 'form_fill'].includes(action.type)) warn(`${loc}.assigneeRef`, `Action ${action.localId} has no owner`);
      if (action.formRef != null && !formKeys.has(action.formRef)) error(`${loc}.formRef`, 'Unknown form key');
      if (action.type === 'form_fill' && action.formRef == null) warn(`${loc}.formRef`, `Form Fill action ${action.localId} has no form yet`);
      for (const [j, key] of list(action.entityRefs).entries()) if (!typeKeys.has(key)) error(`${loc}.entityRefs[${j}]`, `Unknown entity type key ${key}`);
      for (const [j, folded] of list(action.folded).entries()) if (!object(folded) || !text(folded.summary)) error(`${loc}.folded[${j}]`, 'A folded step needs a summary');
      if (action.due != null && !(object(action.due) && (Number.isInteger(action.due.offsetDays) || Number.isInteger(action.due.offsetHours)))) error(`${loc}.due`, 'due needs integer offsetDays or offsetHours');
    }
    for (const [i, key] of list(workflow.subWorkflowRefs).entries()) {
      if (!workflowKeys.has(key)) error(`${at}.subWorkflowRefs[${i}]`, `Unknown workflow key ${key}`);
      else if (key === workflow.key) error(`${at}.subWorkflowRefs[${i}]`, 'A workflow cannot be its own sub-workflow');
    }
    if (text(workflow.file) && baseDir) {
      const file = path.resolve(baseDir, workflow.file);
      if (!existsSync(file)) warn(`${at}.file`, `${workflow.file} not found next to the manifest`);
      else {
        try {
          const parsed = engine.parseYamlToDraft(readFileSync(file, 'utf8'));
          const draft = parsed.draft ?? {};
          const yamlIds = list(draft.actions).map(action => action?.id);
          const manifestIds = [...localIds];
          if (yamlIds.join('\n') !== manifestIds.join('\n')) error(`${at}.file`, `Action ids in ${workflow.file} (${yamlIds.join(', ')}) differ from the manifest (${manifestIds.join(', ')})`);
          if (workflow.prefix && draft.metadata?.prefix !== workflow.prefix) error(`${at}.file`, `Prefix in ${workflow.file} differs from the manifest`);
        } catch { error(`${at}.file`, `${workflow.file} could not be parsed`); }
      }
    }
  }
  for (const group of groups) if (!ownedGroups.has(group.key) && !list(group.flags).some(flag => ['requester', 'external'].includes(flag.code))) warn(`groups.${group.key}`, `Group ${group.key} owns no action`);
  for (const [index, form] of forms.entries()) {
    const at = `forms[${index}]`;
    if (!text(form.title)) error(`${at}.title`, 'Required');
    if (!['trigger', 'action'].includes(form.kind)) error(`${at}.kind`, 'Use trigger or action');
    if (form.status !== undefined && !FORM_STATUS.has(form.status)) error(`${at}.status`, 'Unknown form status');
    if (!workflowKeys.has(form.workflowRef)) error(`${at}.workflowRef`, 'Unknown workflow key');
    else if (form.kind === 'action') {
      const ids = actionsByWorkflow.get(form.workflowRef);
      if (!ids?.has(form.actionRef)) error(`${at}.actionRef`, 'Unknown action in that workflow');
      else {
        const action = workflows.find(w => w.key === form.workflowRef).actions.find(a => a.localId === form.actionRef);
        if (action.type !== 'form_fill') error(`${at}.actionRef`, 'An action form must point at a form_fill action');
      }
    } else if (form.actionRef != null) error(`${at}.actionRef`, 'A trigger form has no actionRef');
  }
  for (const [index, profile] of profiles.entries()) {
    if (!text(profile.name)) error(`aiProfiles[${index}].name`, 'Required');
    if (profile.workflowRef != null && !workflowKeys.has(profile.workflowRef)) error(`aiProfiles[${index}].workflowRef`, 'Unknown workflow key');
  }
  unique(decisions, 'decisions', 'id');
  for (const [index, decision] of decisions.entries()) {
    if (!text(decision.question)) error(`decisions[${index}].question`, 'Required');
    if (!['open', 'resolved'].includes(decision.status)) error(`decisions[${index}].status`, 'Use open or resolved');
    else if (decision.status === 'resolved' && !text(decision.resolution)) error(`decisions[${index}].resolution`, 'A resolved decision records its resolution');
    else if (decision.status === 'open' && !text(decision.owner)) warn(`decisions[${index}].owner`, `Open decision ${decision.id} has no owner`);
    checkSourceRefs(decision.sourceRefs, `decisions[${index}].sourceRefs`);
  }
  const keysByKind = { entity_type: typeKeys, group: groupKeys, workflow: workflowKeys, form: formKeys, tag: null };
  for (const [index, receipt] of receipts.entries()) {
    const at = `receipts[${index}]`;
    if (!object(receipt) || !text(receipt.tool) || !text(receipt.outcome)) { error(at, 'A receipt needs tool and outcome'); continue; }
    if (!object(receipt.ref) || !RECEIPT_KINDS.has(receipt.ref.kind)) { error(`${at}.ref`, 'ref.kind must be entity_type, group, workflow, form or tag'); continue; }
    const keys = keysByKind[receipt.ref.kind];
    if (keys && !keys.has(receipt.ref.key)) error(`${at}.ref.key`, `No ${receipt.ref.kind} with key ${receipt.ref.key}`);
    if (RESOLVING.has(receipt.outcome) && !text(receipt.resource?.id)) error(`${at}.resource.id`, 'A resolving receipt carries the destination id');
  }
  return { errors, warnings };
}

/** Index of resolving receipts by kind:key. */
export function receiptIndex(manifest) {
  const index = new Map();
  for (const receipt of list(manifest.receipts)) {
    if (RESOLVING.has(receipt.outcome) && receipt.ref) index.set(`${receipt.ref.kind}:${receipt.ref.key}`, receipt);
  }
  return index;
}

/** Everything the map and the handover need: nodes, edges and unresolved items. */
export function analyze(manifest) {
  const receipts = receiptIndex(manifest);
  const resolved = (kind, key) => receipts.get(`${kind}:${key}`) ?? null;
  const unresolved = [];
  const add = (item) => unresolved.push(item);
  const nodes = [], edges = [];
  const node = (id, kind, label, data, status = 'neutral') => { nodes.push({ id, kind, label, data, status }); return id; };
  const edge = (from, to, kind, status = 'neutral') => edges.push({ from, to, kind, status });
  const sectionNodes = new Set();
  const sourceNode = (ref) => {
    if (!ref?.source) return null;
    if (ref.section == null) return `source:${ref.source}`;
    const id = `section:${ref.source}:${ref.section}`;
    sectionNodes.add(id);
    return id;
  };
  for (const source of list(manifest.sources)) node(`source:${source.id}`, 'source', source.title, source);
  for (const type of list(manifest.entityTypes)) {
    const receipt = resolved('entity_type', type.key);
    node(`entity:${type.key}`, 'entity_type', type.name, type, receipt ? 'resolved' : 'unresolved');
    if (!receipt) add({ kind: 'entity_type', key: type.key, name: type.name, what: 'create_entity_type' });
  }
  for (const group of list(manifest.groups)) {
    const receipt = resolved('group', group.key);
    node(`group:${group.key}`, 'group', group.name, group, receipt ? 'resolved' : 'unresolved');
    if (!receipt) add({ kind: 'group', key: group.key, name: group.name, what: 'create_group', members: list(group.members) });
    for (const flag of list(group.flags)) add({ kind: 'group', key: group.key, name: group.name, what: `flag_${flag.code}`, detail: flag.detail });
    if (group.parentKey) edge(`group:${group.parentKey}`, `group:${group.key}`, 'parent');
    for (const ref of list(group.sourceRefs)) { const from = sourceNode(ref); if (from) edge(from, `group:${group.key}`, 'justifies'); }
  }
  for (const profile of list(manifest.aiProfiles)) {
    node(`ai:${profile.key}`, 'ai_profile', profile.name, profile, 'unresolved');
    add({ kind: 'ai_profile', key: profile.key, name: profile.name, what: 'configure_ai_profile' });
  }
  for (const form of list(manifest.forms)) {
    const receipt = resolved('form', form.key);
    node(`form:${form.key}`, 'form', form.title, form, receipt ? 'resolved' : 'unresolved');
    if (!receipt) add({ kind: 'form', key: form.key, name: form.title, what: form.kind === 'trigger' ? 'create_trigger_form' : 'create_and_link_form', workflow: form.workflowRef, action: form.actionRef });
    if (form.kind === 'trigger') edge(`form:${form.key}`, `workflow:${form.workflowRef}`, 'starts');
  }
  for (const workflow of list(manifest.workflows)) {
    const receipt = resolved('workflow', workflow.key);
    node(`workflow:${workflow.key}`, 'workflow', workflow.name, workflow, receipt ? 'resolved' : 'unresolved');
    if (!receipt) add({ kind: 'workflow', key: workflow.key, name: workflow.name, what: 'import_workflow_draft', file: workflow.file ?? null, status: workflow.status ?? 'design' });
    for (const ref of list(workflow.sourceRefs)) { const from = sourceNode(ref); if (from) edge(from, `workflow:${workflow.key}`, 'justifies'); }
    for (const key of list(workflow.subWorkflowRefs)) edge(`workflow:${workflow.key}`, `workflow:${key}`, 'sub_workflow', resolved('workflow', key) ? 'resolved' : 'unresolved');
    for (const action of list(workflow.actions)) {
      const id = `action:${workflow.key}:${action.localId}`;
      let status = 'neutral';
      const ref = action.assigneeRef;
      if (ref == null) {
        if (['standard', 'decision', 'form_fill'].includes(action.type)) { status = 'unresolved'; add({ kind: 'action', key: action.localId, name: action.name, workflow: workflow.key, what: 'assign_owner' }); }
      } else if (ref.startsWith('ai:')) {
        edge(id, `ai:${ref.slice(3)}`, 'assignee', 'unresolved');
        add({ kind: 'action', key: action.localId, name: action.name, workflow: workflow.key, what: 'assign_ai_profile', ref });
      } else if (!['creator', 'previous'].includes(ref)) {
        const ok = resolved('group', ref);
        edge(id, `group:${ref}`, 'assignee', ok ? 'resolved' : 'unresolved');
        if (!ok) add({ kind: 'action', key: action.localId, name: action.name, workflow: workflow.key, what: 'assign_group', ref });
      }
      if (action.formRef) {
        const ok = resolved('form', action.formRef);
        edge(id, `form:${action.formRef}`, 'form', ok ? 'resolved' : 'unresolved');
      } else if (action.type === 'form_fill') { status = 'unresolved'; add({ kind: 'action', key: action.localId, name: action.name, workflow: workflow.key, what: 'design_form' }); }
      for (const key of list(action.entityRefs)) edge(id, `entity:${key}`, 'entity', resolved('entity_type', key) ? 'resolved' : 'unresolved');
      for (const sref of list(action.sourceRefs)) { const from = sourceNode(sref); if (from) edge(from, id, 'source'); }
      if (action.due == null && ['standard', 'decision', 'form_fill'].includes(action.type)) add({ kind: 'action', key: action.localId, name: action.name, workflow: workflow.key, what: 'due_open' });
      node(id, 'action', action.name, { ...action, workflow: workflow.key }, status);
    }
  }
  for (const id of sectionNodes) {
    const [, source, ...rest] = id.split(':');
    const anchor = rest.join(':');
    const entry = list(manifest.sources).find(item => item.id === source);
    const section = list(entry?.sections).find(item => item.anchor === anchor);
    node(id, 'section', `§${anchor} ${section?.title ?? ''}`.trim(), { source, anchor, title: section?.title ?? null });
    edge(`source:${source}`, id, 'contains');
  }
  const decisions = list(manifest.decisions);
  for (const decision of decisions) if (decision.status === 'open') add({ kind: 'decision', key: decision.id, name: decision.question, what: 'decide', owner: decision.owner ?? null });
  return { nodes, edges, unresolved, decisions, receipts: list(manifest.receipts) };
}

const LABELS = {
  pt: {
    title: 'Entrega de configuração', generated: 'Gerado a partir de `provia-project.json`', mode: 'Modo', disconnected: 'sem ligação ao Provia (configuração manual)', connected: 'ligado ao Provia (recibos registados)',
    status: 'Estado', unresolved: 'Configuração pendente', none: 'Nada pendente.', item: 'Item', action: 'O que fazer', where: 'Onde',
    groups: 'Grupos a criar', members: 'Membros propostos', types: 'Tipos de entidade a criar', forms: 'Formulários a criar e ligar', profiles: 'Perfis de IA a configurar',
    decisions: 'Decisões em aberto', owner: 'Dono', receipts: 'Recibos (já resolvido)', validation: 'Validação', notes: 'Notas de configuração', flags: 'Sinalizações de grupos',
    validationText: 'Execute o validador a partir da raiz do plugin, com o caminho de cada ficheiro relativo à pasta do manifesto, e guarde a saída exacta. Um resultado sem erros deixa a validação de destino e a publicação pendentes.',
    footer: 'Este ficheiro é gerado pelo mapa do projecto; volte a gerá-lo depois de cada alteração ao manifesto. Não substitui a revisão do dono do processo nem a pré-visualização de importação no Provia.',
    what: {
      create_entity_type: 'Criar o tipo de entidade com os campos do catálogo (separador Catálogo do mapa)', create_group: 'Criar o grupo e adicionar os membros', create_trigger_form: 'Criar o formulário de entrada e ligá-lo ao workflow',
      create_and_link_form: 'Criar o formulário e ligá-lo à acção Form Fill', configure_ai_profile: 'Configurar o perfil de IA no Provia e atribuí-lo à acção', import_workflow_draft: 'Importar o YAML como rascunho e rever a pré-visualização',
      assign_owner: 'Definir o responsável; a acção não tem dono no desenho', assign_group: 'Atribuir o grupo à acção depois de o grupo existir', assign_ai_profile: 'Atribuir o perfil de IA à acção', design_form: 'Desenhar o formulário desta acção Form Fill',
      due_open: 'Definir o prazo; o desenho não propõe `due`', decide: 'Decidir', flag_single_person: 'Actor de pessoa única: definir substituto', flag_alias: 'Nomes alternativos: confirmar a designação', flag_segregation: 'Segregação de funções: confirmar responsáveis distintos',
      flag_requester: 'Requerente: usa o criador do caso', flag_external: 'Actor externo: não é um grupo', flag_unnamed: 'Responsável sem nome nas fontes'
    }
  },
  en: {
    title: 'Setup handover', generated: 'Generated from `provia-project.json`', mode: 'Mode', disconnected: 'no Provia connection (manual configuration)', connected: 'connected to Provia (receipts recorded)',
    status: 'Status', unresolved: 'Pending configuration', none: 'Nothing pending.', item: 'Item', action: 'What to do', where: 'Where',
    groups: 'Groups to create', members: 'Proposed members', types: 'Entity types to create', forms: 'Forms to create and link', profiles: 'AI profiles to configure',
    decisions: 'Open decisions', owner: 'Owner', receipts: 'Receipts (already resolved)', validation: 'Validation', notes: 'Setup notes', flags: 'Group flags',
    validationText: 'Run the validator from the plugin root, with each file path relative to the manifest folder, and keep the exact output. A clean result still leaves destination validation and publication pending.',
    footer: 'This file is generated by the project map; regenerate it after every manifest change. It does not replace the process owner review or the Provia import preview.',
    what: {
      create_entity_type: 'Create the entity type with the catalogue fields (Catalogue tab of the map)', create_group: 'Create the group and add the members', create_trigger_form: 'Create the intake form and link it to the workflow',
      create_and_link_form: 'Create the form and link it to the Form Fill action', configure_ai_profile: 'Configure the AI profile in Provia and assign it to the action', import_workflow_draft: 'Import the YAML as a draft and review the preview',
      assign_owner: 'Set the owner; the action has none in the design', assign_group: 'Assign the group to the action once the group exists', assign_ai_profile: 'Assign the AI profile to the action', design_form: 'Design the form for this Form Fill action',
      due_open: 'Set the deadline; the design proposes no `due`', decide: 'Decide', flag_single_person: 'Single-person actor: name a delegate', flag_alias: 'Alternative names: confirm the designation', flag_segregation: 'Segregation of duties: confirm distinct owners',
      flag_requester: 'Requester: uses the case creator', flag_external: 'External actor: not a group', flag_unnamed: 'Owner unnamed in the sources'
    }
  }
};
export const labelsFor = language => (String(language ?? '').toLowerCase().startsWith('pt') ? LABELS.pt : LABELS.en);

/** Markdown handover generated from unresolved items, open decisions, receipts and setup notes. */
export function renderSetup(manifest, analysis = analyze(manifest)) {
  const L = labelsFor(manifest.project.language);
  const lines = [];
  const push = (...items) => lines.push(...items);
  const where = item => [item.workflow, item.key].filter(Boolean).join(' / ');
  push(`# ${manifest.project.title}: ${L.title}`, '', `${manifest.project.country} · ${manifest.project.language}${manifest.project.timezone ? ' · ' + manifest.project.timezone : ''}. ${L.generated} (${manifest.project.generator ?? 'provia-skills'}${manifest.project.updatedAt ? ', ' + manifest.project.updatedAt : ''}).`, '');
  push(`## ${L.status}`, '', `${L.mode}: ${manifest.organization.mode === 'connected' ? L.connected : L.disconnected}.`, '');
  const byKind = kind => analysis.unresolved.filter(item => item.kind === kind);
  const groups = byKind('group').filter(item => item.what === 'create_group');
  const flags = byKind('group').filter(item => item.what.startsWith('flag_'));
  const types = byKind('entity_type'), forms = byKind('form'), profiles = byKind('ai_profile');
  const actions = [...byKind('workflow'), ...byKind('action')];
  push(`## ${L.unresolved}`, '');
  if (!actions.length) push(L.none, '');
  else {
    push(`| ${L.where} | ${L.item} | ${L.action} |`, '| --- | --- | --- |');
    for (const item of actions) push(`| ${where(item)} | ${item.name} | ${L.what[item.what]}${item.ref ? ` (\`${item.ref}\`)` : ''}${item.file ? ` (\`${item.file}\`)` : ''} |`);
    push('');
  }
  if (groups.length) {
    push(`## ${L.groups}`, '');
    for (const item of groups) {
      const group = manifest.groups.find(g => g.key === item.key);
      const members = item.members.map(member => member.email ? `${member.role ? member.role + ' ' : ''}<${member.email}>` : member.role).join(', ');
      push(`- \`${item.key}\` ${item.name}${group.parentKey ? ` (↳ \`${group.parentKey}\`)` : ''}${group.purpose ? `: ${group.purpose}` : ''}${members ? `. ${L.members}: ${members}` : ''}`);
    }
    push('');
  }
  if (flags.length) { push(`## ${L.flags}`, ''); for (const item of flags) push(`- \`${item.key}\`: ${L.what[item.what]}${item.detail ? `. ${item.detail}` : ''}`); push(''); }
  if (types.length) { push(`## ${L.types}`, ''); for (const item of types) push(`- \`${item.key}\` ${item.name}`); push(''); }
  if (forms.length) { push(`## ${L.forms}`, ''); for (const item of forms) push(`- \`${item.key}\` ${item.name}: ${L.what[item.what]} (${where(item)})`); push(''); }
  if (profiles.length) { push(`## ${L.profiles}`, ''); for (const item of profiles) push(`- \`${item.key}\` ${item.name}`); push(''); }
  const open = analysis.decisions.filter(decision => decision.status === 'open');
  if (open.length) { push(`## ${L.decisions}`, ''); for (const decision of open) push(`- **${decision.id}** ${decision.question}${decision.owner ? ` (${L.owner}: ${decision.owner})` : ''}`); push(''); }
  const notes = list(manifest.workflows).flatMap(workflow => list(workflow.setupNotes).map(note => ({ workflow: workflow.key, note })));
  if (notes.length) { push(`## ${L.notes}`, ''); for (const item of notes) push(`- \`${item.workflow}\`: ${item.note}`); push(''); }
  const files = list(manifest.workflows).filter(workflow => workflow.file);
  if (files.length) { push(`## ${L.validation}`, '', L.validationText, '', '```sh'); for (const workflow of files) push(`node scripts/validate-workflow.mjs ${workflow.file}`); push('```', ''); }
  const receipts = analysis.receipts.filter(receipt => RESOLVING.has(receipt.outcome));
  if (receipts.length) { push(`## ${L.receipts}`, ''); for (const receipt of receipts) push(`- ${receipt.ref.kind} \`${receipt.ref.key}\` → \`${receipt.resource?.id}\` (${receipt.tool}, ${receipt.outcome}${receipt.at ? ', ' + receipt.at : ''})`); push(''); }
  push(L.footer, '');
  return lines.join('\n');
}

export function loadManifest(file) {
  const manifest = JSON.parse(readFileSync(file, 'utf8'));
  return { manifest, baseDir: path.dirname(path.resolve(file)) };
}
