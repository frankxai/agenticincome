import assert from 'node:assert/strict'
import test from 'node:test'
import { buildOfferBrief } from '../lib/offer-brief.ts'
import { breakEvenUnits, scenarioAmount, scenarioFromFragment } from '../lib/revenue-scenario.ts'

test('a desk scenario opens a valid offer brief with the same rounded contribution', () => {
  const brief = buildOfferBrief(scenarioFromFragment('#studio-review/37.10/9.11'))
  assert.equal(brief.economics.contribution, 27.99)
  assert.equal(brief.economics.marginPercent, 75.4)
  assert.equal(breakEvenUnits(55.98, brief.economics.contribution), 2)
  assert.equal(breakEvenUnits(55.99, brief.economics.contribution), 3)
})

test('unprofitable and zero-overhead scenarios have explicit break-even states', () => {
  assert.equal(breakEvenUnits(360, 0), null)
  assert.equal(breakEvenUnits(360, -1), null)
  assert.equal(breakEvenUnits(0, 0), 0)
  assert.equal(breakEvenUnits(0, -1), 0)
})

test('only bounded cent amounts transfer from the homepage to the editor', () => {
  for (const input of ['', '1e3', 'NaN', '-1', '1.234', '1000000.01', 'Infinity', '9/3']) {
    assert.equal(scenarioAmount(input), null)
    assert.equal(scenarioFromFragment('#studio-review/180/' + input), null)
  }
  assert.equal(scenarioAmount('1000000.00'), 1_000_000)
  assert.equal(scenarioFromFragment('#other/180/60'), null)
})
