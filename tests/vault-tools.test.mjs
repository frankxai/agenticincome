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
  const unconfirmed = vault.verification.results.find((x) => x.file === 'supply-chain' && !['number-found', 'reviewer-confirmed'].includes(x.verdict)
    && vault.supply.rows.some((s) => s.id === x.id && (s.priceKind === 'unit' ? typeof s.price === 'number' : typeof s.rate === 'number' || typeof s.fixedUsd === 'number')))
  const row = vault.supply.rows.find((s) => s.id === unconfirmed.id)
  const input = row.priceKind === 'rate'
    ? { priceUsd: 10, costLines: [], feeSupplyIds: [row.id] }
    : { priceUsd: 10, costLines: [{ supplyId: row.id, quantity: 1 }] }
  const r = unitMargin(vault, input)
  assert.equal(r.ok, false)
})

test('a fee row without machine-readable terms is refused, not treated as free (Codex finding)', () => {
  const r = unitMargin(vault, { priceUsd: 100, costLines: [], feeSupplyIds: ['stripe-eea-card'] })
  assert.equal(r.ok, false)
})

test('an affiliate commission row is refused as a selling fee', () => {
  const r = unitMargin(vault, { priceUsd: 100, costLines: [], feeSupplyIds: ['elevenlabs-affiliate'] })
  assert.equal(r.ok, false)
})

test('negative, zero and non-finite quantities are refused (Codex finding)', () => {
  for (const quantity of [-1, 0, Number.NaN, Number.POSITIVE_INFINITY]) {
    const r = unitMargin(vault, { priceUsd: 100, costLines: [{ supplyId: 'anthropic-sonnet-5-5-output', quantity }] })
    assert.equal(r.ok, false, `quantity ${quantity}`)
  }
})

test('supply filter by category returns only that category', () => {
  assert.ok(supplyCosts(vault, { category: 'payments' }).every((r) => r.category === 'payments'))
})

test('a verified sales volume cannot authorize a marketplace fee', () => {
  const id = 'apple-app-store-digital-2025'
  assert.ok(searchEconomies(vault, { confirmedOnly: true }).some((row) => row.id === id))
  const result = unitMargin(vault, { priceUsd: 10, costLines: [], takeRateFrom: id })
  assert.equal(result.ok, false)
  assert.match(result.refused.join(), /transaction fee terms/)
})

test('marketplace fee includes the reviewed fixed charge and identifies the scenario', () => {
  const direct = unitMargin(vault, { priceUsd: 10, costLines: [], takeRateFrom: 'gumroad-fee' })
  assert.equal(direct.costUsd, 1.5)
  assert.match(direct.lines[0].label, /Direct or profile sale/)
  const discover = unitMargin(vault, { priceUsd: 10, costLines: [], takeRateFrom: 'gumroad-discover-fee' })
  assert.equal(discover.costUsd, 3)
})

test('duplicate fees, overlapping merchant schedules and overflow cannot masquerade as margins', () => {
  for (const fields of [
    { feeSupplyIds: ['polar-starter-fee', 'polar-starter-fee'] },
    { feeSupplyIds: ['gumroad-direct-fee'], takeRateFrom: 'gumroad-fee' },
    { priceUsd: Number.MIN_VALUE, feeSupplyIds: ['polar-starter-fee'] },
  ]) {
    assert.equal(unitMargin(vault, { priceUsd: 10, costLines: [], ...fields }).ok, false)
  }
})
