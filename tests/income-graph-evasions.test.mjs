/**
 * The adversarial review of 2026-09-02 evaded all four adversarial checks in one
 * sitting, against the maker's own reference graph. Every test in this file is
 * one of those evasions, run verbatim, asserting it is now caught.
 *
 * If a test here starts passing for a different reason than the one named, the
 * check has drifted back into measuring form instead of truth.
 */

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'

import { draftIncomeGraph, migrateGraph, reviewIncomeGraph } from '../lib/income-graph/index.ts'
import { classifyEvidenceSource, demandLanguage, hasExternalEffect } from '../lib/income-graph/adversarial.ts'

const TODAY = '2026-09-02'
const REFERENCE = JSON.parse(
  readFileSync(path.join(process.cwd(), 'data', 'income-graph-request-to-quote.json'), 'utf8'),
)

const clone = () => JSON.parse(JSON.stringify(REFERENCE))
const node = (graph, id) => graph.nodes.find((n) => n.id === id)
const errors = (report, code) =>
  report.findings.filter((f) => f.code === code && f.severity === 'error')

// ---------------------------------------------------------------------------
// F1 — fake evidence passed. "trust me bro" / "everyone said yes" scored zero.
// ---------------------------------------------------------------------------

test('F1: an uncheckable source and a junk finding no longer reach ready-to-test', () => {
  const graph = clone()
  const evidence = node(graph, 'evidence-willingness')
  evidence.provenance.source = 'trust me bro'
  evidence.data.finding = 'everyone said yes'

  const report = reviewIncomeGraph(graph, TODAY)
  const found = errors(report, 'A02')
  assert.ok(
    found.some((f) => f.path === '/nodes/evidence-willingness/provenance/source'),
    'the source must be rejected as uncheckable',
  )
  assert.ok(
    found.some((f) => f.path === '/nodes/evidence-willingness/data/finding'),
    'the finding must be rejected as recording nothing',
  )
  assert.equal(report.activation, 'blocked')
})

test('F1: the three checkable source shapes are accepted and everything else is not', () => {
  assert.equal(classifyEvidenceSource('https://example.org/report.pdf'), 'url')
  assert.equal(classifyEvidenceSource('knowledge/07-field-dossier.md#pricing'), 'path')
  assert.equal(classifyEvidenceSource('interview:Jane Roe 2026-08-14'), 'interview')
  assert.equal(classifyEvidenceSource('trust me bro'), 'unverifiable')
  assert.equal(classifyEvidenceSource('desk research'), 'unverifiable')
  assert.equal(classifyEvidenceSource('industry knowledge'), 'unverifiable')
  assert.equal(classifyEvidenceSource(''), 'unverifiable')
})

test('F1: an interview record naming a person and a date passes', () => {
  const graph = clone()
  node(graph, 'evidence-willingness').provenance.source = 'interview:Jane Roe 2026-08-14'
  assert.deepEqual(errors(reviewIncomeGraph(graph, TODAY), 'A02'), [])
})

// ---------------------------------------------------------------------------
// F2 — the hype paragraph that scored zero against the 31-phrase blacklist.
// ---------------------------------------------------------------------------

const REVIEWERS_HYPE =
  'Recurring revenue that keeps earning while you rest. Totally hands-off. Replace your paycheck in 90 days, zero selling required. Residual earnings, no ceiling.'

test('F2: the paraphrase that contained no blacklisted phrase now blocks', () => {
  const graph = clone()
  node(graph, 'asset-brief-template').notes = REVIEWERS_HYPE

  const report = reviewIncomeGraph(graph, TODAY)
  const hype = errors(report, 'A01')
  assert.ok(hype.length >= 2, `expected at least two A01 errors, got ${hype.length}`)
  const rules = hype.map((f) => f.message.match(/hype \(([a-z-]+)\)/)?.[1])
  assert.ok(rules.includes('money-without-work'), 'money asserted alongside the absence of work')
  assert.ok(rules.includes('timeframe-promise'), 'a deadline on someone else’s money')
  assert.equal(report.activation, 'blocked')
})

