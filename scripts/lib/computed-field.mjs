// Computed entity fields (Provia feature 028): a read-only rollup of a numeric incident field over the incidents
// linked to a record. Mirrors backend/src/lib/computed-fields/config.ts in Provia revision
// 5f5efb05ee67119abe8fde96db65a75756e2fd8a, which the bundled workflow engine predates; workflows never accept the type.

export const COMPUTED_TYPE = 'computed';
export const COMPUTED_OPERATIONS = ['sum', 'avg', 'min', 'max', 'count'];
export const INCIDENT_STATUSES = ['open', 'in_progress', 'blocked', 'awaiting_decision', 'awaiting_sub_workflow', 'completed', 'cancelled'];
export const PERIOD_PRESETS = ['this_week', 'this_month', 'this_quarter', 'this_year', 'last_7_days', 'last_30_days', 'last_12_months', 'previous_month', 'previous_year'];
export const DATE_SOURCES = ['created_at', 'completed_at'];
export const PLACEMENTS = ['details', 'details_and_panel'];
/** Incident field types a rollup can read. */
export const NUMERIC_SOURCE_TYPES = ['number', 'currency', 'percentage', 'rating'];
/** Sibling field types a limit can point at. */
export const LIMIT_FIELD_TYPES = ['number', 'currency'];

const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const text = value => typeof value === 'string' && value.length > 0;
const isoDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().startsWith(value);
const percent = value => value === undefined || (typeof value === 'number' && value >= 1 && value <= 100);

/**
 * Errors for one computed field, as `config.<path>: message` strings. `siblings` are the other fields of the
 * same type in metadata-schema shape ({ name, type }), used to resolve a limit that reads another field.
 */
export function computedFieldErrors(field, siblings) {
  const errors = [];
  if (field.required === true) errors.push('required: a computed field cannot be required');
  if (field.defaultValue !== undefined) errors.push('defaultValue: a computed field has no default value');
  const config = field.config;
  if (!object(config)) return [...errors, 'config: a computed field needs its rollup configuration'];

  if (!COMPUTED_OPERATIONS.includes(config.operation)) errors.push(`config.operation: one of ${COMPUTED_OPERATIONS.join(', ')}`);
  if (config.source !== undefined) {
    if (!object(config.source)) errors.push('config.source: expected an object');
    else {
      if (config.source.fieldName !== undefined && !text(config.source.fieldName)) errors.push('config.source.fieldName: expected a field name');
      if (config.source.workflowIds !== undefined && !(Array.isArray(config.source.workflowIds) && config.source.workflowIds.length <= 200 && config.source.workflowIds.every(text))) errors.push('config.source.workflowIds: expected up to 200 workflow ids');
    }
  }
  if (config.operation !== 'count' && !text(config.source?.fieldName)) errors.push('config.source.fieldName: choose the incident field to roll up');

  const scope = config.scope;
  if (!object(scope)) errors.push('config.scope: expected { statuses, period? }');
  else {
    if (!Array.isArray(scope.statuses) || scope.statuses.length === 0 || !scope.statuses.every(s => INCIDENT_STATUSES.includes(s))) errors.push(`config.scope.statuses: at least one of ${INCIDENT_STATUSES.join(', ')}`);
    const period = scope.period;
    if (period !== undefined) {
      if (!object(period)) errors.push('config.scope.period: expected an object');
      else {
        if (period.dateSource !== undefined && !DATE_SOURCES.includes(period.dateSource)) errors.push(`config.scope.period.dateSource: one of ${DATE_SOURCES.join(', ')}`);
        if (period.preset !== undefined && !PERIOD_PRESETS.includes(period.preset)) errors.push(`config.scope.period.preset: one of ${PERIOD_PRESETS.join(', ')}`);
        if (period.range !== undefined && !(object(period.range) && isoDate(period.range.from) && isoDate(period.range.to))) errors.push('config.scope.period.range: expected { from, to } as YYYY-MM-DD');
        if (Boolean(period.preset) === Boolean(period.range)) errors.push('config.scope.period: use either a preset or a range');
        else if (object(period.range) && period.range.from > period.range.to) errors.push('config.scope.period.range: the range ends before it starts');
      }
    }
  }

  if (config.currency !== undefined && !(typeof config.currency === 'string' && /^[A-Z]{3}$/.test(config.currency))) errors.push('config.currency: expected an ISO 4217 code');
  if (config.precision !== undefined && !(Number.isInteger(config.precision) && config.precision >= 0 && config.precision <= 6)) errors.push('config.precision: an integer from 0 to 6');

  const limit = config.limit;
  if (limit !== undefined) {
    if (!object(limit) || !percent(limit.warnAtPercent)) errors.push('config.limit: expected { kind, value | fieldName, warnAtPercent? } with warnAtPercent from 1 to 100');
    else if (limit.kind === 'fixed') {
      if (!(typeof limit.value === 'number' && Number.isFinite(limit.value) && limit.value > 0)) errors.push('config.limit.value: a positive number');
    } else if (limit.kind === 'field') {
      const target = siblings.find(s => s.name === limit.fieldName);
      if (!target || !LIMIT_FIELD_TYPES.includes(target.type)) errors.push(`config.limit.fieldName: '${limit.fieldName}' must be a number or currency field of this entity type`);
    } else errors.push('config.limit.kind: fixed or field');
  }
  if (config.display !== undefined && !(object(config.display) && PLACEMENTS.includes(config.display.placement))) errors.push(`config.display.placement: one of ${PLACEMENTS.join(', ')}`);
  return errors;
}
