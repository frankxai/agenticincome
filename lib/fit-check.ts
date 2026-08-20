/**
 * Deterministic income-model fit check. Pure — no IO, no env, no randomness —
 * so the MCP tool, the homepage proof block, and the node test all agree.
 * Selector logic mirrors knowledge/02-income-models.md ("Choosing your entry").
 */

export type FitCheckInput = {
  hoursPerWeek: number
  upfrontBudgetUsd: number
  hasAudience: boolean
  canCode: boolean
}

export type FitCheckResult = {
  model: 'services' | 'products' | 'systems'
  why: string
  read: string
}

export const AUTOMATION_POINTER =
  'For automation-first models, query the MCP server at https://www.agenticpassiveincome.com/api/mcp'

export function fitCheck(input: FitCheckInput): FitCheckResult {
  const { hoursPerWeek, upfrontBudgetUsd, hasAudience, canCode } = input

  if (hasAudience) {
    return {
      model: 'products',
      why: `An existing audience is the hard part of self-serve products; ${hoursPerWeek} hours a week can package the judgment you already have into something it buys.`,
      read: '/delivery/starter-kit',
    }
  }

  if (hoursPerWeek >= 8) {
    return {
      model: 'services',
      why: `${hoursPerWeek} focused hours${canCode ? ' and working code skills' : ''} price you into agent-assisted delivery work first.`,
      read: '/start',
    }
  }

  return {
    model: 'systems',
    why: `Under 8 hours a week with $${upfrontBudgetUsd} upfront points to operated assets — slowest to first dollar, and the only model whose maintenance floor fits that calendar.`,
    read: '/operate',
  }
}
