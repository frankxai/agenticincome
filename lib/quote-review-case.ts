import { buildOfferBrief, offerBriefMarkdown, type OfferBriefInput } from './offer-brief.ts'
import { site } from './site.ts'

export const pilot = {
  title: 'Can a €1,500 quote-review pilot pay for itself?',
  slug: 'quote-review-pilot',
  description: 'A worked case for a sales lead and finance partner. Inspect delivery margin, buyer payback and the evidence needed before funding a pilot.',
  date: '2026-11-27',
  price: 1500,
  reviewHours: 10,
  hourlyCost: 75,
  compute: 40,
  collection: 45,
  acquisition: 90,
  support: 75,
  monthlyFixed: 1500,
  reworkHours: 4,
  monthlyHoursRecovered: 6,
  buyerHourlyValue: 75,
  buyerMonthlyCost: 75,
}

export const deliveryCost = pilot.reviewHours * pilot.hourlyCost + pilot.compute + pilot.collection + pilot.acquisition + pilot.support
export const contribution = pilot.price - deliveryCost
export const downside = contribution - pilot.reworkHours * pilot.hourlyCost
export const monthlyBuyerValue = pilot.monthlyHoursRecovered * pilot.buyerHourlyValue - pilot.buyerMonthlyCost

export function quoteReviewInput(): OfferBriefInput {
  return {
    sourceTitle: 'Illustrative quote-review pilot assumptions',
    sourceUrl: site.url + '/blog/' + pilot.slug, sourceDate: pilot.date,
    excerpt: 'Modeled scenario. A sales operations lead wants an assistant to flag discrepancies between a draft quote and an approved rate card. Demand, effort and acceptance have not been observed.',
    buyer: 'The sales operations lead who owns the quote queue and can release representative historical examples.',
    offer: 'Compare ten redacted historical quotes with one approved rate card. Deliver an exception report, traceable references, and a measured review-time comparison. A named reviewer accepts the findings.',
    currency: 'EUR', unitPrice: pilot.price, unitCost: deliveryCost,
    experiment: 'Ask one design partner to supply ten representative quotes, mark the expected discrepancies, time a manual review and name the budget owner before agreeing a pilot.',
    successCriterion: 'Surface every buyer-designated critical discrepancy in the agreed sample with a rate-card reference. Record false positives and reviewer time. Agree the spending decision separately.',
  }
}

export function quoteReviewBrief() {
  return buildOfferBrief(quoteReviewInput(), pilot.date)
}

export function quoteReviewMarkdown() {
  return [
    '# ' + pilot.title,
    'Illustrative model • ' + pilot.date,
    'One scoped service for sales operations. All prices and costs below are assumptions in EUR, excluding tax.',
    '| Per accepted pilot | EUR |', '| --- | ---: |',
    ...[
      ['Price', pilot.price], ['Human review', pilot.reviewHours * pilot.hourlyCost],
      ['Compute and retries', pilot.compute], ['Payment fees', pilot.collection],
      ['Acquisition', pilot.acquisition], ['Support reserve', pilot.support],
      ['Contribution before fixed costs', contribution],
    ].map(([name, amount]) => '| ' + name + ' | ' + amount + ' |'),
    '',
    'Four extra review hours reduce contribution to EUR ' + downside + '. Covering EUR ' + pilot.monthlyFixed +
      ' of monthly fixed costs takes ' + Math.ceil(pilot.monthlyFixed / contribution) + ' base-case pilots or ' +
      Math.ceil(pilot.monthlyFixed / downside) + ' downside pilots.',
    '',
    'Buyer case: six redeployable hours per month at EUR 75/hour, less EUR 75 ongoing costs, is EUR ' +
      monthlyBuyerValue + '/month of potential capacity value. Simple payback is ' +
      pilot.price / monthlyBuyerValue + ' months only when the buyer can use those hours. Record actual cash savings separately.',
    '', offerBriefMarkdown(quoteReviewBrief()),
  ].join('\n')
}
