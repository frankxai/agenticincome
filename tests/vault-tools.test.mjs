import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { searchEconomies, supplyCosts, unitMargin } from '../lib/vault.ts'

const read = (f) => JSON.parse(readFileSync(new URL(`../vault/${f}`, import.meta.url), 'utf8'))
const vault = { economies: read('economies.json'), supply: read('supply-chain.json'), verification: read('verification.json') }

test('every economy row carries its verification verdict', () => {
  const rows = searchEconomies(vault)
  assert.equal(rows.length, vault.economies.rows.length)
  assert.ok(rows.every((r) => typeof r.verification.confirmed === 'boolean'))
})

test('confirmedOnly drops rows a fetch or reviewer has not confirmed', () => {
  const all = searchEconomies(vault)
  const confirmed = searchEconomies(vault, { confirmedOnly: true })
  assert.ok(confirmed.length < all.length)
  assert.ok(confirmed.every((r) => r.verification.confirmed))
})

test('the BYOK pack margin matches the committed scenario', () => {
  const r = unitMargin(vault, { priceUsd: 29, costLines: [], feeSupplyIds: ['polar-starter-fee'] })
  assert.equal(r.ok, true)
  assert.equal(Number(r.grossMarginPct.toFixed(1)), 93.3)
  assert.ok(r.lines.every((l) => l.sourceUrl.startsWith('https://')))
})

test('a fee row cannot be used as a unit cost, and unknown ids are refused', () => {
  const r = unitMargin(vault, { priceUsd: 10, costLines: [{ supplyId: 'polar-starter-fee', quantity: 1 }, { supplyId: 'nope', quantity: 1 }] })
  assert.equal(r.ok, false)
  assert.equal(r.refused.length, 2)
})

test('an input whose source is not confirmed is refused', () => {
  const unconfirmed = vault.verification.results.find((x) => x.file === 'supply-chain' && !['number-found', 'reviewer-confirmed', 'live-counter'].includes(x.verdict))
  const row = vault.supply.rows.find((s) => s.id === unconfirmed.id)
  const input = row.priceKind === 'rate'
    ? { priceUsd: 10, costLines: [], feeSupplyIds: [row.id] }
    : { priceUsd: 10, costLines: [{ supplyId: row.id, quantity: 1 }] }
  const r = unitMargin(vault, input)
  assert.equal(r.ok, false)
})

test('supply filter by category returns only that category', () => {
  assert.ok(supplyCosts(vault, { category: 'payments' }).every((r) => r.category === 'payments'))
})