test('F2: one accidental phrase warns, a second one blocks', () => {
  const one = clone()
  node(one, 'asset-brief-template').notes = 'Effortless setup.'
  const warned = reviewIncomeGraph(one, TODAY).findings.filter((f) => f.code === 'A01')
  assert.equal(warned.length, 1)
  assert.equal(warned[0].severity, 'warning')
  assert.equal(reviewIncomeGraph(one, TODAY).valid, true)

  const two = clone()
  node(two, 'asset-brief-template').notes = 'Effortless setup. Guaranteed results.'
  const blocked = reviewIncomeGraph(two, TODAY).findings.filter((f) => f.code === 'A01')
  assert.ok(blocked.length >= 2)
  assert.ok(blocked.every((f) => f.severity === 'error'))
})

test('F2: honest mechanism language still scores zero', () => {
  const graph = clone()
  node(graph, 'offer-scope-brief').notes =
    'The buyer receives one brief per request. Nothing is promised about whether it wins the job.'
  assert.deepEqual(
    reviewIncomeGraph(graph, TODAY).findings.filter((f) => f.code === 'A01'),
    [],
  )
})

// ---------------------------------------------------------------------------
// F3 — the demand check was opt-in: moving the claim into `notes` deleted it.
// ---------------------------------------------------------------------------

test('F3: moving a demand claim into notes and dropping the edge no longer skips A02', () => {
  const graph = clone()
  const customer = node(graph, 'customer-owner-operator')
  customer.notes = customer.data.demandClaim
  delete customer.data.demandClaim
  graph.edges = graph.edges.filter((e) => !(e.type === 'evidences' && e.to === 'customer-owner-operator'))

  const found = errors(reviewIncomeGraph(graph, TODAY), 'A02')
  assert.ok(
    found.some((f) => f.path === '/nodes/customer-owner-operator/notes'),
    'demand language in prose must require evidence',
  )
})

test('F3: a price with no evidence behind it is a demand claim with a number on it', () => {
  const graph = clone()
  const offer = node(graph, 'offer-scope-brief')
  delete offer.data.demandClaim
  graph.edges = graph.edges.filter((e) => !(e.type === 'evidences' && e.to === 'offer-scope-brief'))

  const found = errors(reviewIncomeGraph(graph, TODAY), 'A02')
  assert.ok(found.some((f) => f.path === '/nodes/offer-scope-brief/data/price'))
})

test('F3: a volume assumption needs evidence too', () => {
  const graph = clone()
  const customer = node(graph, 'customer-owner-operator')
  delete customer.data.demandClaim
  customer.data.volumeAssumption = { unitsPerMonth: 12 }
  graph.edges = graph.edges.filter((e) => !(e.type === 'evidences' && e.to === 'customer-owner-operator'))

  const found = errors(reviewIncomeGraph(graph, TODAY), 'A02')
  assert.ok(found.some((f) => f.path === '/nodes/customer-owner-operator/data/volumeAssumption'))
})

test('F3: demand language is recognised by shape, not by field name', () => {
  assert.ok(demandLanguage('Customers said they would pay for this.').length > 0)
  assert.ok(demandLanguage('Everyone wants a faster scope.').length > 0)
  assert.ok(demandLanguage('Conversion sits around 30% of enquiries.').includes('a percentage'))
  assert.ok(demandLanguage('We expect 40 orders per month.').some((m) => m.startsWith('a rate')))
  assert.deepEqual(demandLanguage('The template holds acceptance checks and non-goals.'), [])
})

// ---------------------------------------------------------------------------
// F4 — a HumanGate that gated nothing: an agent approver, and a reworded step.
// ---------------------------------------------------------------------------

test('F4: an approver that names the agent is not a gate', () => {
  const graph = clone()
  node(graph, 'gate-customer-facing').data.approver = 'the agent'
  const found = errors(reviewIncomeGraph(graph, TODAY), 'A04')
  assert.ok(found.some((f) => f.message.includes('is not a person')))
  assert.equal(reviewIncomeGraph(graph, TODAY).activation, 'blocked')
})

