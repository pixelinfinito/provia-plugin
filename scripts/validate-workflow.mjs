import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../contracts/workflow-v1/engine.mjs';

const contract = JSON.parse(fs.readFileSync(new URL('../contracts/workflow-v1/contract-lock.json', import.meta.url), 'utf8'));
const LIMIT = 1024 * 1024;
const issue = (code, location, message) => ({ code, path: location, message });
const pending = (report, code, location, message) => report.setupRequired.push(issue(code, location, message));

/** File checks are read-only. No organization access and no generated credentials are returned. */
export function validateWorkflow(text) {
  const report = {
    valid: false, apiVersion: 'provia.ao/v1', contractRevision: contract.sourceRevision,
    destinationValidation: 'not_run', backendSchemaValidation: 'not_run', readyToPublish: false,
    errors: [], warnings: [], setupRequired: [],
  };
  if (Buffer.byteLength(text, 'utf8') > LIMIT) {
    report.errors.push(issue('file_too_large', '', 'Workflow YAML must be at most 1 MiB in UTF-8.'));
    return report;
  }
  try {
    const parsed = engine.parseYamlToDraft(text);
    if (parsed.syntaxErrors.length || !parsed.draft) {
      report.errors.push(...parsed.syntaxErrors.map(x => ({ ...issue('yaml_syntax', '', 'Invalid YAML syntax; check the source at this line.'), line: x.line })));
      if (!report.errors.length) report.errors.push(issue('yaml_document', '', 'Expected a workflow mapping.'));
      return report;
    }
    const result = engine.validateWorkflowDraft(parsed.draft, {}, parsed.lineOf);
    // Product details may interpolate input values. Keep locations and stable titles, not raw input.
    for (const [name, items] of [['errors', result.errors], ['warnings', result.warnings]]) {
      report[name].push(...items.map(x => ({ ...issue('product_' + name.slice(0, -1), x.rulePath, x.title), ...(x.line ? { line: x.line } : {}) })));
    }
    const draft = result.draft;
    for (const [i, trigger] of (draft.triggers ?? []).entries()) {
      if (trigger.config && Object.keys(trigger.config).length) pending(report, 'trigger_setup', `triggers[${i}].config`, 'Verify trigger access, defaults, references and delivery settings in the destination organization.');
    }
    if (draft.apiVersion === 'provia.io/v1') report.warnings.push(issue('legacy_version', 'apiVersion', 'Use provia.ao/v1 for new files.'));
    if (draft.metadata?.agentMemoryEnabled) pending(report, 'memory_documents', 'metadata.agentMemoryEnabled', 'Add approved memory documents in Provia; YAML carries only the enabled flag.');
    for (const [i, action] of (draft.actions ?? []).entries()) {
      const location = `actions[${i}]`;
      if (!action.assignee && ['standard', 'decision', 'form_fill'].includes(action.type)) pending(report, 'assignment_missing', location + '.assignee', 'Set the intended owner before publication; import defaults do not establish approval authority.');
      if (action.type === 'form_fill') pending(report, 'form_fill_link', location, 'Create or link the form in Provia before publication.');
      if (['user', 'group', 'ai_agent'].includes(action.assignee?.type)) pending(report, 'organization_reference', location + '.assignee', 'Verify this assignee or AI profile in the destination organization.');
      if (action.type === 'notification') pending(report, 'notification_recipients', location + '.config', 'Verify recipient membership and notification delivery settings.');
      if (action.type === 'decision' && action.config?.branches?.some(b => b.outcome === 'trigger_workflow')) pending(report, 'decision_workflow', location + '.config.branches', 'Resolve workflow targets in the destination organization.');
      if (action.type === 'sub_workflow') pending(report, 'workflow_reference', location, 'Resolve the child workflow in the destination organization.');
    }
    if (draft.entities?.mode && draft.entities.mode !== 'none') pending(report, 'entity_reference', 'entities', 'Resolve entity types, records, and field mappings in Provia.');
    let hasPlaceholder = false;
    function dependencies(value, location) {
      if (typeof value === 'string') {
        if (/\$[A-Z][A-Z0-9_]*/.test(value)) {
          hasPlaceholder = true;
          pending(report, 'placeholder', location, 'Resolve this placeholder in Provia; its value is not part of this report.');
        }
        if (/\{\{secret:[A-Z][A-Z0-9_]*\}\}/.test(value)) pending(report, 'organization_secret', location, 'Verify the referenced organization secret exists.');
      } else if (value && typeof value === 'object') {
        for (const [key, item] of Object.entries(value)) dependencies(item, location ? `${location}.${key}` : key);
      }
    }
    dependencies(draft, '');
    if (report.errors.length) return report;
    // The normalized draft is mandatory: the raw parse result has not passed scalar checks.
    if (hasPlaceholder) {
      report.backendSchemaValidation = 'not_run_unresolved_placeholders';
    } else {
      const plan = engine.buildImportPlan(draft, { prefix: draft.metadata.prefix, secretValues: {} });
      const request = engine.planToImportRequest(plan);
      if (Buffer.byteLength(JSON.stringify(request), 'utf8') > LIMIT) {
        report.errors.push(issue('import_plan_too_large', '', 'The converted import request exceeds 1 MiB.'));
        report.backendSchemaValidation = 'failed';
        return report;
      }
      const parsedRequest = engine.importWorkflowPlanSchema.safeParse(request);
      report.backendSchemaValidation = 'failed';
      if (!parsedRequest.success) report.errors.push(...parsedRequest.error.issues.map(x => issue('backend_schema', x.path.join('.'), 'The import request does not satisfy the backend schema.')));
      else {
        let partial = false;
        const configs = { http_request: engine.httpRequestActionConfigSchema, wait: engine.waitConfigSchema, notification: engine.notificationConfigSchema, sub_workflow: engine.subWorkflowConfigSchema };
        for (const [i, action] of parsedRequest.data.actions.entries()) {
          let schema = configs[action.input.actionType];
          if (!schema) continue;
          // Portable child refs cannot be resolved offline; Provia must perform this check.
          if (action.input.actionType === 'sub_workflow' && !/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(action.input.actionTypeConfig.targetWorkflowId ?? '')) {
            partial = true;
            schema = schema.omit({ targetWorkflowId: true });
          }
          const checked = schema.safeParse(action.input.actionTypeConfig);
          if (!checked.success) report.errors.push(...checked.error.issues.map(x => issue('action_config', `actions[${i}].config.${x.path.join('.')}`, 'Action configuration does not satisfy the backend schema.')));
        }
        try { engine.validateSchemaDefinition(parsedRequest.data.workflow.metadataSchema ?? []); }
        catch { report.errors.push(issue('metadata_definition', 'fields', 'Metadata definition does not satisfy backend rules.')); }
        report.backendSchemaValidation = report.errors.length ? 'failed' : partial ? 'partial_unresolved_references' : 'passed';
      }
    }
    // Cron/timezone checks remain useful even when another field has an unresolved secret.
    for (const [i, trigger] of (draft.triggers ?? []).entries()) {
      if (trigger.type !== 'schedule') continue;
      try { engine.validateTriggerConfigShape(trigger.type, trigger.config ?? {}); }
      catch { report.errors.push(issue('schedule_config', `triggers[${i}].config`, 'Invalid cron expression, timezone, or missed-run behavior.')); }
    }
    report.valid = report.errors.length === 0;
    return report;
  } catch {
    report.errors.push(issue('validation_failed', '', 'Validation could not complete. Check nested shapes and report a redacted reproducer.'));
    return report;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const file = process.argv[2];
  if (!file) { process.stderr.write('Usage: node scripts/validate-workflow.mjs workflow.yaml\n'); process.exitCode = 2; }
  else {
    try {
      if (fs.statSync(file).size > (file.endsWith('.zip') ? 21 * LIMIT : LIMIT)) throw new Error('file_too_large');
      const reports = file.endsWith('.zip')
        ? engine.extractWorkflowsFromZip(new Uint8Array(fs.readFileSync(file))).map(entry => ({ file: entry.name, ...validateWorkflow(entry.yaml) }))
        : [validateWorkflow(fs.readFileSync(file, 'utf8'))];
      process.stdout.write(JSON.stringify(reports.length === 1 ? reports[0] : reports, null, 2) + '\n');
      process.exitCode = reports.every(r => r.valid) ? 0 : 1;
    } catch {
      process.stdout.write(JSON.stringify({ valid: false, readyToPublish: false, errors: [{ code: 'input_unreadable', message: 'Cannot read the file or it exceeds the supported file/archive limits.' }] }) + '\n');
      process.exitCode = 2;
    }
  }
}
