// Synthetic large project (thousands of objects) for testing the map at scale. Deterministic; no real organization data.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { emit } from '../../scripts/lib/yaml-emit.mjs';

const pad = (n, width = 4) => String(n).padStart(width, '0');
const BRIEF = (task) => `Tarefa: ${task}\nComo: 1. Abrir o caso e ler o pedido. 2. Confirmar os dados no sistema de origem. 3. Registar o resultado no campo indicado.\nEvidência: O campo preenchido e o comentário de confirmação.\nConcluído quando: O resultado está registado e a acção seguinte pode começar.\nExcepções: Se faltar informação, não concluir: comentar o que falta e devolver ao requerente.`;

export function buildLargeProject(options = {}) {
  const { workflows = 60, actions = 30, entities = 300, fields = 20, groups = 200, forms = 150, decisions = 800, sections = 12 } = options;
  const areas = ['financas', 'recursos_humanos', 'operacoes', 'compras', 'ti', 'juridico'];
  const manifest = {
    schemaVersion: 'provia-project/v1.1',
    project: { key: 'grande', title: 'Projecto de grande dimensão (sintético)', language: 'pt-AO', country: 'Angola', timezone: 'Africa/Luanda', currency: 'AOA', generator: 'provia-skills/test', updatedAt: '2026-09-21' },
    organization: { name: 'Organização sintética', sector: 'Serviços', mode: 'disconnected', tenantId: null, productRevision: null },
    sources: [], entityTypes: [], groups: [], workflows: [], forms: [], aiProfiles: [], decisions: [], receipts: [],
  };
  const sourceCount = Math.max(1, Math.ceil(workflows / 4));
  for (let s = 0; s < sourceCount; s++) manifest.sources.push({ id: `sop-${pad(s)}`, title: `Procedimento operacional ${pad(s)} da área ${areas[s % areas.length]}`, kind: 'sop', version: '1', effectiveDate: null, sections: Array.from({ length: sections }, (_, i) => ({ anchor: `${i + 1}`, title: `Secção ${i + 1} do procedimento ${pad(s)}` })) });
  for (let e = 0; e < entities; e++) {
    const key = `tipo_${pad(e)}`;
    const fieldList = [];
    for (let f = 0; f < fields; f++) {
      const kind = ['text', 'select', 'number', 'date', 'email', 'entity'][f % 6];
      const field = { key: `campo_${pad(f, 2)}`, label: `Campo ${pad(f, 2)} com acentuação (acção, secção)`, type: kind, required: f < 3, group: f < fields / 2 ? 'Identificação' : 'Relação', helpText: `Texto de ajuda do campo ${f} do tipo ${e}: instruções detalhadas para o preenchimento manual, incluindo a origem do valor.`, purpose: `Finalidade do campo ${f}.`, priority: f < 5 ? 'core' : f < 12 ? 'conditional' : 'optional', source: 'Documento do requerente', maintainer: 'Equipa responsável', sensitivity: 'Interna' };
      if (kind === 'select') { field.options = [{ value: 'activo', label: 'Activo' }, { value: 'suspenso', label: 'Suspenso' }, { value: 'encerrado', label: 'Encerrado' }]; field.example = 'activo'; field.defaultValue = 'activo'; }
      else if (kind === 'number') field.example = 42;
      else if (kind === 'entity') { field.targetType = `tipo_${pad((e + 1) % entities)}`; field.example = `Tipo ${pad((e + 1) % entities)} exemplo`; }
      else field.example = kind === 'date' ? '2026-01-31' : kind === 'email' ? 'exemplo@exemplo.ao' : `Exemplo ${f}`;
      fieldList.push(field);
    }
    manifest.entityTypes.push({ key, name: `Tipo ${pad(e)}`, description: `Descrição do tipo de entidade ${pad(e)}: registo mantido manualmente pela área ${areas[e % areas.length]} para suportar os processos que o referenciam.`, icon: 'Truck01', namePattern: 'Designação do registo.', purpose: `Suportar os processos da área ${areas[e % areas.length]}.`, owner: 'Área responsável', coverage: [{ dimension: 'Identificação', decision: 'included', reason: 'Necessária para localizar o registo.' }], setup: ['Criar antes dos workflows que o usam.'], readiness: ['Registos activos carregados.'], fields: fieldList });
  }
  for (let g = 0; g < groups; g++) manifest.groups.push({ key: `grupo_${pad(g)}`, name: `Grupo ${pad(g)} da área ${areas[g % areas.length]}`, parentKey: null, kind: 'team', area: areas[g % areas.length], purpose: `Executa as acções da área ${areas[g % areas.length]} atribuídas ao grupo ${pad(g)}.`, members: [{ role: `Técnico ${pad(g)}`, email: g % 3 === 0 ? `membro${pad(g)}@exemplo.ao` : null, ...(g % 3 === 0 ? { verified: g % 6 === 0, source: g % 6 === 0 ? 'users_search' : undefined } : {}) }], sourceRefs: [{ source: `sop-${pad(g % sourceCount)}`, section: `${(g % sections) + 1}` }], flags: g % 17 === 0 ? [{ code: 'segregation', detail: 'Confirmar responsáveis distintos.' }] : [] });
  const yamlFiles = {};
  for (let w = 0; w < workflows; w++) {
    const key = `wf_${pad(w)}`;
    const source = `sop-${pad(w % sourceCount)}`;
    const area = areas[w % areas.length];
    const actionList = [], yamlActions = [];
    for (let a = 0; a < actions; a++) {
      const localId = `a_${pad(a, 2)}`;
      const type = a % 7 === 3 ? 'decision' : a % 11 === 5 ? 'form_fill' : 'standard';
      const group = `grupo_${pad((w * 3 + a) % groups)}`;
      const entityRefs = a % 4 === 0 ? [`tipo_${pad((w * 5 + a) % entities)}`] : [];
      const name = type === 'decision' ? `Decidir sobre o passo ${pad(a, 2)} do processo ${pad(w)}` : `Executar o passo ${pad(a, 2)} do processo ${pad(w)} com acção e secção`;
      actionList.push({ localId, name, type, sourceRefs: [{ source, section: `${(a % sections) + 1}` }], assigneeRef: a === 0 ? 'creator' : group, formRef: null, entityRefs, evidence: [`Evidência do passo ${a}`], due: { offsetDays: 2, offsetType: 'workdays', basis: 'activation' }, folded: [] });
      const yamlAction = { id: localId, name, type, description: BRIEF(name), executionMode: a % 9 === 4 || a % 9 === 5 ? 'parallel' : 'sequential', required: true, due: { offsetDays: 2, offsetType: 'workdays', basis: 'activation' }, assignee: { type: 'creator' } };
      if (type === 'decision') yamlAction.config = { branches: [{ label: 'Aprovar', outcome: 'continue' }, { label: 'Devolver', outcome: 'return_to_action', target: actionList[Math.max(0, a - 2)].localId, requiresComment: true }, { label: 'Rejeitar', outcome: 'cancel_incident', requiresComment: true }, ...(w % 5 === 0 && a === 3 ? [{ label: 'Escalar', outcome: 'trigger_workflow', workflow: `wf_${pad((w + 1) % workflows)}` }] : [])] };
      yamlActions.push(yamlAction);
    }
    const workflow = { key, name: `Processo ${pad(w)} da área ${area}`, prefix: `P${pad(w, 3)}`, file: `${key}/workflow.yaml`, status: ['design', 'packaged', 'validated'][w % 3], ownerArea: area, sourceRefs: [{ source }], access: { grants: [{ grantee: 'organization', level: 'create_incident', reason: 'Qualquer colaborador abre um caso', sourceRefs: [{ source, section: '1' }] }], sensitivity: 'internal' }, triggers: [{ type: 'manual', label: 'Iniciar', enabled: true, manual: { allowedGroups: [] } }], templates: [], unresolvedActors: [], unresolvedEntityTypes: [], actions: actionList, subWorkflowRefs: w % 10 === 9 ? [`wf_${pad(w - 1)}`] : [], setupNotes: [`Nota de configuração do processo ${pad(w)}.`] };
    manifest.workflows.push(workflow);
    yamlFiles[workflow.file] = '# provia-skills test\n' + emit({ apiVersion: 'provia.ao/v1', kind: 'Workflow', metadata: { name: workflow.name, prefix: workflow.prefix, description: `Objectivo do processo ${pad(w)}: descrição sintética.` }, triggers: [{ type: 'manual', label: 'Iniciar', enabled: true, config: {} }], fields: [{ name: 'montante', label: 'Montante', type: 'currency', required: true, config: { currency: 'AOA', decimals: 2 } }], access: { grants: [{ grantee: 'organization', level: 'create_incident' }] }, actions: yamlActions });
  }
  for (let f = 0; f < forms; f++) {
    const workflow = manifest.workflows[f % workflows];
    const fill = workflow.actions.find(action => action.type === 'form_fill' && !action.formRef);
    const key = `form_${pad(f)}`;
    if (fill && f % 2 === 0) { fill.formRef = key; manifest.forms.push({ key, title: `Formulário de resposta ${pad(f)}`, kind: 'action', workflowRef: workflow.key, actionRef: fill.localId, status: 'designed', fields: [{ key: 'valor', label: 'Valor proposto', type: 'currency', required: true, mapsTo: 'montante' }, { key: 'documento', label: 'Documento', type: 'file', required: false, accept: ['pdf'] }, { key: 'estado', label: 'Estado', type: 'select', required: true, options: [{ value: 'ok', label: 'Conforme' }, { value: 'nok', label: 'Não conforme' }] }] }); }
    else manifest.forms.push({ key, title: `Formulário de entrada ${pad(f)}`, kind: 'trigger', workflowRef: workflow.key, actionRef: null, status: 'designed', fields: [{ key: 'montante', label: 'Montante', type: 'currency', required: true, mapsTo: 'montante' }, { key: 'descricao', label: 'Descrição do pedido', type: 'rich_text', required: true }] });
  }
  for (let d = 0; d < decisions; d++) manifest.decisions.push({ id: `D${pad(d)}`, question: `Questão ${pad(d)}: quem aprova o passo ${d % actions} acima do limite da área ${areas[d % areas.length]}?`, owner: d % 5 === 0 ? null : 'Dono do processo', status: d % 4 === 0 ? 'resolved' : 'open', ...(d % 4 === 0 ? { resolution: 'Resolvido em reunião.' } : {}), raisedBy: 'provia-workflow-designer', sourceRefs: [{ source: `sop-${pad(d % sourceCount)}`, section: `${(d % sections) + 1}` }] });
  return { manifest, yamlFiles };
}

/** Writes the fixture into a directory (manifest plus one YAML per workflow) and returns the manifest. */
export function writeLargeProject(dir, options) {
  const { manifest, yamlFiles } = buildLargeProject(options);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'provia-project.json'), JSON.stringify(manifest));
  for (const [file, text] of Object.entries(yamlFiles)) { mkdirSync(join(dir, file, '..'), { recursive: true }); writeFileSync(join(dir, file), text); }
  return manifest;
}
