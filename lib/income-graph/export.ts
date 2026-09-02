/**
 * Exports. Two of them, and they are the point of the workbench:
 *
 * 1. projectToIncomeSystem — drafts the open-core IncomeSystem.v1 manifest
 *    (agenticincome.ai/v1, schema owned by frankxai/agentic-income-skills) from
 *    the graph, and names every required field the graph cannot know. This repo
 *    does not own or revalidate that contract; the public validator is the gate.
 * 2. exportTasks — the installable operating tasks, derived from workflow steps,
 *    gates, maintenance cadences, and kill-criterion review dates.
 */

import { computeEconomics } from './economics.ts'
import { REQUIRED_DENIED_ACTIONS } from './adversarial.ts'
import type { GraphNode, IncomeGraph } from './model.ts'

const OPEN = '[OPEN]'

export type IncomeSystemDraft = {
  manifest: Record<string, unknown>
  /** Required fields of the open-core contract that only the founder can supply. */
  missing: string[]
  validator: string
}

function first(graph: IncomeGraph, type: GraphNode['type']): GraphNode | undefined {
  return (graph.nodes ?? []).find((n) => n.type === type)
}

export function projectToIncomeSystem(graph: IncomeGraph): IncomeSystemDraft {
  const nodes = graph.nodes ?? []
  const offer = first(graph, 'Offer')
  const customer = first(graph, 'Customer')
  const problem = first(graph, 'Problem')
  const role = first(graph, 'AgentRole')
  const economics = computeEconomics(graph)

  const approvalGates = nodes
    .filter((n) => n.type === 'HumanGate')
    .map((gate) => ({
      action: gate.label,
      approver: gate.data?.approver ?? OPEN,
      expiresAfter: OPEN,
    }))

  const workflows = nodes
    .filter((n) => n.type === 'Workflow')
    .map((workflow) => ({
      id: workflow.id,
      trigger: OPEN,
      reversible: (workflow.data?.steps ?? []).every((step) => !step.irreversible),
      idempotencyKey: OPEN,
      steps: (workflow.data?.steps ?? []).map((step) => ({
        id: step.id,
        action: step.action,
        actor: step.actor,
        irreversible: step.irreversible,
      })),
    }))

  const killCriteria = nodes
    .filter((n) => n.type === 'KillCriterion')
    .map((kill) => ({
      id: kill.id,
      threshold: kill.data?.threshold ?? OPEN,
      reviewBy: kill.data?.reviewBy ?? OPEN,
    }))

  const evidence = nodes
    .filter((n) => n.type === 'Evidence')
    .map((node) => ({
      id: node.id,
      level: node.visibility === 'public' ? 'published' : 'internal',
      observedAt: node.provenance?.date ?? OPEN,
      sourceRef: node.provenance?.source ?? OPEN,
    }))

  const manifest: Record<string, unknown> = {
    apiVersion: 'agenticincome.ai/v1',
    kind: 'IncomeSystem',
    metadata: {
      id: graph.metadata?.id ?? OPEN,
      name: graph.metadata?.name ?? OPEN,
      version: graph.metadata?.version ?? '0.1.0',
      ownerPrincipalId: OPEN,
      createdAt: graph.metadata?.updatedAt ?? OPEN,
    },
    spec: {
      principal: {
        id: OPEN,
        legalName: OPEN,
        entityType: OPEN,
        jurisdiction: OPEN,
        verifiedDomains: [],
      },
      agent: {
        id: role?.id ?? OPEN,
        name: role?.label ?? OPEN,
        runtime: OPEN,
        skills: [],
        capabilities: role?.data?.allowedActions ?? [],
      },
      buyer: {
        segment: customer?.label ?? OPEN,
        problem: problem?.label ?? OPEN,
        excludedSegments: [],
      },
      outcome: {
        statement: graph.metadata?.thesis ?? OPEN,
        acceptanceCriteria: [],
      },
      authority: {
        defaultEffect: 'deny',
        allowedActions: role?.data?.allowedActions ?? [],
        deniedActions: [
          ...new Set([...(role?.data?.deniedActions ?? []), ...REQUIRED_DENIED_ACTIONS]),
        ],
        approvalGates,
        budget: OPEN,
        revocation: OPEN,
      },
      offer: {
        billingModel: offer?.data?.price?.unit ?? OPEN,
        price: offer?.data?.price
          ? { currency: offer.data.price.currency, amount: offer.data.price.amount }
          : OPEN,
        customerOwnsProductionAccounts: OPEN,
        incomeGuarantee: false,
      },
    },
    operations: {
      workflows,
      supportPolicy: OPEN,
      rollback: OPEN,
      killCriteria,
      budgets: {
        currency: economics.currency,
        monthlyCostFloor: economics.monthlyCostFloor,
        founderHoursPerMonth: economics.founderHoursPerMonth,
      },
    },
    economics: {
      eventTypes: ['qualified-lead', 'paid-order'],
      costTypes: nodes.filter((n) => n.type === 'Cost').map((n) => n.label),
      netContributionDefinition:
        'Attested revenue minus recorded money cost minus founder hours at the principal’s stated rate.',
      ownerTimeTracked: economics.founderHoursPerMonth > 0,
      observedRevenue: economics.observedRevenue,
    },
    proof: {
      status: economics.observedRevenue > 0 ? 'observed' : 'unproven',
      evidence,
      publicClaimsRequireHumanApproval: true,
    },
  }

  const missing: string[] = []
  const walk = (value: unknown, path: string) => {
    if (value === OPEN) missing.push(path)
    else if (Array.isArray(value)) value.forEach((item, i) => walk(item, `${path}/${i}`))
    else if (value && typeof value === 'object') {
      for (const [key, child] of Object.entries(value)) walk(child, `${path}/${key}`)
    }
  }
  walk(manifest, '')

  return {
    manifest,
    missing,
    validator:
      'Validate the completed manifest with the open-core validator: npm run income:validate -- income-system.json in frankxai/agentic-income-skills. This workbench drafts it; that validator gates it.',
  }
}