test('F4: an approver that resolves to an AgentRole is rejected by name', () => {
  const graph = clone()
  node(graph, 'gate-customer-facing').data.approver = 'Scope drafter'
  const found = errors(reviewIncomeGraph(graph, TODAY), 'A04')
  assert.ok(found.some((f) => f.message.includes('agent role "role-scope-drafter"')))
})

test('F4: an approver resolving to a Human node is accepted', () => {
  const graph = clone()
  node(graph, 'gate-customer-facing').data.approver = 'human-frank'
  assert.deepEqual(errors(reviewIncomeGraph(graph, TODAY), 'A04'), [])
})

test('F4: rewording an external effect does not make it reversible', () => {
  const graph = clone()
  const step = node(graph, 'workflow-request-to-brief').data.steps.find((s) => s.id === 'deliver')
  step.action = 'Transmits the finished document onward to the prospect'
  step.irreversible = false

  const found = errors(reviewIncomeGraph(graph, TODAY), 'A04')
  assert.equal(found.length, 1, 'exactly the forced-irreversible finding; the gate still covers the step')
  assert.match(found[0].message, /reaches outside your system/)
})

test('F4: an ungated external-effect step blocks even when it is marked reversible', () => {
  const graph = clone()
  const workflow = node(graph, 'workflow-request-to-brief')
  const step = workflow.data.steps.find((s) => s.id === 'deliver')
  step.action = 'Transmits the finished document onward to the prospect'
  step.irreversible = false
  node(graph, 'gate-customer-facing').data.gatedStepIds = ['agreement']

  const found = errors(reviewIncomeGraph(graph, TODAY), 'A04')
  assert.ok(found.some((f) => f.message.includes('has no HumanGate')))
})

test('F4: external effect is detected by verb and by recipient, not by literal string', () => {
  assert.ok(hasExternalEffect('Send the reviewed brief to the customer').length > 0)
  assert.ok(hasExternalEffect('Transmits the finished document onward to the prospect').length > 0)
  assert.ok(hasExternalEffect('Hand the summary to the client').length > 0)
  assert.ok(hasExternalEffect('Sign the delivery agreement').length > 0)
  assert.deepEqual(hasExternalEffect('Structure the inbound request against the request schema'), [])
  assert.deepEqual(hasExternalEffect('Estimate implementation effort in hours, without pricing it'), [])
})

// ---------------------------------------------------------------------------
// F5 — the review threw on null instead of returning findings.
// ---------------------------------------------------------------------------

test('F5: the review never throws at its own caller', () => {
  for (const input of [null, undefined, 'a graph', 42, [], true]) {
    const report = reviewIncomeGraph(input, TODAY)
    assert.equal(report.valid, false)
    assert.equal(report.activation, 'blocked')
    assert.equal(report.findings.length, 1)
    assert.equal(report.findings[0].code, 'S00')
    assert.equal(report.economics.observedRevenue, 0)
    assert.deepEqual(report.tasks, [])
  }
})

// ---------------------------------------------------------------------------
// v1 → v1.1 migration: unknown irreversibility is dangerous, not safe.
// ---------------------------------------------------------------------------

test('a v1 step with no irreversible flag migrates to irreversible and is flagged', () => {
  const graph = clone()
  graph.apiVersion = 'agenticincome.ai/v1'
  const step = node(graph, 'workflow-request-to-brief').data.steps.find((s) => s.id === 'draft')
  delete step.irreversible

  const migration = migrateGraph(graph)
  assert.equal(migration.migrated, true)
  assert.equal(migration.graph.apiVersion, 'agenticincome.ai/v1.1')
  assert.equal(
    migration.graph.nodes.find((n) => n.id === 'workflow-request-to-brief').data.steps.find((s) => s.id === 'draft')
      .irreversible,
    true,
  )
  assert.equal(step.irreversible, undefined, 'the caller’s document is not mutated')

  const report = reviewIncomeGraph(graph, TODAY)
  assert.equal(report.migratedFrom, 'agenticincome.ai/v1')
  assert.ok(report.findings.some((f) => f.code === 'M01' && f.severity === 'warning'))
  assert.ok(
    errors(report, 'A04').some((f) => f.message.includes('"draft" has no HumanGate')),
    'the migrated step is now gated like any other irreversible step',
  )
})

