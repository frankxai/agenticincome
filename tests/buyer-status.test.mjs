import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { buyerStatus, isFreeOnSite } from '../lib/buyer-status.ts'

const catalog = JSON.parse(readFileSync(new URL('../products/catalog.json', import.meta.url), 'utf8'))
const products = catalog.products ?? catalog

test('every catalog status maps to a buyer label without pipeline wording', () => {
  for (const product of products) {
    const label = buyerStatus(product.status, product.price_cents)
    assert.ok(['Free, delivered on this site', 'For sale, by private delivery', 'Not on sale yet'].includes(label), `${product.id}: ${label}`)
    assert.doesNotMatch(label, /gated|pending|payload|zip|polar|frankxai/i)
  }
})

test('only a "for sale" status reads as for sale', () => {
  assert.equal(buyerStatus('for sale — private delivery via Polar', 6700), 'For sale, by private delivery')
  assert.equal(buyerStatus('built — checkout gated pending Polar product and file upload', 12900), 'Not on sale yet')
  assert.equal(buyerStatus('payload not assembled — not for sale', 12900), 'Not on sale yet')
})

test('unknown or misspelled statuses fail to the safe label', () => {
  assert.equal(buyerStatus('', 4900), 'Not on sale yet')
  assert.equal(buyerStatus('forsale', 4900), 'Not on sale yet')
  assert.equal(buyerStatus('available soon', 4900), 'Not on sale yet')
})

test('free products read as free', () => {
  assert.equal(buyerStatus('free — delivered on-site, never sold through checkout', 0), 'Free, delivered on this site')
})

test('a zero price alone does not make something free, and a free-sounding status does not make a paid product free', () => {
  assert.equal(buyerStatus('payload not assembled - not for sale', 0), 'Not on sale yet')
  assert.equal(buyerStatus('', 0), 'Not on sale yet')
  assert.equal(buyerStatus('free trial pending approval', 4900), 'Not on sale yet')
  assert.equal(buyerStatus('for sale — private delivery via Polar', 0), 'Not on sale yet')
})

test('the homepage renders the label, not the raw status', () => {
  const page = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8')
  assert.match(page, /buyerStatus\(product\.status, product\.price_cents\)/)
  assert.doesNotMatch(page, /\{product\.status\}/)
  assert.doesNotMatch(page, /title=\{product\.status\}/)
})

test('the starter-kit link appears only for a product that is free on this site', () => {
  const page = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8')
  assert.match(page, /isFreeOnSite\(product\.status, product\.price_cents\) \? \(\s*<Link href="\/delivery\/starter-kit"/)
  assert.equal(isFreeOnSite('payload not assembled - not for sale', 0), false)
  assert.equal(isFreeOnSite('free — delivered on-site, never sold through checkout', 0), true)
})
