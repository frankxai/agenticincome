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
