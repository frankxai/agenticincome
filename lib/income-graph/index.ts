/**
 * The workbench entry point. One function decides whether an income system is
 * allowed to meet the market, and it is the same function everywhere: MCP tool,
 * web page, node test.
 *
 * Activation is NOT "the manifest validates". Activation is a validated manifest
 * plus a first real market test. Economic success is an observed payment, an
 * observed qualified lead, or a paid product — never a forecast.
 */

import { runAdversarialChecks } from './adversarial.ts'
import { draftIncomeGraph, type IncomeGraphDraft, type UnsupportedClaim } from './draft.ts'
import {
  AGENT_JOB_TIERS,
  CREDIT_BONUS_LADDER,
  checkEconomics,
  computeEconomics,
  estimateMonthlyAgentWorkload,
  evaluateCreditLadderSelection,
  type AgentJobTier,
  type AgentJobTierId,
  type CreditLadderEvaluation,
  type CreditLadderTier,
  type Economics,
  type MonthlyAgentWorkloadEstimate,
  type MonthlyAgentWorkloadInput,
} from './economics.ts'
import { exportTasks, projectToIncomeSystem, tasksToMarkdown, type InstallableTask } from './export.ts'
import { migrateGraph } from './migrate.ts'
import { analyzeSettlement, hasActivatedFiatOffer, type SettlementVerdict } from './settlement.ts'
import { notAGraph, validateStructure } from './validate.ts'
import { SCHEMA_ID, type Finding, type IncomeGraph } from './model.ts'

export type WorkbenchReport = {
  /** The schema the review was run under, and whether the input had to be migrated to it. */
  schema: string
  migratedFrom: string | null
  /** True only when there are zero error-severity findings. */
  valid: boolean
  /**
   * ready-to-test: the graph is coherent and honest enough to put in front of a
   * real buyer. It is not a claim that anyone will pay.
   */
  activation: 'blocked' | 'ready-to-test' | 'activated'
  /** The economic event that has actually been observed, or null. */
  economicEvent: { kind: 'observed-revenue'; amount: number; currency: string; units: number } | null
  findings: Finding[]
  counts: { errors: number; warnings: number }
  economics: Economics
  /** One verdict per Offer, in document order. A clean offer with no rail is fiat-account. */
  settlements: SettlementVerdict[]
  tasks: InstallableTask[]
  nextDecisions: string[]
}

const SEVERITY_ORDER = { error: 0, warning: 1 } as const

/** The same defect reported twice is noise; findings are identified by code, path, and message. */
function dedupe(findings: Finding[]): Finding[] {
  const seen = new Set<string>()
  return findings.filter((f) => {
    const key = `${f.code}|${f.path}|${f.message}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function sortFindings(findings: Finding[]): Finding[] {
  return dedupe(findings).sort(
    (a, b) =>
      SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] ||
      a.code.localeCompare(b.code) ||
      a.path.localeCompare(b.path) ||
      a.message.localeCompare(b.message),
  )
}

/**
 * @param today ISO date used for future-dating checks. Passed in, never read
 * from the clock, so results are reproducible.
 */
export function reviewIncomeGraph(input: IncomeGraph, today: string): WorkbenchReport {
  // A caller who sends null, a string, or an array gets findings back like
  // anyone else. This function is a review, so it never throws at its own user.
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    return emptyReport([notAGraph(input)])
  }

  const migration = migrateGraph(input)
  const graph = migration.graph

  const settlement = analyzeSettlement(graph)
  const findings = sortFindings([
    ...migration.findings,
    ...validateStructure(graph),
    ...runAdversarialChecks(graph, today),
    ...checkEconomics(graph),
    ...settlement.findings,
  ])

  const errors = findings.filter((f) => f.severity === 'error').length
  const warnings = findings.length - errors
  const economics = computeEconomics(graph)
  const valid = errors === 0

  const economicEvent =
    economics.observedRevenue > 0
      ? ({
          kind: 'observed-revenue' as const,
          amount: economics.observedRevenue,
          currency: economics.currency,
          units: economics.observedUnits,
        })
      : null

  const activation = !valid ? 'blocked' : economicEvent ? 'activated' : 'ready-to-test'

  const nextDecisions: string[] = []
  if (!valid) {
    nextDecisions.push(`Clear ${errors} blocking finding${errors === 1 ? '' : 's'} before showing this to a buyer.`)
  } else if (!economicEvent) {
    nextDecisions.push('Run the first real market test. Until someone pays or qualifies, this is a hypothesis with costs.')
  }
  if (economics.breakEvenUnitsPerMonth !== null && !economicEvent) {
    nextDecisions.push(
      `Break-even is ${economics.breakEvenUnitsPerMonth} unit${economics.breakEvenUnitsPerMonth === 1 ? '' : 's'} a month at the lowest listed price. Decide whether that many is plausible from one channel.`,
    )
  }
  if (economics.founderHoursPerMonth > 0) {
    nextDecisions.push(
      `This costs ${economics.founderHoursPerMonth} founder hours a month. Decide what you are giving up for them.`,
    )
  }
  if (settlement.verdicts.some((verdict) => verdict.rail === 'machine-payment' && verdict.admitted)) {
    if (!hasActivatedFiatOffer(graph)) {
      nextDecisions.push(
        'A metered agent payment is admitted on paper. Leave the endpoint off until a fiat offer on this graph is activated by an attested payment.',
      )
    }
  }
  if (settlement.verdicts.some((verdict) => verdict.rail === 'on-chain-right' && verdict.admitted)) {
    nextDecisions.push(
      'A chain right is admitted on paper. A person still has to sign the registration step. Nothing in that admission is a reason to mint a collection.',
    )
  }

  return {
    schema: SCHEMA_ID,
    migratedFrom: migration.migrated ? migration.fromApiVersion : null,
    valid,
    activation,
    economicEvent,
    findings,
    counts: { errors, warnings },
    economics,
    settlements: settlement.verdicts,
    tasks: exportTasks(graph),
    nextDecisions,
  }
}

const EMPTY_GRAPH = { nodes: [], edges: [] } as unknown as IncomeGraph

function emptyReport(findings: Finding[]): WorkbenchReport {
  return {
    schema: SCHEMA_ID,
    migratedFrom: null,
    valid: false,
    activation: 'blocked',
    economicEvent: null,
    findings,
    counts: { errors: findings.length, warnings: 0 },
    economics: computeEconomics(EMPTY_GRAPH),
    settlements: [],
    tasks: [],
    nextDecisions: ['Send an IncomeGraph document. There is nothing here to review.'],
  }
}

export {
  AGENT_JOB_TIERS,
  CREDIT_BONUS_LADDER,
  computeEconomics,
  draftIncomeGraph,
  estimateMonthlyAgentWorkload,
  evaluateCreditLadderSelection,
  exportTasks,
  hasActivatedFiatOffer,
  migrateGraph,
  projectToIncomeSystem,
  tasksToMarkdown,
  runAdversarialChecks,
  validateStructure,
}
export * from './model.ts'
export type {
  AgentJobTier,
  AgentJobTierId,
  CreditLadderEvaluation,
  CreditLadderTier,
  Economics,
  IncomeGraphDraft,
  InstallableTask,
  MonthlyAgentWorkloadEstimate,
  MonthlyAgentWorkloadInput,
  SettlementVerdict,
  UnsupportedClaim,
}
