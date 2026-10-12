import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'

import { reviewIncomeGraph } from '../lib/income-graph/index.ts'
import { settlementProbe } from '../lib/income-graph/settlement.ts'

const TODAY = '2026-09-26'
const REFERENCE = JSON.parse(
  readFileSync(path.join(process.cwd(), 'data', 'income-graph-request-to-quote.json'), 'utf8'),
)

function clone() {
  return JSON.parse(JSON.stringify(REFERENCE))
}

function node(graph, id) {
  return graph.nodes.find((entry) => entry.id === id)
}

function codes(report) {
  return report.findings.map((finding) => finding.code)
}

function railCodes(report) {
  return codes(report).filter((code) => code.startsWith('R'))
}

const PROVENANCE = { source: 'notes/settlement-rail.md', date: '2026-09-26' }

function stamp(extra) {
  return {
    owner: 'Frank Riemer',
    provenance: PROVENANCE,
    version: '1.0.0',
    visibility: 'private',
    evaluation: 'Re-read this node against the settlement rules before anyone is shown it.',
    ...extra,
  }
}

test('a graph that never mentions a chain clears in a merchant account', () => {
  const report = reviewIncomeGraph(REFERENCE, TODAY)
  assert.deepEqual(railCodes(report), [])
  assert.equal(report.settlements.length, 1)
  assert.equal(report.settlements[0].rail, 'fiat-account')
  assert.equal(report.settlements[0].admitted, true)
  assert.equal(report.valid, true)
})

test('design tokens and a supply chain are not a token market', () => {
  const graph = clone()
  node(graph, 'offer-scope-brief').notes =
    'The brief template uses design tokens. The print supply chain is an ordinary vendor.'
  const report = reviewIncomeGraph(graph, TODAY)
  assert.deepEqual(railCodes(report), [])
  assert.deepEqual(settlementProbe('design tokens in the supply chain'), { chain: [], refuse: [] })
})

test('an NFT collection with no rail is refused', () => {
  const graph = clone()
  node(graph, 'offer-scope-brief').label = 'A 10k NFT collection with a whitelist mint'
  const report = reviewIncomeGraph(graph, TODAY)
  assert.ok(railCodes(report).includes('R04'))
  assert.equal(report.activation, 'blocked')
  assert.equal(report.settlements[0].admitted, false)
})

test('naming the rail on-chain-right does not launder a token market', () => {
  const graph = clone()
  const offer = node(graph, 'offer-scope-brief')
  offer.label = 'Holder rewards from the creator coin'
  offer.data.settlement = {
    rail: 'on-chain-right',
    right: 'license',
    strangerEnforcement: 'The licensee must still prove the grant after the seller is gone.',
  }
  offer.data.price.unit = 'license'
  const report = reviewIncomeGraph(graph, TODAY)
  assert.ok(railCodes(report).includes('R04'))
  assert.equal(report.settlements[0].admitted, false)
})

test('a merchant-account rail that still says smart contract is a contradiction', () => {
  const graph = clone()
  const offer = node(graph, 'offer-scope-brief')
  offer.notes = 'Buyers will truly own it because of the smart contract.'
  offer.data.settlement = { rail: 'fiat-account' }
  const report = reviewIncomeGraph(graph, TODAY)
  assert.ok(railCodes(report).includes('R02'))
})

test('a chain word with no rail is not silence', () => {
  const graph = clone()
  node(graph, 'offer-scope-brief').notes = 'We deploy one smart contract and stop there.'
  const report = reviewIncomeGraph(graph, TODAY)
  assert.ok(railCodes(report).includes('R03'))
  assert.equal(report.settlements[0].rail, 'refuse')
})

test('a paraphrase that never says NFT is still a drop', () => {
  const graph = clone()
  node(graph, 'offer-scope-brief').label = 'A community drop of ten thousand generative characters'
  const report = reviewIncomeGraph(graph, TODAY)
  assert.ok(railCodes(report).includes('R04'))
  const probe = settlementProbe('A community drop of ten thousand generative characters')
  assert.ok(probe.refuse.includes('drop'))
  assert.ok(probe.refuse.includes('thousand'))
})

test('a refused chain idea can sit in the graph without being sold', () => {
  const graph = clone()
  graph.nodes.push({
    id: 'offer-nft-refused',
    type: 'Offer',
    label: 'NFT collection we will not sell',
    ...stamp({}),
    data: { settlement: { rail: 'refuse' } },
  })
  const report = reviewIncomeGraph(graph, TODAY)
  assert.equal(report.valid, true)
  const refused = report.settlements.find((verdict) => verdict.offerId === 'offer-nft-refused')
  assert.equal(refused.rail, 'refuse')
  assert.equal(refused.admitted, true)
  assert.equal(report.settlements[0].rail, 'fiat-account')
})

