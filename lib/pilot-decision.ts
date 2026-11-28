import { offerUnitEconomics, type OfferBriefInput } from './offer-brief.ts'
import { monthlyBuyerValue, pilot, quoteReviewInput } from './quote-review-case.ts'
import { breakEvenUnits } from './revenue-scenario.ts'

export const feeControl = { min: 500, max: 3500, step: 50 }
export const hoursControl = { min: 0, max: 30, step: 0.5 }
const nonLabourCost = pilot.compute + pilot.collection + pilot.acquisition + pilot.support

/** A negotiating assumption for this case, expressed in EUR before tax. */
export function pilotPricingWindow(hours: number) {
  const targetDownsideMarginPercent = 20
  const buyerPaybackLimitMonths = 4
  const stressCost = (hours + pilot.reworkHours) * pilot.hourlyCost + nonLabourCost
  const allowableCostFraction = 1 - targetDownsideMarginPercent / 100
  const buyerFeeCeiling = monthlyBuyerValue * buyerPaybackLimitMonths
  // Round the seller's minimum up to a billable cent so rounding never underprices the target.
  const sellerFeeFloor = Math.ceil(stressCost * 100 / allowableCostFraction) / 100
  const feeGap = Math.max(0, sellerFeeFloor - buyerFeeCeiling)
  const requiredCostReduction = Math.max(0, stressCost - buyerFeeCeiling * allowableCostFraction)
  return {
    targetDownsideMarginPercent, buyerPaybackLimitMonths, stressCost, sellerFeeFloor, buyerFeeCeiling,
    feeGap, requiredCostReduction,
    requiredExtraMonthlyBuyerValue: Math.ceil(feeGap * 100 / buyerPaybackLimitMonths) / 100,
    requiredReviewMinutesSaved: Math.ceil(requiredCostReduction * 60 / pilot.hourlyCost),
  }
}

export function pilotDecision(price: number, hours: number) {
  const variableCost = hours * pilot.hourlyCost + nonLabourCost
  const economics = offerUnitEconomics('EUR', price, variableCost)
  const stressContribution = economics.contribution - pilot.reworkHours * pilot.hourlyCost
  return {
    ...economics, hours, stressContribution, pricingWindow: pilotPricingWindow(hours),
    fixedCostPilots: breakEvenUnits(pilot.monthlyFixed, economics.contribution),
    buyerPaybackMonths: price / monthlyBuyerValue,
    verdict: economics.contribution <= 0 ? 'Revise the price' :
      stressContribution <= 0 ? 'Tighten the scope' : 'Test with a buyer',
  } as const
}

export function pilotDecisionInput(price: number, hours: number): OfferBriefInput {
  const baseline = quoteReviewInput()
  const model = pilotDecision(price, hours)
  return {
    ...baseline, unitPrice: price, unitCost: model.unitCost,
    offer: baseline.offer + ' Delivery assumption: ' + hours + ' human review hours at EUR ' +
      pilot.hourlyCost + '/hour and EUR ' + nonLabourCost +
      ' in other variable costs. A further ' + pilot.reworkHours + ' hours of review would leave EUR ' +
      model.stressContribution + ' contribution before fixed costs. At a ' + model.pricingWindow.targetDownsideMarginPercent +
      '% downside margin, the minimum fee is EUR ' + model.pricingWindow.sellerFeeFloor + '. A ' +
      model.pricingWindow.buyerPaybackLimitMonths + '-month buyer payback caps the fee at EUR ' + model.pricingWindow.buyerFeeCeiling + '.',
  }
}

export function pilotBriefHref(price: number, hours: number) {
  return '/workbench/offer-brief#quote-review/' + price + '/' + hours
}

export function pilotScenarioHref(price: number, hours: number) {
  return '/api/research/quote-review/scenario?fee=' + price + '&hours=' + hours
}

/** Fee and hours use the same decimal grammar and allowed increments on every surface. */
export function parsePilotControl(raw: string, control: typeof feeControl): number | null {
  if (!/^\d{1,4}(?:\.\d{1,2})?$/.test(raw)) return null
  const value = Number(raw)
  return value >= control.min && value <= control.max && Number.isInteger((value - control.min) / control.step)
    ? value : null
}

export function pilotInputFromFragment(fragment: string): OfferBriefInput | null {
  const match = /^#quote-review\/([^/]+)\/([^/]+)$/.exec(fragment)
  if (!match) return null
  const price = parsePilotControl(match[1], feeControl)
  const hours = parsePilotControl(match[2], hoursControl)
  return price === null || hours === null ? null : pilotDecisionInput(price, hours)
}
