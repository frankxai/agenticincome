import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { assessQuality, configureAgency, renderOffer, catalog } from './agency.mjs'

const fixture = id => JSON.parse(readFileSync(new URL(`../examples/${id}.json`, import.meta.url), 'utf8'))
const evidence = (kind = 'benchmark', overrides = {}) => ({
  id: kind + '-sample', scopeId: 'talent-delivery', workflowVersion: 'workflow-0.2.0',
  kind, reviewerRef: 'reviewer-2', independent: true, synthetic: kind !== 'live',
  checkedAt: '2026-09-10', sampleSize: kind === 'live' ? 30 : 20,
  accepted: kind === 'live' ? 30 : 20, materialErrors: 0, criticalIncidents: 0,
  evidenceRef: 'local:review-1', ...overrides,
})
function connected() {
  const f = fixture('talent-delivery')
  f.controls = Object.fromEntries(catalog.architectures.at(-1).requiredControls.map(k => [k, { status: 'verified', evidenceRef: `local:${k}`, checkedAt: '2026-09-10' }]))
  f.quality.evidence = [evidence()]
  return f
}

test('all six new service examples fail closed on unknown controls and still produce usable offers', () => {
  for (const s of catalog.services) {
    const plan = configureAgency(fixture(s.id))
    assert.equal(plan.quality.rank, 'Q0')
    assert.equal(plan.proposedAutonomy, 'A1')
    assert.ok(plan.missingControls.length > 0)
    assert.ok(plan.workflowPlan.every(w => w.executionEnabled === false))
    assert.ok(renderOffer(plan).includes(s.cap))
    assert.ok(renderOffer(plan).includes('before it is sent'))
  }
})

test('autonomy, human service, quality evidence and price remain independent', () => {
  const a = connected()
  const p = configureAgency(a)
  assert.equal(p.proposedAutonomy, 'A3')
  assert.equal(p.quality.rank, 'Q2')
  const richer = configureAgency({ ...a, humanLevel: 'H3' })
  assert.equal(richer.quality.rank, 'Q2')
  assert.equal(richer.proposedAutonomy, 'A3')
  assert.ok(richer.price.feeHypothesis > p.price.feeHypothesis)
  assert.equal(configureAgency({ ...a, requestedAutonomy: 1 }).price.humanHoursPerEngagement, p.price.humanHoursPerEngagement)
})

test('even an A4 proposal preserves human hiring, finance and facilitation decisions', () => {
  const f = connected()
  f.architectureId = 'managed-network'; f.requestedAutonomy = 4
  f.quality.evidence.push(evidence('live'))
  const plan = configureAgency(f)
  assert.equal(plan.proposedAutonomy, 'A4')
  assert.equal(plan.quality.rank, 'Q3')
  assert.equal(plan.workflowPlan.find(w => w.id === 'decision').mode, 'human-led decision; preparation only')
  assert.ok(plan.workflowPlan.every(w => !w.executionEnabled))
  for (const id of ['agency-desk', 'team-practice', 'retreat-outcomes']) {
    const x = fixture(id)
    x.controls = f.controls; x.architectureId = f.architectureId; x.requestedAutonomy = 4
    x.quality.evidence = f.quality.evidence.map(e => ({ ...e, scopeId: id }))
    assert.ok(configureAgency(x).workflowPlan.filter(w => ['financial', 'human-practice'].includes(w.kind)).every(w => w.mode === 'human-led decision; preparation only'))
  }
})

test('stale, wrong-scope and changed-version evidence cannot earn a quality level', () => {
  for (const overrides of [{ checkedAt: '2026-08-01' }, { scopeId: 'onboarding' }, { workflowVersion: 'old' }]) {
    const f = connected(); f.quality.evidence = [evidence('benchmark', overrides)]
    assert.equal(assessQuality(f.quality).rank, 'Q0')
  }
})

test('small samples and self-review cannot claim benchmark or live evidence', () => {
  for (const overrides of [{ sampleSize: 3, accepted: 3 }, { independent: false }]) {
    const f = connected(); f.quality.evidence = [evidence('benchmark', overrides)]
    assert.equal(assessQuality(f.quality).rank, 'Q1')
  }
  const f = connected(); f.quality.evidence.push(evidence('live', { synthetic: true }))
  assert.equal(assessQuality(f.quality).rank, 'Q2')
})

test('current material error overrides good samples and old critical incidents remain visible', () => {
  const f = connected()
  f.quality.evidence.push(evidence('review', { accepted: 19, materialErrors: 1 }))
  assert.equal(configureAgency(f).quality.rank, 'Q0')
  f.quality.evidence = [evidence(), evidence('review', { checkedAt: '2026-01-01', criticalIncidents: 1 })]
  assert.equal(configureAgency(f).proposedAutonomy, 'A0')
})

test('unverified, stale or absent controls cannot be replaced by a high quality grade', () => {
  for (const update of [undefined, { status: 'unknown' }, { status: 'failed' }, { status: 'verified', evidenceRef: 'local:old', checkedAt: '2026-08-01' }]) {
    const f = connected()
    if (update) f.controls.providerReadback = update
    else delete f.controls.providerReadback
    assert.equal(configureAgency(f).proposedAutonomy, 'A1')
  }
})

test('invalid IDs, dates, counts, fractions and invented fields are rejected', () => {
  const cases = [
    f => { f.serviceId = 'constructor' },
    f => { f.engagementId = '# injected\ntext' },
    f => { f.asOf = '2026-02-30' },
    f => { f.requestedAutonomy = 5 },
    f => { f.quality.evidence[0].accepted = 21 },
    f => { f.quality.evidence[0].materialErrors = 1 },
    f => { f.quality.evidence[0].independent = 'true' },
    f => { f.quality.evidence[0].checkedAt = '2026-09-11' },
    f => { f.quality.evidence.push({ ...f.quality.evidence[0] }) },
    f => { f.controls.providerReadback = { status: 'verified' } },
    f => { f.economics.refundFraction = 0.6; f.economics.processingFraction = 0.5 },
    f => { f.economics.qualityReviewHours = -1 },
    f => { f.economics.engagements = 0 },
    f => { f.economics.hourlyCost = Infinity },
    f => { f.autopublish = true },
  ]
  for (const mutate of cases) { const f = connected(); mutate(f); assert.throws(() => configureAgency(f)) }
})

test('additional quality effort and doubled human time reduce modeled contribution', () => {
  const f = connected()
  const p = configureAgency(f)
  assert.equal(p.price.feeHypothesis, 3500)
  assert.equal(p.price.humanHoursPerEngagement, 18)
  assert.equal(p.economics.base.contribution, 2260)
  assert.equal(p.economics.contingencyReserve, 425)
  assert.equal(p.economics.contributionAfterReserve, 1835)
  assert.ok(p.economics.doubleHumanTime.contribution < 0)
  f.economics.qualityReviewHours = 50
  assert.ok(configureAgency(f).warnings.some(w => w.includes('rescope or reprice')))
})
