import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'

import {
  exportTasks,
  projectToIncomeSystem,
  reviewIncomeGraph,
  tasksToMarkdown,
} from '../lib/income-graph/index.ts'
import { NODE_TYPES, EDGE_TYPES } from '../lib/income-graph/model.ts'

const TODAY = '2026-09-02'
const REFERENCE = JSON.parse(
  readFileSync(path.join(process.cwd(), 'data', 'income-graph-request-to-quote.json'), 'utf8'),
)

function clone() {
  return JSON.parse(JSON.stringify(REFERENCE))
}

function node(graph, id) {
  return graph.nodes.find((n) => n.id === id)
}

function codes(report) {
  return report.findings.map((f) => f.code)
}

test('the reference graph passes every check with zero errors', () => {
  const report = reviewIncomeGraph(REFERENCE, TODAY)
  assert.deepEqual(
    report.findings.filter((f) => f.severity === 'error'),
    [],
  )
  assert.equal(report.valid, true)
})

test('a valid graph with no observed revenue is ready to test, never activated', () => {
  const report = reviewIncomeGraph(REFERENCE, TODAY)
  assert.equal(report.activation, 'ready-to-test')
  assert.equal(report.economicEvent, null)
  assert.equal(report.economics.observedRevenue, 0)
})

test('activation requires an attested revenue observation, not a forecast', () => {
  const graph = clone()
  graph.nodes.push({
    id: 'revenue-first-brief',
    type: 'RevenueObservation',
    label: 'First paid brief',
    owner: 'Frank Riemer',
    provenance: { source: 'invoice 2026-001', date: '2026-09-01' },
    version: '1.0.0',
    visibility: 'private',
    evaluation: 'Reconciled against the merchant payout.',
    data: {
      observed: { currency: 'EUR', amount: 180, occurredAt: '2026-09-01', units: 1 },
    },
  })

  const unattested = reviewIncomeGraph(graph, TODAY)
  assert.ok(codes(unattested).includes('A02'), 'revenue without a receipt must be rejected')
  assert.equal(unattested.economics.observedRevenue, 0)

  graph.nodes.push({
    id: 'receipt-first-brief',
    type: 'Receipt',
    label: 'Merchant payout record',
    owner: 'Frank Riemer',
    provenance: { source: 'merchant export 2026-09-01.csv', date: '2026-09-01' },
    version: '1.0.0',
    visibility: 'private',
    evaluation: 'The payout line matches the invoice amount.',
    data: { artifact: 'receipts/2026-09-01-payout.csv' },
  })
  graph.edges.push({
    id: 'e-receipt-revenue',
    type: 'attests',
    from: 'receipt-first-brief',
    to: 'revenue-first-brief',
    owner: 'Frank Riemer',
    provenance: { source: 'merchant export 2026-09-01.csv', date: '2026-09-01' },
    version: '1.0.0',
    visibility: 'private',
    evaluation: 'Amounts reconcile.',
  })

  const attested = reviewIncomeGraph(graph, TODAY)
  assert.equal(attested.valid, true)
  assert.equal(attested.activation, 'activated')
  assert.deepEqual(attested.economicEvent, {
    kind: 'observed-revenue',
    amount: 180,
    currency: 'EUR',
    units: 1,
  })
})

test('A01 catches hype language wherever it hides', () => {
  const graph = clone()
  node(graph, 'offer-scope-brief').label = 'Passive income from scope briefs, guaranteed'
  const report = reviewIncomeGraph(graph, TODAY)
  const hype = report.findings.filter((f) => f.code === 'A01')
  assert.equal(hype.length, 2)
  assert.ok(hype.every((f) => f.path === '/nodes/offer-scope-brief/label'))
})

test('A01 does not fire on honest mechanism language', () => {
  const graph = clone()
  node(graph, 'offer-scope-brief').notes =
    'The buyer receives one brief per request. Nothing is promised about whether it wins the job.'
  assert.deepEqual(
    reviewIncomeGraph(graph, TODAY).findings.filter((f) => f.code === 'A01'),
    [],
  )
})

test('A02 rejects a demand claim with no evidence behind it', () => {
  const graph = clone()
  graph.edges = graph.edges.filter((e) => e.to !== 'customer-owner-operator' || e.type !== 'evidences')
  const report = reviewIncomeGraph(graph, TODAY)
  const fabricated = report.findings.filter((f) => f.code === 'A02')
  assert.equal(fabricated.length, 1)
  assert.match(fabricated[0].path, /customer-owner-operator/)
})