export type InstallableTask = {
  id: string
  title: string
  /** What runs it: an agent, or a person. */
  actor: 'agent' | 'human'
  cadence: string
  /** Gate that must release before the task completes, if any. */
  gate: string | null
  source: string
}

export function exportTasks(graph: IncomeGraph): InstallableTask[] {
  const nodes = graph.nodes ?? []
  const edges = graph.edges ?? []
  const byId = new Map(nodes.map((n) => [n.id, n]))
  const tasks: InstallableTask[] = []

  for (const workflow of nodes.filter((n) => n.type === 'Workflow')) {
    const gates = edges
      .filter((e) => e.type === 'gates' && e.to === workflow.id)
      .map((e) => byId.get(e.from))
      .filter((n): n is GraphNode => Boolean(n))

    for (const step of workflow.data?.steps ?? []) {
      const gate = gates.find((g) => (g.data?.gatedStepIds ?? []).includes(step.id))
      tasks.push({
        id: `${workflow.id}.${step.id}`,
        title: step.action,
        actor: step.actor,
        cadence: 'per request',
        gate: gate ? `${gate.label} — approver: ${gate.data?.approver ?? 'unnamed'}` : null,
        source: `workflow:${workflow.id}`,
      })
    }
  }

  for (const maintenance of nodes.filter((n) => n.type === 'Maintenance')) {
    tasks.push({
      id: `maintenance.${maintenance.id}`,
      title: maintenance.label,
      actor: 'human',
      cadence: maintenance.data?.cadenceDays ? `every ${maintenance.data.cadenceDays} days` : 'unscheduled',
      gate: null,
      source: `maintenance:${maintenance.id}`,
    })
  }

  for (const kill of nodes.filter((n) => n.type === 'KillCriterion')) {
    tasks.push({
      id: `review.${kill.id}`,
      title: `Kill review: ${kill.label} — ${kill.data?.threshold ?? 'threshold not set'}`,
      actor: 'human',
      cadence: kill.data?.reviewBy ? `once, by ${kill.data.reviewBy}` : 'unscheduled',
      gate: null,
      source: `kill-criterion:${kill.id}`,
    })
  }

  for (const experiment of nodes.filter((n) => n.type === 'Experiment')) {
    tasks.push({
      id: `experiment.${experiment.id}`,
      title: `${experiment.label} — decide by: ${experiment.data?.decisionRule ?? 'no decision rule set'}`,
      actor: 'human',
      cadence: 'once',
      gate: null,
      source: `experiment:${experiment.id}`,
    })
  }

  return tasks
}

/** The tasks as a markdown checklist an agent can be handed directly. */
export function tasksToMarkdown(graph: IncomeGraph, tasks: InstallableTask[]): string {
  const lines = [
    `# Operating tasks — ${graph.metadata?.name ?? 'income system'}`,
    '',
    `Thesis: ${graph.metadata?.thesis ?? 'not stated'}`,
    `Principal: ${graph.metadata?.principal ?? 'not named'}`,
    '',
    'Gated tasks may not complete until the named approver releases them. An agent that',
    'completes a gated task without a release has exceeded its authority.',
    '',
  ]
  for (const task of tasks) {
    lines.push(`- [ ] **${task.title}** · ${task.actor} · ${task.cadence}${task.gate ? ` · gate: ${task.gate}` : ''}`)
  }
  return lines.join('\n')
}
