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

export type CreditLadderTier = {
  monthlyPriceUsd: number
  effectiveCreditsUsd: number
  bonusCreditsUsd: number
  bonusPercent: number
  effectiveCostPerCreditUsd: number
}

/**
 * The 9-tier progressive credit commitment schedule observed in production
 * cloud agent workbenches (e.g. Hyperagent $20–$10,000 monthly commitment ladder).
 * Models compute purchasing power only — never a revenue projection.
 */
export const CREDIT_BONUS_LADDER: readonly CreditLadderTier[] = [
  { monthlyPriceUsd: 20, effectiveCreditsUsd: 20, bonusCreditsUsd: 0, bonusPercent: 0, effectiveCostPerCreditUsd: 1 },
  { monthlyPriceUsd: 50, effectiveCreditsUsd: 55, bonusCreditsUsd: 5, bonusPercent: 10, effectiveCostPerCreditUsd: 0.9091 },
  { monthlyPriceUsd: 100, effectiveCreditsUsd: 115, bonusCreditsUsd: 15, bonusPercent: 15, effectiveCostPerCreditUsd: 0.8696 },
  { monthlyPriceUsd: 200, effectiveCreditsUsd: 240, bonusCreditsUsd: 40, bonusPercent: 20, effectiveCostPerCreditUsd: 0.8333 },
  { monthlyPriceUsd: 500, effectiveCreditsUsd: 625, bonusCreditsUsd: 125, bonusPercent: 25, effectiveCostPerCreditUsd: 0.8 },
  { monthlyPriceUsd: 1000, effectiveCreditsUsd: 1300, bonusCreditsUsd: 300, bonusPercent: 30, effectiveCostPerCreditUsd: 0.7692 },
  { monthlyPriceUsd: 2000, effectiveCreditsUsd: 2700, bonusCreditsUsd: 700, bonusPercent: 35, effectiveCostPerCreditUsd: 0.7407 },
  { monthlyPriceUsd: 5000, effectiveCreditsUsd: 7000, bonusCreditsUsd: 2000, bonusPercent: 40, effectiveCostPerCreditUsd: 0.7143 },
  { monthlyPriceUsd: 10000, effectiveCreditsUsd: 14500, bonusCreditsUsd: 4500, bonusPercent: 45, effectiveCostPerCreditUsd: 0.6897 },
] as const

export type AgentJobTierId = 'quick-task' | 'deep-work' | 'run-your-business'

export type AgentJobTier = {
  id: AgentJobTierId
  label: string
  unit: 'job' | 'day'
  lowCreditsUsd: number
  midpointCreditsUsd: number
  highCreditsUsd: number
  creditBandLabel: string
  examples: readonly string[]
}

/**
 * Outcome-anchored job complexity bands that translate abstract credit balances
 * into concrete operator workloads.
 */
export const AGENT_JOB_TIERS: readonly AgentJobTier[] = [
  {
    id: 'quick-task',
    label: 'Quick task',
    unit: 'job',
    lowCreditsUsd: 1,
    midpointCreditsUsd: 3,
    highCreditsUsd: 5,
    creditBandLabel: '$1–$5',
    examples: ['research a topic', 'draft an email', 'summarize a doc', 'generate an image'],
  },
  {
    id: 'deep-work',
    label: 'Deep work',
    unit: 'job',
    lowCreditsUsd: 5,
    midpointCreditsUsd: 25,
    highCreditsUsd: 45,
    creditBandLabel: '$5–$45',
    examples: ['full competitor report', 'build a landing page', 'multi-step data pipeline', 'create a video'],
  },
  {
    id: 'run-your-business',
    label: 'Run your business',
    unit: 'day',
    lowCreditsUsd: 50,
    midpointCreditsUsd: 125,
    highCreditsUsd: 200,
    creditBandLabel: '$50–$200+/day',
    examples: ['always-on agents handling ops, marketing, outreach, monitoring & workflows'],
  },
] as const

export type CreditLadderEvaluation = {
  requestedMonthlyPriceUsd: number
  exactTierMatch: boolean
  selectedTier: CreditLadderTier
  monthlyPriceUsd: number
  effectiveCreditsUsd: number
  bonusCreditsUsd: number
  bonusPercent: number
  effectiveDiscountPercent: number
  estimatedCapacityByTier: {
    'quick-task': { minJobs: number; midpointJobs: number; maxJobs: number }
    'deep-work': { minJobs: number; midpointJobs: number; maxJobs: number }
    'run-your-business': { minDays: number; midpointDays: number; maxDays: number }
  }
  assumptions: string[]
}

