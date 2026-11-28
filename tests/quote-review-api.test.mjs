import assert from 'node:assert/strict'
import test from 'node:test'
import { GET } from '../app/api/research/quote-review/scenario/route.ts'
import { buildOfferBrief } from '../lib/offer-brief.ts'
import { pilotBriefHref, pilotInputFromFragment, pilotScenarioHref, pilotDecision } from '../lib/pilot-decision.ts'
import { pilot } from '../lib/quote-review-case.ts'

const origin = 'https://example.test'
const path = '/api/research/quote-review/scenario'
const get = (relative) => GET(new Request(new URL(relative, origin)))

test('the API defaults are deterministic and share the worked case', async () => {
  const response = get(path)
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), '*')
  assert.match(response.headers.get('Content-Type'), /application\/json/)
  assert.match(response.headers.get('Cache-Control'), /public/)
  const result = await response.json()
  assert.deepEqual(result, await get(pilotScenarioHref(pilot.price, pilot.reviewHours)).json())
  assert.equal(result.source.status, 'illustrative')
  assert.equal(result.source.url, result.brief.source.url)
  assert.equal(result.evidence.demand, 'untested')
  assert.equal(result.seller.perPilot.contributionBeforeFixedCosts, 500)
  assert.equal(result.buyer.netMonthlyCapacityValue, 375)
  assert.equal(result.buyer.simplePaybackMonths, 4)
  assert.equal((await get(path + '?hours=14').json()).seller.perPilot.fee, pilot.price)
  assert.equal((await get(path + '?fee=1000').json()).seller.perPilot.reviewHours, pilot.reviewHours)
})

test('selected scenarios expose the displayed economics and exact portable editor input', async () => {
  for (const [fee, hours] of [[1500, 14], [1000, 10], [500, 0], [3500, 30], [550, 29.5], [2500, 0.5]]) {
    const response = get(pilotScenarioHref(fee, hours))
    assert.equal(response.status, 200)
    const { seller, buyer, brief } = await response.json()
    const model = pilotDecision(fee, hours)
    const fragment = new URL(pilotBriefHref(fee, hours), origin).hash
    assert.deepEqual(brief, buildOfferBrief(pilotInputFromFragment(fragment), pilot.date))
    assert.equal(seller.perPilot.totalVariableCost, model.unitCost)
    assert.equal(seller.perPilot.contributionBeforeFixedCosts, model.contribution)
    assert.equal(seller.perPilot.marginPercent, model.marginPercent)
    assert.equal(seller.monthlyBreakEvenPilots, model.fixedCostPilots)
    assert.equal(seller.stress.contributionBeforeFixedCosts, model.stressContribution)
    assert.equal(seller.decision, model.verdict)
    assert.equal(buyer.simplePaybackMonths, model.buyerPaybackMonths)
  }
  assert.deepEqual(await get(path + '?fee=1500.00&hours=9.50').json(), await get(pilotScenarioHref(1500, 9.5)).json())
})

test('unknown, repeated, malformed, out-of-bounds and off-step parameters return a descriptive 400', async () => {
  for (const query of ['cost=10', 'fee=', 'hours=', 'fee=1500&fee=1500', 'hours=10&hours=14', 'hours=10&extra=1',
    'fee=499', 'fee=500.5', 'fee=3550', 'fee=1e3', 'fee=+1500', 'fee=%00', 'hours=NaN', 'hours=-1',
    'hours=30.5', 'hours=10.25', 'hours=10h', 'hours=0x10', 'hours=%2010']) {
    const response = get(path + '?' + query)
    assert.equal(response.status, 400, query)
    assert.equal(response.headers.get('Cache-Control'), 'no-store')
    const error = await response.json()
    assert.ok(error.error, query)
    assert.equal(error.controls.fee.min, 500)
    assert.equal(error.controls.hours.step, 0.5)
    assert.equal(error.brief, undefined)
  }
})
