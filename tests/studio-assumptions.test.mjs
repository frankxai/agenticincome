import test from 'node:test'
import assert from 'node:assert/strict'
import { assumptions } from '../lib/studio/assumptions.ts'

const user = content => ({ role: 'user', content })
const parse = (...turns) => assumptions(turns.map(user))
const baseline = 'I charge €1,500 and delivery costs €900.'

test('explicit per-sale totals and single follow-up corrections preserve their pair', () => {
  assert.deepEqual(parse(baseline), { currency: 'EUR', fee: 1500, cost: 900 })
  assert.deepEqual(parse('What do I keep on a €1,500 service that costs €900 to deliver?'), { currency: 'EUR', fee: 1500, cost: 900 })
  for (const update of ['What if delivery costs 1100?', 'Cost updated to €1100', 'cost changed to 1100']) {
    assert.deepEqual(parse(baseline, update), { currency: 'EUR', fee: 1500, cost: 1100 })
  }
  assert.deepEqual(parse(baseline, 'Price changed to 1700'), { currency: 'EUR', fee: 1700, cost: 900 })
  assert.deepEqual(parse('A €1500 fee and €900 cost.'), { currency: 'EUR', fee: 1500, cost: 900 })
  assert.deepEqual(parse('Price 1500 and cost 900', 'EUR'), { currency: 'EUR', fee: 1500, cost: 900 })
  assert.deepEqual(parse('Price £150 and cost £0'), { currency: 'GBP', fee: 150, cost: 0 })
})

test('EU decimals and complete grouping are parsed deliberately', () => {
  assert.deepEqual(parse('Price 1.500,00 EUR and delivery costs 900,50 EUR'), { currency: 'EUR', fee: 1500, cost: 900.5 })
  assert.deepEqual(parse('Price $1,500.50 and cost $900.25'), { currency: 'USD', fee: 1500.5, cost: 900.25 })
  for (const fee of ['€1.500', '€1,50,0', '€1.5k', '€1e3', '-€1500', '€-1500', '€1000001']) {
    assert.equal(parse('Price ' + fee + ' and cost €900').ambiguous, true, fee)
  }
})

test('component costs, alternative offers and rebates require a fresh total', () => {
  for (const message of [
    'I charge €1500; costs €300 labor and €150 fees.',
    'Price €1500, cost €300, plus €150 payment fees.',
    'Price €1500 or €1800 and cost €900.',
    'Price €1500 with a 10% discount and cost €900.',
    'Price €1500, cost €900, refund €150.',
    'Price was €1500, now €1200; cost €900.',
    'Ignore the cost €900.',
    'Price 1500, cost 300 plus 150.',
    'My cost increased to 1100.',
  ]) assert.equal(parse(baseline, message).ambiguous, true, message)
  assert.deepEqual(parse(baseline, 'Price €1500, cost €300 labor and €150 fees', 'Price €1500 and total cost €450'), { currency: 'EUR', fee: 1500, cost: 450 })
})

test('hourly rates and subscription bases never become per-sale totals', () => {
  for (const message of [
    'Price €1500; 10 hours at €75/hour.',
    'Price €1500; cost €75 per hour.',
    'Price €1500 per month and cost €900.',
    'Price €1500; hourly cost €75.',
    'What if it costs 10 hours?',
  ]) assert.equal(parse(message).ambiguous, true, message)
  assert.deepEqual(parse(baseline + ' It takes 10 hours for 2 clients.'), { currency: 'EUR', fee: 1500, cost: 900 })
})

test('changed offers and currencies cannot reuse a previous product cost', () => {
  assert.deepEqual(parse(baseline, 'A different product has a price of €200.'), { currency: 'EUR', fee: 200 })
  assert.deepEqual(parse(baseline, 'I sell a €200 product.'), { currency: 'EUR', fee: 200 })
  assert.deepEqual(parse(baseline, 'Price $500'), { currency: 'USD', fee: 500 })
  assert.equal(parse('Price €1500 and costs $900').ambiguous, true)
  assert.equal(parse('Price CHF 1500 and cost CHF 900').ambiguous, true)
})

test('assistant estimates never fill missing user inputs; unclear context cannot retain stale totals', () => {
  assert.deepEqual(assumptions([user('Price €1500'), { role: 'assistant', content: 'Assume costs €900' }]), { currency: 'EUR', fee: 1500 })
  assert.equal(parse(baseline, 'My cost is unknown').ambiguous, true)
  assert.deepEqual(parse('Price €1500, cost €300 plus €150 fees', 'Cost is €450'), { currency: 'EUR', cost: 450 })
})


test('a bare reply fills exactly one missing user-supplied field', () => {
  assert.deepEqual(parse('What do I keep on a €1,500 service?', '€900'), { currency: 'EUR', fee: 1500, cost: 900 })
  assert.deepEqual(parse('Delivery costs €900', '1500'), { currency: 'EUR', fee: 1500, cost: 900 })
  assert.deepEqual(parse('Price €1500', '900,50 EUR'), { currency: 'EUR', fee: 1500, cost: 900.5 })
  assert.equal(parse(baseline, '€800').ambiguous, true)
  assert.equal(parse('Price €1500', '$900').ambiguous, true)
  assert.equal(parse('Price €1500', '-900').ambiguous, true)
})
