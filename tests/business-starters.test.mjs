import test from 'node:test'
import assert from 'node:assert/strict'
import { businessStarters, starterInput, starterBriefHref, starterFromFragment } from '../lib/business-starters.ts'
import { buildOfferBrief } from '../lib/offer-brief.ts'

test('a homepage edit survives all three handoffs including Unicode and special characters', () => {
  for (let i = 0; i < businessStarters.length; i++) {
    const input = starterInput(i, 'Designers in Köln & Amsterdam', 'A guide with # headings, 20% examples and 中文 notes.')
    const fragment = new URL(starterBriefHref(input), 'https://example.test').hash
    const parsed = starterFromFragment(fragment)
    assert.deepEqual(parsed, input)
    assert.deepEqual(buildOfferBrief(parsed), buildOfferBrief(input))
  }
})
test('untrusted fragment input does not prefill an invalid offer', () => {
  const good = starterInput(0, 'A buyer', 'A scoped service')
  for (const input of [null, [], {}, { ...good, unitPrice: -1 }, { ...good, offer: '' }, { ...good, sourceDate: '2026-02-31' }, { ...good, sourceUrl: 'javascript:alert(1)' }]) {
    assert.equal(starterFromFragment('#business=' + encodeURIComponent(JSON.stringify(input))), null)
  }
  for (const fragment of ['#business=%', '#business={', '#business=' + 'x'.repeat(16000), '#other=abc']) {
    assert.equal(starterFromFragment(fragment), null)
  }
})
