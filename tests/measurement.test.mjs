import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { compileMeasurements } from '../lib/measurement.mts'

const fixture = JSON.parse(readFileSync(new URL('../data/measurement/synthetic-empty.json', import.meta.url)))
const clone = () => structuredClone(fixture)
function observed(id = 'paid_activations', value = 3) {
  const input = clone()
  input.sources = [{
    id: 'synthetic-receipt', scope: { ...input.scope }, period: { ...input.period },
    observed_at: input.as_of, freshness_seconds: 86400, coverage: 'complete', mode: 'live',
    evidence_ref: 'synthetic://fixture/aggregate', evidence_level: 'document-reviewed',
  }]
  input.observations = [{ metric_id: id, scope: { ...input.scope }, period: { ...input.period }, value, source_ids: ['synthetic-receipt'] }]
  return input
}
const metric = (input, id = 'paid_activations') => compileMeasurements(input).metrics.find(m => m.id === id)

test('missing data stays unknown instead of zero or a met goal', () => {
  const result = compileMeasurements(clone())
  assert.equal(result.observed_metrics, 0)
  assert.equal(result.unknown_metrics, 5)
  assert.ok(result.metrics.every(m => m.value === null && m.goal.status === 'unmeasured'))
})
test('a complete supplied receipt can support a count and exact threshold', () => {
  const m = metric(observed())
  assert.equal(m.value, 3)
  assert.equal(m.goal.status, 'met')
  assert.deepEqual(m.evidence_refs, ['synthetic://fixture/aggregate'])
})
test('a complete measured zero differs from missing data', () => {
  assert.equal(metric(observed('paid_activations', 0)).value, 0)
  assert.equal(metric(observed('paid_activations', 0)).goal.status, 'not_met')
})
for (const coverage of ['partial', 'unavailable']) {
  test(coverage + ' coverage cannot pass a goal', () => {
    const input = observed(); input.sources[0].coverage = coverage
    assert.equal(metric(input).value, null)
    assert.ok(metric(input).reasons.includes('coverage_' + coverage))
  })
}
for (const mode of ['sandbox', 'scenario']) {
  test(mode + ' evidence cannot become actual business performance', () => {
    const input = observed(); input.sources[0].mode = mode
    assert.equal(metric(input).value, null)
    assert.equal(metric(input).goal.status, 'unmeasured')
    assert.ok(metric(input).reasons.includes('mode_' + mode))
  })
}
test('stale sources do not retain a successful goal', () => {
  const input = observed(); input.sources[0].observed_at = '2026-11-01T00:00:00Z'; input.sources[0].freshness_seconds = 3600
  assert.ok(metric(input).reasons.includes('stale_source'))
  assert.equal(metric(input).value, null)
})
test('foreign source scope cannot support a local observation', () => {
  const input = observed(); input.sources[0].scope.workspace_id = 'other-workspace'
  assert.ok(metric(input).reasons.includes('source_scope_mismatch'))
  assert.equal(metric(input).value, null)
})
test('foreign observation scope is rejected rather than filtered silently', () => {
  const input = observed(); input.observations[0].scope.brand_id = 'another-brand'
  assert.throws(() => compileMeasurements(input), /scope\/period mismatch/)
})
test('missing required scope identity fails closed', () => {
  const input = observed(); delete input.scope.workspace_id
  assert.throws(() => compileMeasurements(input), /scope/)
  const second = observed(); second.sources[0].scope = {}
  assert.throws(() => compileMeasurements(second), /scope/)
})
test('a shorter source window cannot support the full period', () => {
  const input = observed(); input.sources[0].period.start = '2026-10-15T00:00:00Z'
  assert.ok(metric(input).reasons.includes('source_period_gap'))
})
test('semantically equal UTC representations are accepted', () => {
  const input = observed(); input.observations[0].period.start = '2026-10-01T00:00:00.000Z'
  assert.equal(metric(input).value, 3)
})
test('duplicate observations never silently select a winner', () => {
  const input = observed(); input.observations.push({ ...input.observations[0], value: 5 })
  assert.throws(() => compileMeasurements(input), /duplicate observation/)
})
test('duplicate source identities and unknown refs are rejected', () => {
  const input = observed(); input.sources.push(structuredClone(input.sources[0]))
  assert.throws(() => compileMeasurements(input), /source identity/)
  const second = observed(); second.observations[0].source_ids = ['missing']
  assert.throws(() => compileMeasurements(second), /observation source/)
})
test('money uses safe signed minor units and exact currency', () => {
  const input = observed('net_contribution_minor', -1234); input.observations[0].currency = 'EUR'
  assert.equal(metric(input, 'net_contribution_minor').value, -1234)
  assert.equal(metric(input, 'net_contribution_minor').goal.status, 'not_met')
  input.observations[0].currency = 'USD'
  assert.throws(() => compileMeasurements(input), /currency mismatch/)
})
test('fractional minor units and unsafe integers are rejected', () => {
  const input = observed('net_contribution_minor', 12.5); input.observations[0].currency = 'EUR'
  assert.throws(() => compileMeasurements(input), /safe integer/)
  assert.throws(() => compileMeasurements(observed('paid_activations', Number.MAX_SAFE_INTEGER + 1)), /safe integer/)
})
test('ratio must reconcile to nonzero integer numerator and denominator', () => {
  const input = observed('accepted_outcome_rate', .9)
  Object.assign(input.observations[0], { numerator: 18, denominator: 20 })
  assert.equal(metric(input, 'accepted_outcome_rate').goal.status, 'met')
  input.observations[0].value = .95
  assert.throws(() => compileMeasurements(input), /ratio denominator\/value/)
  Object.assign(input.observations[0], { value: 0, numerator: 0, denominator: 0 })
  assert.throws(() => compileMeasurements(input), /ratio denominator\/value/)
})
test('small evaluation cohorts cannot earn the quality goal', () => {
  const input = observed('accepted_outcome_rate', 1)
  Object.assign(input.observations[0], { numerator: 2, denominator: 2 })
  assert.ok(metric(input, 'accepted_outcome_rate').reasons.includes('insufficient_denominator'))
})
test('support guardrail evaluates at-most direction', () => {
  assert.equal(metric(observed('support_minutes_per_workspace', 8), 'support_minutes_per_workspace').goal.status, 'met')
  assert.equal(metric(observed('support_minutes_per_workspace', 8.1), 'support_minutes_per_workspace').goal.status, 'not_met')
})
test('unknown properties are rejected rather than propagated', () => {
  const input = observed(); input.observations[0].customer_email = 'synthetic@example.invalid'
  assert.throws(() => compileMeasurements(input), /unknown field/)
})
test('future observations, invalid dates, and unbounded inputs fail', () => {
  const input = observed(); input.sources[0].observed_at = '2026-11-02T00:00:00Z'
  assert.throws(() => compileMeasurements(input), /future source/)
  const second = observed(); second.period.start = '2026-02-30T00:00:00Z'
  assert.throws(() => compileMeasurements(second), /calendar timestamp/)
  const third = clone(); third.sources = new Array(1001).fill({})
  assert.throws(() => compileMeasurements(third), /bounded arrays/)
})
test('CLI returns nonzero without serializing a malformed private record', () => {
  const out = spawnSync(process.execPath, ['scripts/measure-income.mjs'], { cwd: new URL('../', import.meta.url), encoding: 'utf8' })
  assert.equal(out.status, 1)
  assert.equal(out.stdout, '')
  assert.match(JSON.parse(out.stderr).error, /Usage:/)
})
test('CLI and pure module produce identical synthetic output', () => {
  const out = spawnSync(process.execPath, ['scripts/measure-income.mjs', 'data/measurement/synthetic-empty.json'], { cwd: new URL('../', import.meta.url), encoding: 'utf8' })
  assert.equal(out.status, 0, out.stderr)
  assert.deepEqual(JSON.parse(out.stdout), compileMeasurements(clone()))
})

test('CLI parse failures do not echo supplied private input', () => {
  const dir = mkdtempSync(join(tmpdir(), 'income-measurement-'))
  try {
    const file = join(dir, 'malformed.json')
    writeFileSync(file, '{"PRIVATE_TEST_SENTINEL": broken-json}')
    const out = spawnSync(process.execPath, ['scripts/measure-income.mjs', file], { cwd: new URL('../', import.meta.url), encoding: 'utf8' })
    assert.equal(out.status, 1)
    assert.equal(out.stdout, '')
    assert.ok(!out.stderr.includes('PRIVATE_TEST_SENTINEL'))
    assert.equal(JSON.parse(out.stderr).error, 'Measurement failed; supply a valid measurement input')
  } finally { rmSync(dir, { recursive: true, force: true }) }
})

