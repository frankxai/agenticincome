import { OFFER_UNIT_LIMIT, type OfferBriefInput } from './offer-brief.ts'

export const studioExample: OfferBriefInput = {
  sourceTitle: 'Studio handover interview (fictional example)',
  sourceDate: '2026-10-09',
  excerpt: 'We hand over the website on Friday. On Monday the client is still asking us for the redirect list, analytics access and the final content files.',
  buyer: 'Independent web studios handing finished websites to client marketing teams',
  offer: 'Website handover review',
  currency: 'EUR', unitPrice: 180, unitCost: 60,
  experiment: 'Show one sample handover report to three studio owners after their next launch. Ask each to book a paid review for an upcoming project.',
  successCriterion: 'Within seven days, at least one of the three owners books a paid review at the proposed price.',
}

export function scenarioAmount(input: string): number | null {
  if (!/^\d+(?:\.\d{1,2})?$/.test(input) || input.length > 12) return null
  const value = Number(input)
  return value <= OFFER_UNIT_LIMIT ? value : null
}

/** The URL fragment is excluded from HTTP requests. Only a bounded numeric pair enters the editor. */
export function scenarioFromFragment(fragment: string): OfferBriefInput | null {
  const match = /^#studio-review\/([^/]+)\/([^/]+)$/.exec(fragment)
  if (!match) return null
  const unitPrice = scenarioAmount(match[1])
  const unitCost = scenarioAmount(match[2])
  if (unitPrice === null || unitCost === null) return null
  return { ...studioExample, unitPrice, unitCost }
}

export function breakEvenUnits(fixedCosts: number, contribution: number): number | null {
  if (fixedCosts === 0) return 0
  if (contribution <= 0) return null
  return Math.ceil(Math.round(fixedCosts * 100) / Math.round(contribution * 100))
}
