import type { OfferBriefInput } from '../offer-brief.ts'

export type Message = { role: 'user' | 'assistant'; content: string }
export interface Prices { currency?: OfferBriefInput['currency']; fee?: number; cost?: number; ambiguous?: boolean }

type Currency = NonNullable<Prices['currency']>
type AmountKind = 'fee' | 'cost'
const currencyWords = '(?:EUR|USD|GBP|euros?|dollars?|pounds?)'
const unsupportedCurrency = /\b(?:CAD|AUD|JPY|CHF|NZD|SGD|HKD|CNY|INR|SEK|yen|francs?|rupees?)\b|[¥₹]/i
const costBefore = /(?:costs?|spend|expenses?|delivery|delivering|fulfil(?:l)?ment|labor|labour|payment fees?|processing fees?)\s*(?:(?:of|is|are|to|at|me|us|becomes?|rises?|was|equals?|changes?|changed|updated|goes?|now|would|be|per|sale|unit|total)\s*)*[:=]?\s*(?:EUR|USD|GBP)?\s*$/i
const feeBefore = /(?:price|fee|charge|charging|sell|selling|collect|revenue|priced|billed|invoice|sell it)\s*(?:(?:of|is|at|for|to|now|would|be|per|unit|sale|changed|updated|changes?|becomes?)\s*)*[:=]?\s*(?:EUR|USD|GBP)?\s*$/i
const costAfter = new RegExp('^\\s*' + currencyWords + '?\\s*(?:to deliver|(?:in |of )?(?:delivery|variable|fulfil(?:l)?ment|processing|payment) costs?|delivery|costs?|labor|labour|expenses?|fees)\\b', 'i')
const feeAfter = new RegExp('^\\s*' + currencyWords + '?\\s*(?:service|pilot|offer|sale|price|fee|product|package|selling price)\\b', 'i')
const countAfter = /^\s*(?:hours?|hrs?|minutes?|clients?|customers?|sales|orders|units|people|seats|quotes|days?|weeks?|months?|years?)\b/i
const rateAfter = new RegExp('^\\s*' + currencyWords + '?\\s*(?:\\/\\s*(?:h|hr|hour|mo|month|year)|per\\s+(?:hour|minute|month|year|week)|an?\\s+(?:hour|month|year|week))\\b', 'i')

function currencies(text: string): Currency[] {
  return [...new Set(Array.from(text.matchAll(/€|\bEUR\b|\beuros?\b|\$|\bUSD\b|\bdollars?\b|£|\bGBP\b|\bpounds?\b/gi), match =>
    /€|eur/i.test(match[0]) ? 'EUR' : /£|gbp|pound/i.test(match[0]) ? 'GBP' : 'USD'))] as Currency[]
}

function amount(raw: string): number | null {
  const text = raw.replace(/[€$£\s]/g, '')
  let normalized: string
  if (/^\d+(?:\.\d{1,2})?$/.test(text)) normalized = text
  else if (/^\d{1,3}(?:,\d{3})+(?:\.\d{1,2})?$/.test(text)) normalized = text.replaceAll(',', '')
  else if (/^(?:\d+|\d{1,3}(?:\.\d{3})+),\d{1,2}$/.test(text)) normalized = text.replaceAll('.', '').replace(',', '.')
  else return null
  const value = Number(normalized)
  return value <= 1_000_000 ? value : null
}

function kind(before: string, after: string): AmountKind | undefined {
  if (costBefore.test(before)) return 'cost'
  if (feeBefore.test(before)) return 'fee'
  if (costAfter.test(after)) return 'cost'
  if (feeAfter.test(after)) return 'fee'
  return undefined
}

function changesOffer(content: string) {
  return /\b(?:different|another|new|switch(?:ing)?|instead|change of)\b.{0,45}\b(?:offer|service|product|business|subscription|newsletter|coaching)\b/i.test(content) ||
    /\b(?:I|we)\s+(?:sell|offer|launch|build)\b/i.test(content)
}

