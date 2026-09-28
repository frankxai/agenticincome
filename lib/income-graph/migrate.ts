/**
 * IncomeGraph.v1 → v1.1 migration.
 *
 * v1.1 makes `irreversible` a required boolean on every workflow step, because
 * v1 let a step omit it and be read as reversible by default — an agent step
 * that sends a document to a customer inherited "safe" from silence. The
 * migration takes the opposite default: unknown becomes irreversible, and every
 * value it had to assume is reported as an M01 finding rather than applied
 * quietly. A v1 document is never rejected for its version alone.
 */

import { CURRENT_API_VERSION, type Finding, type IncomeGraph } from './model.ts'

export type Migration = {
  graph: IncomeGraph
  /** M-codes describing every value the migration had to assume. */
  findings: Finding[]
  /** True when the input declared an older api version. */
  migrated: boolean
  fromApiVersion: string
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

/**
 * Upgrades a graph in a copy. Structural repair is NOT its job: a malformed
 * graph passes through unchanged so the validator can describe it properly.
 */
export function migrateGraph(input: IncomeGraph): Migration {
  const fromApiVersion = typeof input?.apiVersion === 'string' ? input.apiVersion : ''
  const isLegacy = fromApiVersion === 'agenticincome.ai/v1'
  if (!isLegacy) return { graph: input, findings: [], migrated: false, fromApiVersion }

  const graph = clone(input)
  const findings: Finding[] = []
  graph.apiVersion = CURRENT_API_VERSION

  for (const node of Array.isArray(graph.nodes) ? graph.nodes : []) {
    const steps = node?.data?.steps
    if (!Array.isArray(steps)) continue
    steps.forEach((step, index) => {
      if (!step || typeof step !== 'object') return
      if (typeof step.irreversible === 'boolean') return
      step.irreversible = true
      findings.push({
        code: 'M01',
        severity: 'warning',
        path: `/nodes/${node.id}/data/steps/${step.id ?? index}/irreversible`,
        message: `v1 step "${step.id ?? index}" did not say whether it can be undone; migrated to irreversible`,
        remedy:
          'Set irreversible explicitly. The migration assumes the dangerous answer on purpose — if this step really can be undone, say so and the gate requirement drops.',
      })
    })
  }

  return { graph, findings, migrated: true, fromApiVersion }
}