export function evaluateCreditLadderSelection(monthlyPriceUsd: number): CreditLadderEvaluation {
  const sanitized = Number.isFinite(monthlyPriceUsd) ? Math.max(0, monthlyPriceUsd) : 0
  const exact = CREDIT_BONUS_LADDER.find((t) => t.monthlyPriceUsd === sanitized)
  const selectedTier =
    exact ??
    CREDIT_BONUS_LADDER.find((t) => t.monthlyPriceUsd >= sanitized) ??
    CREDIT_BONUS_LADDER[CREDIT_BONUS_LADDER.length - 1]

  const effectiveDiscountPercent =
    Math.round((1 - selectedTier.monthlyPriceUsd / selectedTier.effectiveCreditsUsd) * 10000) / 100

  const quick = AGENT_JOB_TIERS[0]
  const deep = AGENT_JOB_TIERS[1]
  const business = AGENT_JOB_TIERS[2]
  const credits = selectedTier.effectiveCreditsUsd

  const assumptions = [
    `Selected tier commits $${selectedTier.monthlyPriceUsd}/mo for $${selectedTier.effectiveCreditsUsd} in effective platform credits (+${selectedTier.bonusPercent}% bonus).`,
    'Job capacity ranges divide effective credits by the high, midpoint, and low credit bands for each complexity tier.',
    'Unused monthly commitment credits may expire at billing cycle close depending on platform terms; bonus credits reduce unit compute cost only when utilization stays high.',
    'Credit capacity measures agent compute and tool execution budget, never customer demand or revenue.',
  ]

  if (!exact) {
    assumptions.unshift(
      `Requested $${sanitized}/mo does not match an exact commitment step; snapped to the $${selectedTier.monthlyPriceUsd}/mo ladder tier.`,
    )
  }

  return {
    requestedMonthlyPriceUsd: sanitized,
    exactTierMatch: Boolean(exact),
    selectedTier,
    monthlyPriceUsd: selectedTier.monthlyPriceUsd,
    effectiveCreditsUsd: selectedTier.effectiveCreditsUsd,
    bonusCreditsUsd: selectedTier.bonusCreditsUsd,
    bonusPercent: selectedTier.bonusPercent,
    effectiveDiscountPercent,
    estimatedCapacityByTier: {
      'quick-task': {
        minJobs: Math.floor(credits / quick.highCreditsUsd),
        midpointJobs: Math.floor(credits / quick.midpointCreditsUsd),
        maxJobs: Math.floor(credits / quick.lowCreditsUsd),
      },
      'deep-work': {
        minJobs: Math.floor(credits / deep.highCreditsUsd),
        midpointJobs: Math.floor(credits / deep.midpointCreditsUsd),
        maxJobs: Math.floor(credits / deep.lowCreditsUsd),
      },
      'run-your-business': {
        minDays: Math.floor(credits / business.highCreditsUsd),
        midpointDays: Math.floor(credits / business.midpointCreditsUsd),
        maxDays: Math.floor(credits / business.lowCreditsUsd),
      },
    },
    assumptions,
  }
}

export type MonthlyAgentWorkloadInput = {
  quickTasksPerMonth: number
  deepWorkPerMonth: number
  businessDaysPerMonth: number
}

export type MonthlyAgentWorkloadEstimate = {
  jobs: MonthlyAgentWorkloadInput
  lowCreditsUsd: number
  midpointCreditsUsd: number
  highCreditsUsd: number
  breakdown: {
    'quick-task': { count: number; lowCreditsUsd: number; midpointCreditsUsd: number; highCreditsUsd: number }
    'deep-work': { count: number; lowCreditsUsd: number; midpointCreditsUsd: number; highCreditsUsd: number }
    'run-your-business': { count: number; lowCreditsUsd: number; midpointCreditsUsd: number; highCreditsUsd: number }
  }
  recommendedTier: CreditLadderTier
  highDemandTier: CreditLadderTier
  unutilizedMidpointCreditsUsd: number
  exceedsSingleLadderMax: boolean
  assumptions: string[]
}

