/**
 * Honest economics. The only revenue this module will report is revenue that
 * was observed and attested by a Receipt. Everything else is a cost, a founder
 * hour, or a break-even count — arithmetic, not a forecast.
 */

import type { Finding, IncomeGraph } from './model.ts'

export type Economics = {
  currency: string
  /** Money out, per month, from Cost nodes with a period. */
  monthlyCostFloor: number
  /** One-off money already committed. */
  oneOffCost: number
  /** Founder time per month, in hours. The cost most systems hide from themselves. */
  founderHoursPerMonth: number
  /** Revenue that arrived and has a receipt. Zero is the honest default. */
  observedRevenue: number
  observedUnits: number
  /** Offer prices found in the graph, used for break-even arithmetic only. */
  offerPrices: { offerId: string; amount: number; unit: string }[]
  /**
   * Units per month that would cover monthlyCostFloor at the lowest offer price.
   * Arithmetic on stated numbers — it is not a prediction that they will sell.
   */
  breakEvenUnitsPerMonth: number | null
  /** Implied hourly return on founder time from OBSERVED revenue only. Null until revenue exists. */
  observedRevenuePerFounderHour: number | null
  notes: string[]
}

const MONTHLY: Record<string, number> = { once: 0, monthly: 1, yearly: 1 / 12 }

export function computeEconomics(graph: IncomeGraph): Economics {
  const nodes = Array.isArray(graph?.nodes) ? graph.nodes : []
  const edges = Array.isArray(graph?.edges) ? graph.edges : []
  const notes: string[] = []
  const currencies = new Set<string>()

  let monthlyCostFloor = 0
  let oneOffCost = 0
  let founderMinutes = 0

  for (const node of nodes.filter((n) => n.type === 'Cost')) {
    const amount = node.data?.amount
    if (amount) {
      currencies.add(amount.currency)
      if (amount.period === 'once') oneOffCost += amount.amount
      else monthlyCostFloor += amount.amount * (MONTHLY[amount.period] ?? 0)
    }
    founderMinutes += node.data?.founderMinutesPerMonth ?? 0
  }

  let observedRevenue = 0
  let observedUnits = 0
  for (const node of nodes.filter((n) => n.type === 'RevenueObservation')) {
    const attested = edges.some((e) => e.type === 'attests' && e.to === node.id)
    const observed = node.data?.observed
    if (!observed) continue
    if (!attested) {
      notes.push(`Excluded ${node.id}: no Receipt attests it, so it is not evidence of revenue.`)
      continue
    }
    currencies.add(observed.currency)
    observedRevenue += observed.amount
    observedUnits += observed.units
  }

  const offerPrices = nodes
    .filter((n) => n.type === 'Offer' && n.data?.price)
    .map((n) => {
      currencies.add(n.data!.price!.currency)
      return { offerId: n.id, amount: n.data!.price!.amount, unit: n.data!.price!.unit }
    })

  const cheapest = offerPrices.reduce<number | null>(
    (min, p) => (p.amount > 0 && (min === null || p.amount < min) ? p.amount : min),
    null,
  )

  const founderHoursPerMonth = Math.round((founderMinutes / 60) * 10) / 10
  const breakEvenUnitsPerMonth =
    cheapest && cheapest > 0 ? Math.ceil(monthlyCostFloor / cheapest) : null

  if (currencies.size > 1) {
    notes.push(
      `Mixed currencies (${[...currencies].sort().join(', ')}); totals are added without conversion and are not comparable.`,
    )
  }
  if (observedRevenue === 0) {
    notes.push('No attested revenue yet. This system has costs and a hypothesis, not an income.')
  }
  if (founderHoursPerMonth === 0) {
    notes.push('No founder time is recorded. A system that costs zero founder hours has not been described honestly.')
  }

  return {
    currency: currencies.size === 1 ? [...currencies][0] : 'MIXED',
    monthlyCostFloor: Math.round(monthlyCostFloor * 100) / 100,
    oneOffCost: Math.round(oneOffCost * 100) / 100,
    founderHoursPerMonth,
    observedRevenue: Math.round(observedRevenue * 100) / 100,
    observedUnits,
    offerPrices,
    breakEvenUnitsPerMonth,
    observedRevenuePerFounderHour:
      observedRevenue > 0 && founderHoursPerMonth > 0
        ? Math.round((observedRevenue / founderHoursPerMonth) * 100) / 100
        : null,
    notes,
  }
}

/** E-codes: economics findings that block activation. */
export function checkEconomics(graph: IncomeGraph): Finding[] {
  const out: Finding[] = []
  const economics = computeEconomics(graph)

  if (economics.founderHoursPerMonth === 0) {
    out.push({
      code: 'E01',
      severity: 'error',
      path: '/nodes',
      message: 'no founder time is accounted anywhere in the graph',
      remedy: 'Add founderMinutesPerMonth to at least one Cost node. Unpriced founder time is how these systems fail quietly.',
    })
  }

  if (economics.monthlyCostFloor === 0 && economics.oneOffCost === 0) {
    out.push({
      code: 'E02',
      severity: 'warning',
      path: '/nodes',
      message: 'no money cost is recorded',
      remedy: 'Model tokens, hosting, merchant fees, and tooling. A zero-cost agent system is unusual enough to need saying why.',
    })
  }

  if (economics.currency === 'MIXED') {
    out.push({
      code: 'E03',
      severity: 'warning',
      path: '/nodes',
      message: 'costs and prices mix currencies',
      remedy: 'Pick one accounting currency for the graph, or the break-even number means nothing.',
    })
  }

  return out
}