test('a refused offer that still serves a customer is blocked', () => {
  const graph = clone()
  graph.nodes.push({
    id: 'offer-nft-refused',
    type: 'Offer',
    label: 'NFT collection',
    ...stamp({}),
    data: { settlement: { rail: 'refuse' } },
  })
  graph.edges.push({
    id: 'e-refused-serves',
    type: 'serves',
    from: 'offer-nft-refused',
    to: 'customer-owner-operator',
    ...stamp({}),
  })
  const report = reviewIncomeGraph(graph, TODAY)
  assert.ok(railCodes(report).includes('R01'))
  assert.equal(report.activation, 'blocked')
})

test('a prompt pack cannot be relabelled as a license', () => {
  const graph = clone()
  const offer = node(graph, 'offer-scope-brief')
  offer.notes = 'The buyer downloads the prompt pack and the smart contract remembers them.'
  offer.data.price.unit = 'license'
  offer.data.settlement = {
    rail: 'on-chain-right',
    right: 'license',
    strangerEnforcement: 'The licensee must still prove the grant after the seller is gone.',
    chain: 'base',
  }
  const report = reviewIncomeGraph(graph, TODAY)
  assert.ok(railCodes(report).includes('R06'))
  assert.equal(report.settlements[0].admitted, false)
})

test('an agent that can mint is blocked on an otherwise fiat graph', () => {
  const graph = clone()
  node(graph, 'role-scope-drafter').data.allowedActions.push('mint-collection')
  const report = reviewIncomeGraph(graph, TODAY)
  assert.ok(railCodes(report).includes('R05'))
  assert.equal(report.activation, 'blocked')
})

test('a thesis that sells a token market is blocked even when the offer is fiat', () => {
  const graph = clone()
  graph.metadata.thesis = 'A 10k NFT collection funds the studio and the brief is a side door.'
  const report = reviewIncomeGraph(graph, TODAY)
  assert.ok(codes(report).includes('R07'))
  assert.equal(report.activation, 'blocked')
})

test('a print license with a human gate and a priced chain cost is admitted and not activated', () => {
  const graph = clone()
  const offer = node(graph, 'offer-scope-brief')
  offer.label = 'Print license for one story'
  offer.data.price.unit = 'license'
  offer.data.settlement = {
    rail: 'on-chain-right',
    right: 'license',
    chain: 'story',
    strangerEnforcement:
      'The licensee must still prove the grant after the seller is gone and a successor disputes it.',
  }
  node(graph, 'workflow-request-to-brief').data.steps.push({
    id: 'register-license',
    action: 'Register the license against the merchant receipt',
    irreversible: true,
    actor: 'human',
  })
  node(graph, 'gate-customer-facing').data.gatedStepIds.push('register-license')
  graph.nodes.push({
    id: 'cost-chain',
    type: 'Cost',
    label: 'Chain fee, custody, and legal review',
    ...stamp({}),
    data: { amount: { currency: 'EUR', amount: 25, period: 'once' }, borneByBuyer: false },
  })
  graph.edges.push({
    id: 'e-incurs-chain',
    type: 'incurs',
    from: 'workflow-request-to-brief',
    to: 'cost-chain',
    ...stamp({ evaluation: 'The invoice names gas, custody, or counsel.' }),
  })

  const report = reviewIncomeGraph(graph, TODAY)
  assert.deepEqual(
    report.findings.filter((finding) => finding.severity === 'error'),
    [],
    report.findings.filter((finding) => finding.severity === 'error').map((finding) => `${finding.code} ${finding.message}`).join('\n'),
  )
  assert.equal(report.activation, 'ready-to-test')
  assert.equal(report.settlements[0].rail, 'on-chain-right')
  assert.equal(report.settlements[0].admitted, true)
  assert.ok(report.nextDecisions.some((line) => line.includes('mint a collection')))
})

function meter(graph, patch) {
  const offer = node(graph, 'offer-scope-brief')
  offer.label = 'One cleared sync use'
  offer.data.price.unit = 'request'
  offer.data.price.amount = 2
  offer.data.settlement = {
    rail: 'machine-payment',
    protocol: 'x402',
    asset: 'usdc',
    chain: 'base',
    spendCap: { amount: 50, currency: 'USD', period: 'day' },
    ...patch,
  }
  node(graph, 'workflow-request-to-brief').data.steps.push({
    id: 'raise-cap',
    action: 'Raise the spend cap for the agent buyer',
    irreversible: true,
    actor: 'human',
  })
  node(graph, 'gate-customer-facing').data.gatedStepIds.push('raise-cap')
  graph.nodes.push({
    id: 'cost-facilitator',
    type: 'Cost',
    label: 'Facilitator and network fee',
    ...stamp({}),
    data: { amount: { currency: 'EUR', amount: 5, period: 'monthly' }, borneByBuyer: false },
  })
  graph.edges.push({
    id: 'e-incurs-facilitator',
    type: 'incurs',
    from: 'workflow-request-to-brief',
    to: 'cost-facilitator',
    ...stamp({}),
  })
  return offer
}

