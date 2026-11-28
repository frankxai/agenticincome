import test from 'node:test'
import assert from 'node:assert/strict'
import { buildOfferBrief, offerBriefInputFromArtifact } from '../lib/offer-brief.ts'
import { pilot, quoteReviewBrief } from '../lib/quote-review-case.ts'
import { feeControl, hoursControl, pilotBriefHref, pilotDecision, pilotDecisionInput, pilotInputFromFragment } from '../lib/pilot-decision.ts'

test('the live desk opens on the published quote-review economics', () => {
  const model = pilotDecision(pilot.price, pilot.reviewHours)
  const canonical = quoteReviewBrief().economics
  assert.equal(model.unitCost, canonical.unitCost)
  assert.equal(model.contribution, 500)
  assert.equal(model.stressContribution, 200)
  assert.equal(model.buyerPaybackMonths, 4)
  assert.equal(model.fixedCostPilots, 3)
  assert.equal(model.verdict, 'Test with a buyer')
})

test('rework can consume positive contribution, or put the seller underwater', () => {
  const tight = pilotDecision(1500, 14)
  assert.equal(tight.contribution, 200)
  assert.equal(tight.stressContribution, -100)
  assert.equal(tight.fixedCostPilots, 8)
  assert.equal(tight.buyerPaybackMonths, 4)
  assert.equal(tight.verdict, 'Tighten the scope')
  const zero = pilotDecision(1000, 10)
  assert.equal(zero.contribution, 0)
  assert.equal(zero.fixedCostPilots, null)
  assert.equal(zero.verdict, 'Revise the price')
  assert.equal(pilotDecision(500, 10).contribution, -500)
  const higherFee = pilotDecision(2000, 10)
  assert.equal(higherFee.contribution, 1000)
  assert.equal(higherFee.fixedCostPilots, 2)
  assert.equal(higherFee.buyerPaybackMonths, 2000 / 375)
})

test('every fee and review-time pair carries identical assumptions into the editor and JSON export', () => {
  for (let price = feeControl.min; price <= feeControl.max; price += feeControl.step) {
    for (let hours = hoursControl.min; hours <= hoursControl.max; hours += hoursControl.step) {
      const href = new URL(pilotBriefHref(price, hours), 'https://example.org')
      assert.equal(href.pathname, '/workbench/offer-brief')
      const editor = pilotInputFromFragment(href.hash)
      const artifact = buildOfferBrief(pilotDecisionInput(price, hours), pilot.date)
      assert.deepEqual(editor, offerBriefInputFromArtifact(JSON.parse(JSON.stringify(artifact))))
      assert.equal(artifact.economics.unitPrice, price)
      assert.equal(artifact.economics.unitCost, 250 + hours * 75)
      assert.ok(artifact.hypothesis.offer.includes(hours + ' human review hours'))
      assert.equal(artifact.validation.status, 'planned')
    }
  }
})

test('the fragment accepts the bounded quote-review controls only', () => {
  for (const fragment of ['#studio-review/200/40', '#quote-review/495/10', '#quote-review/501/10',
    '#quote-review/3550/10', '#quote-review/1500/0.1', '#quote-review/1500/31', '#quote-review/1500/NaN',
    '#quote-review/1500/10/extra', '#quote-review/<script>/10']) {
    assert.equal(pilotInputFromFragment(fragment), null)
  }
})