test('A02 rejects evidence dated in the future and evidence with no finding', () => {
  const graph = clone()
  node(graph, 'evidence-willingness').provenance.date = '2027-01-01'
  delete node(graph, 'evidence-scoping-delay').data.finding
  const found = reviewIncomeGraph(graph, TODAY).findings.filter((f) => f.code === 'A02')
  assert.equal(found.length, 2, 'one future-date finding even though it supports two claims, plus the empty finding')
  assert.ok(found.some((f) => f.message.includes('future')))
  assert.ok(found.some((f) => f.message.includes('records no finding')))
})

test('A03 rejects scarcity with no basis and recurring pricing with no exit', () => {
  const graph = clone()
  const offer = node(graph, 'offer-scope-brief')
  offer.data.scarcity = { claim: 'Four slots this month' }
  offer.data.price = { currency: 'EUR', amount: 180, unit: 'month' }
  const dark = reviewIncomeGraph(graph, TODAY).findings.filter((f) => f.code === 'A03')
  assert.equal(dark.length, 2)
  assert.ok(dark.some((f) => f.message.includes('no basis')))
  assert.ok(dark.some((f) => f.message.includes('forced continuity')))
})

test('A03 accepts scarcity that names what produces the number', () => {
  const graph = clone()
  node(graph, 'offer-scope-brief').data.scarcity = {
    claim: 'Four briefs a month',
    countBasis: 'Founder release time: 30 minutes per brief against 2 hours a week.',
  }
  assert.deepEqual(
    reviewIncomeGraph(graph, TODAY).findings.filter((f) => f.code === 'A03'),
    [],
  )
})

test('A03 rejects a buyer-borne cost that is not disclosed', () => {
  const graph = clone()
  node(graph, 'cost-model-usage').data.borneByBuyer = true
  const dark = reviewIncomeGraph(graph, TODAY).findings.filter((f) => f.code === 'A03')
  assert.equal(dark.length, 1)
  assert.match(dark[0].message, /not disclosed/)
})

test('A04 blocks an irreversible agent step with no human gate', () => {
  const graph = clone()
  node(graph, 'gate-customer-facing').data.gatedStepIds = ['agreement']
  const unauthorized = reviewIncomeGraph(graph, TODAY).findings.filter(
    (f) => f.code === 'A04' && f.severity === 'error',
  )
  assert.equal(unauthorized.length, 1)
  assert.match(unauthorized[0].message, /irreversible agent step "deliver"/)
})

test('A04 warns when a step reads irreversible but claims otherwise', () => {
  const graph = clone()
  const workflow = node(graph, 'workflow-request-to-brief')
  workflow.data.steps.find((s) => s.id === 'deliver').irreversible = false
  const warnings = reviewIncomeGraph(graph, TODAY).findings.filter(
    (f) => f.code === 'A04' && f.severity === 'warning',
  )
  assert.equal(warnings.length, 1)
  assert.match(warnings[0].message, /reads as irreversible/)
})

test('A04 requires the four estate-wide denied actions on every agent role', () => {
  const graph = clone()
  node(graph, 'role-scope-drafter').data.deniedActions = ['sign-contract']
  const missing = reviewIncomeGraph(graph, TODAY).findings.filter((f) => f.code === 'A04')
  assert.equal(missing.length, 3)
})

test('A04 catches an action that is both allowed and denied', () => {
  const graph = clone()
  node(graph, 'role-scope-drafter').data.allowedActions.push('change-price')
  const contradiction = reviewIncomeGraph(graph, TODAY).findings.filter(
    (f) => f.code === 'A04' && f.message.includes('both allowed and denied'),
  )
  assert.equal(contradiction.length, 1)
})

test('a gate pointing at a step that does not exist is not a gate', () => {
  const graph = clone()
  node(graph, 'gate-customer-facing').data.gatedStepIds = ['deliver', 'agreement', 'ghost-step']
  const broken = reviewIncomeGraph(graph, TODAY).findings.filter((f) =>
    f.message.includes('ghost-step'),
  )
  assert.equal(broken.length, 1)
})

test('structural checks reject unknown types, bad endpoints, and duplicate ids', () => {
  const graph = clone()
  graph.nodes.push({ ...node(graph, 'offer-scope-brief') })
  graph.edges.push({
    id: 'e-bad',
    type: 'serves',
    from: 'customer-owner-operator',
    to: 'offer-scope-brief',
    owner: 'Frank Riemer',
    provenance: { source: 'test', date: '2026-09-02' },
    version: '1.0.0',
    visibility: 'public',
    evaluation: 'n/a',
  })
  const found = codes(reviewIncomeGraph(graph, TODAY))
  assert.ok(found.includes('S10'), 'duplicate id')
  assert.ok(found.includes('S14'), 'illegal edge endpoints')
})