test('an x402 sync license inside a daily cap is admitted and the endpoint stays off', () => {
  const graph = clone()
  meter(graph)
  const report = reviewIncomeGraph(graph, TODAY)
  assert.deepEqual(
    report.findings.filter((finding) => finding.severity === 'error'),
    [],
    report.findings.filter((finding) => finding.severity === 'error').map((finding) => `${finding.code} ${finding.message}`).join('\n'),
  )
  assert.equal(report.activation, 'ready-to-test')
  assert.equal(report.settlements[0].rail, 'machine-payment')
  assert.equal(report.settlements[0].admitted, true)
  assert.ok(report.nextDecisions.some((line) => line.includes('Leave the endpoint off')))
})

test('a meter with no spend cap is an agent wallet and is blocked', () => {
  const graph = clone()
  const offer = meter(graph)
  delete offer.data.settlement.spendCap
  const report = reviewIncomeGraph(graph, TODAY)
  assert.ok(railCodes(report).includes('R06'))
  assert.equal(report.settlements[0].admitted, false)
})

test('Story is a license ledger, not a place to meter a call', () => {
  const graph = clone()
  const offer = meter(graph)
  offer.data.settlement.chain = 'story'
  const report = reviewIncomeGraph(graph, TODAY)
  assert.ok(report.findings.some((finding) => finding.code === 'R06' && finding.message.includes('story')))
})

test('naming x402 without a rail is not a merchant account', () => {
  const graph = clone()
  node(graph, 'offer-scope-brief').notes = 'Agents will pay with x402.'
  const report = reviewIncomeGraph(graph, TODAY)
  assert.ok(railCodes(report).includes('R03'))
})

test('selling an agent identity NFT is refused', () => {
  const graph = clone()
  node(graph, 'offer-scope-brief').label = 'Mint and sell the agent identity NFT'
  const report = reviewIncomeGraph(graph, TODAY)
  assert.ok(railCodes(report).includes('R04'))
})

test('a signed receipt is a proof, and the payment still has a merchant account', () => {
  const graph = clone()
  node(graph, 'offer-scope-brief').data.settlement = { rail: 'signed-receipt' }
  const report = reviewIncomeGraph(graph, TODAY)
  assert.equal(report.valid, true)
  assert.equal(report.settlements[0].rail, 'signed-receipt')
  assert.match(report.settlements[0].because, /merchant account/)
})

test('an mpp session meter with monthly cap on Tempo in EURC is admitted and endpoint stays off until fiat activated', () => {
  const graph = clone()
  meter(graph, {
    protocol: 'mpp',
    asset: 'eurc',
    chain: 'tempo',
    spendCap: { amount: 100, currency: 'EUR', period: 'month' },
  })
  node(graph, 'offer-scope-brief').data.price.unit = 'session'
  const report = reviewIncomeGraph(graph, TODAY)
  assert.deepEqual(
    report.findings.filter((finding) => finding.severity === 'error'),
    [],
  )
  assert.equal(report.settlements[0].rail, 'machine-payment')
  assert.equal(report.settlements[0].admitted, true)
  assert.ok(report.nextDecisions.some((line) => line.includes('Leave the endpoint off until a fiat offer')))
})

test('meter with invalid protocol, asset, chain, unit, or cap period is blocked with R06 findings', () => {
  for (const patch of [
    { protocol: 'unknown-protocol' },
    { asset: 'btc' },
    { chain: 'ethereum' },
    { spendCap: { amount: 10, currency: 'USD', period: 'year' } },
    { spendCap: { amount: 0, currency: 'USD', period: 'day' } },
  ]) {
    const graph = clone()
    meter(graph, patch)
    const report = reviewIncomeGraph(graph, TODAY)
    assert.ok(
      report.findings.some((f) => f.code === 'R06'),
      `Expected R06 finding for patch ${JSON.stringify(patch)}`,
    )
    assert.equal(report.settlements[0].admitted, false)
  }
})

