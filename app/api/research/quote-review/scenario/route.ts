import { buildOfferBrief } from '../../../../../lib/offer-brief.ts'
import { feeControl, hoursControl, parsePilotControl, pilotDecision, pilotDecisionInput } from '../../../../../lib/pilot-decision.ts'
import { monthlyBuyerValue, pilot } from '../../../../../lib/quote-review-case.ts'
import { site } from '../../../../../lib/site.ts'

const controls = {
  fee: { unit: 'EUR per pilot', default: pilot.price, ...feeControl },
  hours: { unit: 'review hours per pilot', default: pilot.reviewHours, ...hoursControl },
}

function invalid(message: string) {
  return Response.json({ error: message, controls }, {
    status: 400, headers: { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' },
  })
}

export function GET(request: Request) {
  const query = new URL(request.url).searchParams
  for (const key of query.keys()) {
    if (key !== 'fee' && key !== 'hours') return invalid('Supported query parameters are fee and hours.')
    if (query.getAll(key).length !== 1) return invalid('Use each query parameter once.')
  }
  const fee = parsePilotControl(query.get('fee') ?? String(pilot.price), feeControl)
  const hours = parsePilotControl(query.get('hours') ?? String(pilot.reviewHours), hoursControl)
  if (fee === null) return invalid('Use a fee in the supported range and increment.')
  if (hours === null) return invalid('Use review hours in the supported range and increment.')

  const model = pilotDecision(fee, hours)
  const brief = buildOfferBrief(pilotDecisionInput(fee, hours), pilot.date)
  return Response.json({
    version: 'QuoteReviewScenario.v1',
    source: { url: site.url + '/blog/' + pilot.slug, date: pilot.date, status: 'illustrative' },
    evidence: { demand: 'untested', reviewEffort: 'assumed', buyerCapacityRecovery: 'assumed', cashSavings: 'unverified' },
    currency: 'EUR', taxBasis: 'excluding tax',
    controls,
    seller: {
      perPilot: {
        fee, reviewHours: hours, hourlyReviewCost: pilot.hourlyCost, humanReviewCost: hours * pilot.hourlyCost,
        compute: pilot.compute, collection: pilot.collection, acquisition: pilot.acquisition, support: pilot.support,
        totalVariableCost: model.unitCost, contributionBeforeFixedCosts: model.contribution, marginPercent: model.marginPercent,
      },
      monthlyFixedCost: pilot.monthlyFixed,
      monthlyBreakEvenPilots: model.fixedCostPilots,
      stress: { extraReviewHours: pilot.reworkHours, contributionBeforeFixedCosts: model.stressContribution },
      decision: model.verdict,
    },
    buyer: {
      monthlyRedeployableHours: pilot.monthlyHoursRecovered, hourlyCapacityValue: pilot.buyerHourlyValue,
      monthlyRunningCost: pilot.buyerMonthlyCost, netMonthlyCapacityValue: monthlyBuyerValue,
      simplePaybackMonths: model.buyerPaybackMonths,
    },
    brief,
  }, { headers: { 'Cache-Control': 'public, max-age=300, s-maxage=3600', 'Access-Control-Allow-Origin': '*' } })
}