// Only explicit user totals qualify. Multiple components, alternative prices,
// rates and discounts need clarification; selecting the last number loses costs.
export function assumptions(messages: Message[]): Prices {
  let facts: Prices = {}
  for (const { role, content } of messages) {
    if (role !== 'user') continue
    const currentCurrencies = currencies(content)
    if (currentCurrencies.length > 1 || unsupportedCurrency.test(content)) {
      facts = { ambiguous: true }
      continue
    }
    const currency = currentCurrencies[0] ?? facts.currency
    if (changesOffer(content) || (facts.currency && currentCurrencies[0] && currentCurrencies[0] !== facts.currency)) facts = { currency }
    else if (currentCurrencies[0]) facts.currency = currency
    // A bare amount answers the one missing field, only when the user's own
    // earlier totals establish which field is missing and the currency agrees.
    const bare = content.trim().match(/^(?:[€$£]\s*)?[-−+]?\d[\d.,]*(?:\s*(?:EUR|USD|GBP|euros?|dollars?|pounds?))?\s*[.!?]?$/i)
    if (bare && !facts.ambiguous && (facts.fee === undefined) !== (facts.cost === undefined)) {
      const raw = content.match(/(?:[€$£]\s*)?[-−+]?\d[\d.,]*/)?.[0]
      const value = raw ? amount(raw.replace(/[.,]$/, '')) : null
      if (value !== null) {
        if (facts.fee === undefined) facts.fee = value
        else facts.cost = value
        continue
      }
      facts = { currency, ambiguous: true }
      continue
    }
    const amounts: { kind: AmountKind; value: number }[] = []
    let uncertain = false
    let monetary = false
    for (const match of content.matchAll(/(?:[€$£]\s*)?[-−+]?\d[\d.,]*(?:[eE][+-]?\d+|[kKmM])?/g)) {
      const before = content.slice(0, match.index)
      const after = content.slice(match.index + match[0].length)
      // Do not read identifiers such as B2B as amounts.
      if (/\w$/.test(before)) continue
      const explicitMoney = /[€$£]/.test(match[0]) || new RegExp('^\\s*' + currencyWords + '\\b', 'i').test(after)
      if (!explicitMoney && countAfter.test(after)) {
        if (costBefore.test(before) || feeBefore.test(before)) uncertain = true
        continue
      }
      const type = kind(before, after)
      if (!type && !explicitMoney) {
        if (/\b(?:costs?|price|fee|charge|delivery|spend|expenses?|labor|labour)\b/i.test(content)) uncertain = true
        continue
      }
      monetary = true
      const value = amount(match[0].replace(/[.,]$/, ''))
      if (value === null || !type || rateAfter.test(after) || /\b(?:hourly|monthly|annual|weekly)\b.{0,25}$/i.test(before)) {
        uncertain = true
        continue
      }
      amounts.push({ kind: type, value })
    }
    if (monetary && (/\b(?:or|discount|discounted|refund|rebate|rather than|instead of|ignore|disregard|not)\b|%|[-−]\s*[€$£]/i.test(content))) uncertain = true
    if (amounts.filter(item => item.kind === 'fee').length > 1 || amounts.filter(item => item.kind === 'cost').length > 1) uncertain = true
    if (uncertain) {
      facts = { currency, ambiguous: true }
      continue
    }
    if (amounts.length > 0) {
      // A clarifying answer starts a new pair; an earlier ambiguous total is never reused.
      if (facts.ambiguous) facts = { currency }
      for (const item of amounts) facts[item.kind] = item.value
    }
    if (/\b(?:costs?|price|fee)\b.{0,25}\b(?:unknown|unsure|forgot|not sure|don.t know)\b|\b(?:unsure|forgot|don.t know)\b.{0,25}\b(?:costs?|price|fee)\b/i.test(content)) facts = { currency, ambiguous: true }
  }
  return facts
}