test('every node and edge must carry owner, provenance, version, visibility, and an evaluation rule', () => {
  const graph = clone()
  const target = node(graph, 'channel-trade-associations')
  target.owner = ''
  target.evaluation = ''
  target.visibility = 'everyone'
  target.version = 'v1'
  target.provenance = { source: '', date: 'August' }
  const found = codes(reviewIncomeGraph(graph, TODAY))
  for (const code of ['S03', 'S04', 'S05', 'S06', 'S07', 'S08']) {
    assert.ok(found.includes(code), `expected ${code}`)
  }
})

test('C11 refuses a partner edge that cites no verified registry record', () => {
  const graph = clone()
  graph.nodes.push({
    id: 'partner-unverified',
    type: 'Partner',
    label: 'Some tool with an affiliate program',
    owner: 'Frank Riemer',
    provenance: { source: 'somebody mentioned it', date: '2026-09-01' },
    version: '1.0.0',
    visibility: 'public',
    evaluation: 'Re-verify terms quarterly.',
    data: {},
  })
  const partner = reviewIncomeGraph(graph, TODAY).findings.filter((f) => f.code === 'C11')
  assert.equal(partner.length, 2, 'unverified source and supplies nothing')
})

test('economics reports costs and founder hours, and never a projection', () => {
  const { economics } = reviewIncomeGraph(REFERENCE, TODAY)
  assert.equal(economics.currency, 'EUR')
  assert.equal(economics.monthlyCostFloor, 40)
  assert.equal(economics.founderHoursPerMonth, 10)
  assert.equal(economics.breakEvenUnitsPerMonth, 1)
  assert.equal(economics.observedRevenuePerFounderHour, null)
  assert.ok(economics.notes.some((n) => n.includes('No attested revenue')))
})

test('E01 fires when no founder time is accounted anywhere', () => {
  const graph = clone()
  delete node(graph, 'cost-founder-time').data.founderMinutesPerMonth
  assert.ok(codes(reviewIncomeGraph(graph, TODAY)).includes('E01'))
})

test('the projected IncomeSystem manifest names what it cannot know', () => {
  const draft = projectToIncomeSystem(REFERENCE)
  assert.equal(draft.manifest.kind, 'IncomeSystem')
  assert.equal(draft.manifest.apiVersion, 'agenticincome.ai/v1')
  assert.ok(draft.missing.includes('/spec/principal/legalName'))
  assert.ok(draft.missing.includes('/spec/agent/runtime'))
  assert.match(draft.validator, /agentic-income-skills/)
  assert.equal(draft.manifest.spec.offer.incomeGuarantee, false)
  assert.equal(draft.manifest.proof.status, 'unproven')
})

test('the projected manifest carries the four denied actions even if the graph forgot them', () => {
  const graph = clone()
  node(graph, 'role-scope-drafter').data.deniedActions = []
  const denied = projectToIncomeSystem(graph).manifest.spec.authority.deniedActions
  for (const action of ['sign-contract', 'change-price', 'transfer-funds', 'increase-budget']) {
    assert.ok(denied.includes(action))
  }
})

test('exported tasks preserve the gate on every gated step', () => {
  const tasks = exportTasks(REFERENCE)
  const deliver = tasks.find((t) => t.id === 'workflow-request-to-brief.deliver')
  assert.match(deliver.gate, /approver: Frank Riemer/)
  assert.equal(tasks.find((t) => t.id === 'workflow-request-to-brief.draft').gate, null)
  assert.ok(tasks.some((t) => t.id === 'review.kill-no-paid-brief'))
  assert.ok(tasks.some((t) => t.id === 'maintenance-template-review'.replace(/^/, 'maintenance.')))
  assert.match(tasksToMarkdown(REFERENCE, tasks), /gate: Release before anything reaches the customer/)
})

test('the review is deterministic and free of clock and randomness', () => {
  const a = reviewIncomeGraph(REFERENCE, TODAY)
  const b = reviewIncomeGraph(JSON.parse(JSON.stringify(REFERENCE)), TODAY)
  assert.deepEqual(a, b)
})

test('the published JSON Schema is generated from the model and is not stale', async () => {
  const { buildSchema } = await import('../scripts/gen-income-graph-schema.mjs')
  const committed = readFileSync(
    path.join(process.cwd(), 'public', 'schemas', 'income-graph.v1.schema.json'),
    'utf8',
  )
  assert.equal(committed, `${JSON.stringify(buildSchema(), null, 2)}\n`)
})

test('the vocabulary is closed: 17 node types and their edge rules', () => {
  assert.equal(NODE_TYPES.length, 17)
  assert.equal(new Set(NODE_TYPES).size, 17)
  assert.equal(new Set(EDGE_TYPES).size, EDGE_TYPES.length)
})