export function estimateMonthlyAgentWorkload(
  jobs: MonthlyAgentWorkloadInput,
): MonthlyAgentWorkloadEstimate {
  const quickCount = Number.isFinite(jobs?.quickTasksPerMonth) ? Math.max(0, Math.floor(jobs.quickTasksPerMonth)) : 0
  const deepCount = Number.isFinite(jobs?.deepWorkPerMonth) ? Math.max(0, Math.floor(jobs.deepWorkPerMonth)) : 0
  const businessDays = Number.isFinite(jobs?.businessDaysPerMonth) ? Math.max(0, Math.floor(jobs.businessDaysPerMonth)) : 0

  const [quickTier, deepTier, businessTier] = AGENT_JOB_TIERS

  const quickBreakdown = {
    count: quickCount,
    lowCreditsUsd: quickCount * quickTier.lowCreditsUsd,
    midpointCreditsUsd: quickCount * quickTier.midpointCreditsUsd,
    highCreditsUsd: quickCount * quickTier.highCreditsUsd,
  }
  const deepBreakdown = {
    count: deepCount,
    lowCreditsUsd: deepCount * deepTier.lowCreditsUsd,
    midpointCreditsUsd: deepCount * deepTier.midpointCreditsUsd,
    highCreditsUsd: deepCount * deepTier.highCreditsUsd,
  }
  const businessBreakdown = {
    count: businessDays,
    lowCreditsUsd: businessDays * businessTier.lowCreditsUsd,
    midpointCreditsUsd: businessDays * businessTier.midpointCreditsUsd,
    highCreditsUsd: businessDays * businessTier.highCreditsUsd,
  }

  const lowCreditsUsd = quickBreakdown.lowCreditsUsd + deepBreakdown.lowCreditsUsd + businessBreakdown.lowCreditsUsd
  const midpointCreditsUsd =
    quickBreakdown.midpointCreditsUsd + deepBreakdown.midpointCreditsUsd + businessBreakdown.midpointCreditsUsd
  const highCreditsUsd =
    quickBreakdown.highCreditsUsd + deepBreakdown.highCreditsUsd + businessBreakdown.highCreditsUsd

  const topTier = CREDIT_BONUS_LADDER[CREDIT_BONUS_LADDER.length - 1]
  const recommendedTier =
    CREDIT_BONUS_LADDER.find((t) => t.effectiveCreditsUsd >= midpointCreditsUsd) ?? topTier
  const highDemandTier =
    CREDIT_BONUS_LADDER.find((t) => t.effectiveCreditsUsd >= highCreditsUsd) ?? topTier

  const exceedsSingleLadderMax = midpointCreditsUsd > topTier.effectiveCreditsUsd
  const unutilizedMidpointCreditsUsd = Math.max(0, recommendedTier.effectiveCreditsUsd - midpointCreditsUsd)

  const assumptions = [
    `Quick tasks (${quickCount}/mo) are modeled at $${quickTier.lowCreditsUsd} low / $${quickTier.midpointCreditsUsd} midpoint / $${quickTier.highCreditsUsd} high credits per job.`,
    `Deep work deliverables (${deepCount}/mo) are modeled at $${deepTier.lowCreditsUsd} low / $${deepTier.midpointCreditsUsd} midpoint / $${deepTier.highCreditsUsd} high credits per job.`,
    `Always-on business days (${businessDays}/mo) are modeled at $${businessTier.lowCreditsUsd} low / $${businessTier.midpointCreditsUsd} midpoint / $${businessTier.highCreditsUsd} high credits per active day.`,
    `Recommended tier ($${recommendedTier.monthlyPriceUsd}/mo -> $${recommendedTier.effectiveCreditsUsd} effective credits) is the lowest commitment step covering the $${midpointCreditsUsd} midpoint monthly credit demand.`,
    'This estimate models tool and compute expenditure only; it makes no claim or forecast about client acquisition or revenue.',
  ]

  if (exceedsSingleLadderMax) {
    assumptions.push(
      `Midpoint credit demand ($${midpointCreditsUsd}/mo) exceeds the largest single commitment tier ($${topTier.effectiveCreditsUsd} effective credits on the $${topTier.monthlyPriceUsd}/mo plan); additional top-ups or direct BYOK API routing are required.`,
    )
  }

  return {
    jobs: {
      quickTasksPerMonth: quickCount,
      deepWorkPerMonth: deepCount,
      businessDaysPerMonth: businessDays,
    },
    lowCreditsUsd,
    midpointCreditsUsd,
    highCreditsUsd,
    breakdown: {
      'quick-task': quickBreakdown,
      'deep-work': deepBreakdown,
      'run-your-business': businessBreakdown,
    },
    recommendedTier,
    highDemandTier,
    unutilizedMidpointCreditsUsd,
    exceedsSingleLadderMax,
    assumptions,
  }
}