test('when a fiat offer on the graph is activated by an attested payment, the meter leave-endpoint-off decision is omitted', () => {
  const graph = clone()
  // Leave offer-scope-brief as a fiat offer
  // Add Evidence and a second offer that uses machine-payment
  graph.nodes.push({
    id: 'evidence-mpp',
    type: 'Evidence',
    label: 'MPP pricing quote',
    ...stamp({ provenance: { source: 'https://example.com/quote', date: TODAY } }),
    data: { finding: 'Metered session access priced at five euros per session according to official agreement text', kind: 'document' },
  })
  graph.nodes.push({
    id: 'offer-mpp-meter',
    type: 'Offer',
    label: 'Metered session access',
    ...stamp({}),
    data: {
      price: { currency: 'EUR', amount: 5, unit: 'session' },
      settlement: {
        rail: 'machine-payment',
        protocol: 'mpp',
        asset: 'eurc',
        chain: 'tempo',
        spendCap: { amount: 100, currency: 'EUR', period: 'month' },
      },
    },
  })
  graph.edges.push({
    id: 'e-evidences-mpp',
    type: 'evidences',
    from: 'evidence-mpp',
    to: 'offer-mpp-meter',
    ...stamp({}),
  })
  graph.edges.push({
    id: 'e-serves-mpp',
    type: 'serves',
    from: 'offer-mpp-meter',
    to: 'customer-owner-operator',
    ...stamp({}),
  })
  node(graph, 'workflow-request-to-brief').data.steps.push({
    id: 'raise-mpp-cap',
    action: 'Raise the spend cap for the agent buyer',
    irreversible: true,
    actor: 'human',
  })
  node(graph, 'gate-customer-facing').data.gatedStepIds.push('raise-mpp-cap')
  graph.edges.push({
    id: 'e-fulfills-mpp',
    type: 'fulfills',
    from: 'workflow-request-to-brief',
    to: 'offer-mpp-meter',
    ...stamp({}),
  })
  graph.nodes.push({
    id: 'cost-facilitator-mpp',
    type: 'Cost',
    label: 'Facilitator and network fee',
    ...stamp({}),
    data: { amount: { currency: 'EUR', amount: 5, period: 'monthly' }, borneByBuyer: false },
  })
  graph.edges.push({
    id: 'e-incurs-mpp-fac',
    type: 'incurs',
    from: 'offer-mpp-meter',
    to: 'cost-facilitator-mpp',
    ...stamp({}),
  })

  // Before activation, decision line is present
  const reportUnactivated = reviewIncomeGraph(graph, TODAY)
  assert.ok(reportUnactivated.nextDecisions.some((line) => line.includes('Leave the endpoint off until a fiat offer')))

  // Now activate the fiat offer (offer-scope-brief)
  graph.nodes.push({
    id: 'receipt-fiat-1',
    type: 'Receipt',
    label: 'Bank settlement receipt',
    ...stamp({}),
    data: { artifact: 'receipts/fiat-1.pdf' },
  })
  graph.nodes.push({
    id: 'rev-fiat-1',
    type: 'RevenueObservation',
    label: 'First customer payment',
    ...stamp({}),
    data: { observed: { currency: 'EUR', amount: 180, occurredAt: TODAY, units: 1 } },
  })
  graph.edges.push({
    id: 'e-attests-rev-1',
    type: 'attests',
    from: 'receipt-fiat-1',
    to: 'rev-fiat-1',
    ...stamp({}),
  })
  graph.edges.push({
    id: 'e-observes-rev-1',
    type: 'observes',
    from: 'rev-fiat-1',
    to: 'offer-scope-brief',
    ...stamp({}),
  })

  const reportActivated = reviewIncomeGraph(graph, TODAY)
  assert.equal(reportActivated.activation, 'activated')
  assert.ok(!reportActivated.nextDecisions.some((line) => line.includes('Leave the endpoint off until a fiat offer')))
})

test('a revenue observation on a machine-payment offer does not satisfy the fiat offer activation requirement', () => {
  const graph = clone()
  meter(graph)
  // Attest revenue on the machine-payment offer itself
  graph.nodes.push({
    id: 'receipt-meter-1',
    type: 'Receipt',
    label: 'Meter receipt',
    ...stamp({}),
    data: { artifact: 'receipts/meter-1.pdf' },
  })
  graph.nodes.push({
    id: 'rev-meter-1',
    type: 'RevenueObservation',
    label: 'Meter payment',
    ...stamp({}),
    data: { observed: { currency: 'USD', amount: 50, occurredAt: TODAY, units: 25 } },
  })
  graph.edges.push({
    id: 'e-attests-meter-1',
    type: 'attests',
    from: 'receipt-meter-1',
    to: 'rev-meter-1',
    ...stamp({}),
  })
  graph.edges.push({
    id: 'e-observes-meter-1',
    type: 'observes',
    from: 'rev-meter-1',
    to: 'offer-scope-brief',
    ...stamp({}),
  })

  const report = reviewIncomeGraph(graph, TODAY)
  // Even though revenue was observed, no FIAT offer was activated, so the decision line stays
  assert.ok(report.nextDecisions.some((line) => line.includes('Leave the endpoint off until a fiat offer')))
})
