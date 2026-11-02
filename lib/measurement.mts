/**
 * Explicit-ESM read-only measurement projection for #75/#76. This validates supplied aggregate
 * receipts; it does not authenticate them, persist money, or authorize callers.
 * Never expose founder-private inputs through the public MCP catalog.
 */
export type MetricUnit = 'count' | 'ratio' | 'minor' | 'minutes'
export type Scope = { brand_id: string; product_id: string; workspace_id: string }
export type Period = { start: string; end: string }
export type EvidenceSource = {
  id: string
  scope: Scope
  period: Period
  observed_at: string
  freshness_seconds: number
  coverage: 'complete' | 'partial' | 'unavailable'
  mode: 'live' | 'sandbox' | 'scenario'
  evidence_ref: string
  evidence_level: 'document-reviewed' | 'connector-observed' | 'independently-attested'
}
export type MetricDefinition = {
  id: string
  label: string
  definition: string
  unit: MetricUnit
  direction: 'at_least' | 'at_most' | 'above'
  target: number
  due: string
  currency?: string
  minimum_denominator?: number
}
export type MetricObservation = {
  metric_id: string
  scope: Scope
  period: Period
  value: number
  currency?: string
  numerator?: number
  denominator?: number
  source_ids: string[]
}
export type MeasurementInput = {
  schema_version: 'IncomeMeasurement.v1'
  as_of: string
  scope: Scope
  period: Period
  definitions: MetricDefinition[]
  sources: EvidenceSource[]
  observations: MetricObservation[]
}
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/
const ID = /^[a-z][a-z0-9_-]{0,79}$/
function fail(message: string): never { throw new Error('Invalid measurement: ' + message) }
function obj(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail('expected object')
  return value as Record<string, unknown>
}
function keys(value: unknown, allowed: string[]) {
  const r = obj(value)
  if (Object.keys(r).some(k => !allowed.includes(k))) fail('unknown field')
}
function nonempty(value: unknown, max = 1000): value is string {
  return typeof value === 'string' && value.trim() === value && value.length > 0 &&
    value.length <= max && !/[\u0000-\u001f\u007f]/.test(value)
}
function instant(value: unknown): number {
  if (typeof value !== 'string' || !ISO.test(value) || !Number.isFinite(Date.parse(value))) fail('UTC timestamp required')
  const time = Date.parse(value)
  if (new Date(time).toISOString().slice(0, 19) !== value.slice(0, 19)) fail('invalid calendar timestamp')
  return time
}
function scope(value: Scope) {
  keys(value, ['brand_id', 'product_id', 'workspace_id'])
  if (![value.brand_id, value.product_id, value.workspace_id].every(v => nonempty(v, 100))) fail('scope')
}
function sameScope(a: Scope, b: Scope) {
  return a.brand_id === b.brand_id && a.product_id === b.product_id && a.workspace_id === b.workspace_id
}
function period(value: Period) {
  keys(value, ['start', 'end'])
  if (instant(value.start) >= instant(value.end)) fail('period must be half-open and nonempty')
}
function samePeriod(a: Period, b: Period) { return instant(a.start) === instant(b.start) && instant(a.end) === instant(b.end) }
function covers(a: Period, b: Period) { return instant(a.start) <= instant(b.start) && instant(a.end) >= instant(b.end) }
function finite(value: unknown): value is number { return typeof value === 'number' && Number.isFinite(value) }