test('a v1.1 document that omits irreversible is a structural error, not a migration', () => {
  const graph = clone()
  delete node(graph, 'workflow-request-to-brief').data.steps.find((s) => s.id === 'draft').irreversible
  const report = reviewIncomeGraph(graph, TODAY)
  assert.equal(report.migratedFrom, null)
  assert.ok(report.findings.some((f) => f.code === 'S11' && f.path.endsWith('/irreversible')))
})

// ---------------------------------------------------------------------------
// The buyer's first paste: a thesis in, a refusal out.
// ---------------------------------------------------------------------------

const THESIS =
  'Small renovation firms lose qualified inbound work because nobody turns a messy request into a scope brief within a day, and they will pay €180 per brief for someone who does.'

test('a plain-text thesis drafts a graph and leads with what it cannot support', () => {
  const draft = draftIncomeGraph(THESIS, { today: TODAY, principal: 'Frank Riemer' })

  assert.equal(draft.graph.apiVersion, 'agenticincome.ai/v1.1')
  assert.equal(draft.graph.metadata.principal, 'Frank Riemer')
  assert.deepEqual(draft.graph.nodes.find((n) => n.id === 'offer-1').data.price, {
    currency: 'EUR',
    amount: 180,
    unit: 'brief',
  })

  assert.ok(draft.unsupported.length >= 2)
  assert.equal(draft.unsupported[0].path, '/nodes/customer-1/data/demandClaim')
  assert.ok(draft.unsupported.every((u) => u.evidenceThatWouldSettleIt.length > 40))
  assert.ok(draft.unsupported.every((u) => u.costInFounderHours > 0))
  assert.match(draft.headline, /founder hours/)
  assert.ok(draft.assumptions.length > 0)
})

test('the drafted graph is structurally well formed: what blocks it is the missing evidence', () => {
  const draft = draftIncomeGraph(THESIS, { today: TODAY, principal: 'Frank Riemer' })
  const report = reviewIncomeGraph(draft.graph, TODAY)

  const structural = report.findings.filter((f) => f.code.startsWith('S') && f.severity === 'error')
  assert.deepEqual(structural, [], 'a stranger must not meet a wall of S-codes')

  const blocking = report.findings.filter((f) => f.severity === 'error')
  assert.ok(blocking.length > 0, 'an evidence-free thesis is not ready to test')
  assert.ok(
    blocking.every((f) => f.code === 'A02' || f.code === 'C01'),
    `only missing evidence should block, got ${[...new Set(blocking.map((f) => f.code))].join(', ')}`,
  )
  assert.ok(
    blocking.some((f) => f.code === 'C01' && f.message.includes('Evidence')),
    'the draft says plainly that it has no evidence node',
  )
})

test('drafting is deterministic and reads no clock', () => {
  const a = draftIncomeGraph(THESIS, { today: TODAY })
  const b = draftIncomeGraph(THESIS, { today: TODAY })
  assert.deepEqual(a, b)
  const later = draftIncomeGraph(THESIS, { today: '2026-10-02' })
  assert.notEqual(later.graph.nodes.find((n) => n.id === 'kill-1').data.reviewBy, a.graph.nodes.find((n) => n.id === 'kill-1').data.reviewBy)
})

test('a thesis with no demand assertion is told so, rather than being flattered', () => {
  const draft = draftIncomeGraph('I want to build a tool that formats markdown tables.', {
    today: TODAY,
  })
  assert.ok(draft.headline.length > 0)
  assert.ok(draft.assumptions.some((a) => a.includes('price')))
})