export function compileMeasurements(raw: unknown) {
  keys(raw, ['schema_version', 'as_of', 'scope', 'period', 'definitions', 'sources', 'observations'])
  const input = raw as MeasurementInput
  if (input.schema_version !== 'IncomeMeasurement.v1') fail('version')
  const now = instant(input.as_of)
  scope(input.scope); period(input.period)
  if (instant(input.period.end) > now) fail('future period')
  for (const list of [input.definitions, input.sources, input.observations]) {
    if (!Array.isArray(list) || list.length > 1000) fail('bounded arrays required')
  }
  const definitions = new Map<string, MetricDefinition>()
  for (const d of input.definitions) {
    keys(d, ['id', 'label', 'definition', 'unit', 'direction', 'target', 'due', 'currency', 'minimum_denominator'])
    if (!nonempty(d.id) || !ID.test(d.id) || definitions.has(d.id) || !nonempty(d.label, 200) || !nonempty(d.definition, 2000)) fail('metric identity')
    if (!['count', 'ratio', 'minor', 'minutes'].includes(d.unit) || !['at_least', 'at_most', 'above'].includes(d.direction) || !finite(d.target)) fail('metric definition')
    if (d.unit !== 'minor' && d.target < 0) fail('negative target')
    if (d.unit === 'count' || d.unit === 'minor') { if (!Number.isSafeInteger(d.target)) fail('integer target') }
    if (d.unit === 'ratio' && d.target > 1) fail('ratio target')
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d.due) || new Date(d.due + 'T00:00:00Z').toISOString().slice(0, 10) !== d.due) fail('due date')
    if (d.unit === 'minor' ? !/^[A-Z]{3}$/.test(d.currency ?? '') : d.currency !== undefined) fail('currency required only for money')
    if (d.minimum_denominator !== undefined && (!Number.isSafeInteger(d.minimum_denominator) || d.minimum_denominator < 1 || d.unit !== 'ratio')) fail('minimum denominator')
    definitions.set(d.id, d)
  }
  const sources = new Map<string, EvidenceSource>()
  for (const s of input.sources) {
    keys(s, ['id', 'scope', 'period', 'observed_at', 'freshness_seconds', 'coverage', 'mode', 'evidence_ref', 'evidence_level'])
    scope(s.scope); period(s.period)
    if (!nonempty(s.id, 100) || sources.has(s.id) || !nonempty(s.evidence_ref, 2000)) fail('source identity/evidence')
    if (!Number.isSafeInteger(s.freshness_seconds) || s.freshness_seconds < 1 || s.freshness_seconds > 31536000) fail('freshness')
    if (instant(s.observed_at) > now || instant(s.period.end) > instant(s.observed_at)) fail('future source')
    if (!['complete', 'partial', 'unavailable'].includes(s.coverage) || !['live', 'sandbox', 'scenario'].includes(s.mode) ||
        !['document-reviewed', 'connector-observed', 'independently-attested'].includes(s.evidence_level)) fail('source state')
    sources.set(s.id, s)
  }
  const observations = new Map<string, MetricObservation>()
  for (const o of input.observations) {
    keys(o, ['metric_id', 'scope', 'period', 'value', 'currency', 'numerator', 'denominator', 'source_ids'])
    const d = definitions.get(o.metric_id)
    if (!d || observations.has(o.metric_id)) fail('unknown or duplicate observation')
    scope(o.scope); period(o.period)
    if (!sameScope(o.scope, input.scope) || !samePeriod(o.period, input.period)) fail('observation scope/period mismatch')
    if (!finite(o.value) || (d.unit !== 'minor' && o.value < 0)) fail('value')
    if ((d.unit === 'count' || d.unit === 'minor') && !Number.isSafeInteger(o.value)) fail('safe integer required')
    if (o.currency !== d.currency) fail('currency mismatch; conversion requires its own source')
    if (!Array.isArray(o.source_ids) || !o.source_ids.length || new Set(o.source_ids).size !== o.source_ids.length ||
        !o.source_ids.every(id => sources.has(id))) fail('observation source')
    if (d.unit === 'ratio') {
      if (!Number.isSafeInteger(o.numerator) || !Number.isSafeInteger(o.denominator) || o.numerator! < 0 || o.denominator! <= 0 ||
          o.numerator! > o.denominator! || Math.abs(o.value - o.numerator! / o.denominator!) > 1e-12) fail('ratio denominator/value')
    } else if (o.numerator !== undefined || o.denominator !== undefined) fail('ratio fields on nonratio')
    observations.set(o.metric_id, o)
  }
  const metrics = [...definitions.values()].map(d => {
    const o = observations.get(d.id)
    const reasons: string[] = []
    const refs: string[] = []
    if (!o) reasons.push('no_observation')
    for (const id of o?.source_ids ?? []) {
      const s = sources.get(id)!
      refs.push(s.evidence_ref)
      if (!sameScope(s.scope, input.scope)) reasons.push('source_scope_mismatch')
      if (!covers(s.period, input.period)) reasons.push('source_period_gap')
      if (s.coverage !== 'complete') reasons.push('coverage_' + s.coverage)
      if (s.mode !== 'live') reasons.push('mode_' + s.mode)
      if (now - instant(s.observed_at) > s.freshness_seconds * 1000) reasons.push('stale_source')
    }
    if (o && d.minimum_denominator && o.denominator! < d.minimum_denominator) reasons.push('insufficient_denominator')
    const measured = !!o && reasons.length === 0
    const met = !measured ? null : d.direction === 'at_least' ? o.value >= d.target : d.direction === 'at_most' ? o.value <= d.target : o.value > d.target
    return {
      id: d.id, label: d.label, definition: d.definition, unit: d.unit, currency: d.currency ?? null,
      value: measured ? o!.value : null,
      status: measured ? 'observed' : 'unknown',
      numerator: measured ? o!.numerator ?? null : null,
      denominator: measured ? o!.denominator ?? null : null,
      evidence_refs: [...new Set(refs)], reasons: [...new Set(reasons)],
      goal: { direction: d.direction, target: d.target, due: d.due, status: met === null ? 'unmeasured' : met ? 'met' : 'not_met' },
    }
  })
  return {
    schema_version: 'IncomeMeasurementSnapshot.v1', as_of: input.as_of, scope: input.scope, period: input.period,
    authority: 'read_only_projection', evidence_authentication: 'upstream_responsibility',
    metrics, observed_metrics: metrics.filter(m => m.status === 'observed').length,
    unknown_metrics: metrics.filter(m => m.status === 'unknown').length,
  }
}

