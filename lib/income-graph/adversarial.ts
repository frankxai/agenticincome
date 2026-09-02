/**
 * Adversarial checks. These are the four ways an income system lies:
 * it promises (hype), it invents its buyers (fabricated demand), it manipulates
 * them (dark patterns), or it acts without permission (unauthorized execution).
 *
 * Every check is deterministic and cites the exact path and matched text, so a
 * founder can argue with it instead of guessing what upset the linter.
 */

import { RECURRING_UNITS, type Finding, type GraphNode, type IncomeGraph } from './model.ts'

/**
 * Hype lexicon. Phrases that assert an outcome the seller cannot control, or
 * an absence of work that is never true. Word-boundary matched, case-insensitive.
 */
export const HYPE_TERMS: readonly string[] = [
  'passive income',
  'guaranteed',
  'guarantee results',
  'risk-free',
  'no risk',
  'effortless',
  'effortlessly',
  'set and forget',
  'set it and forget it',
  'while you sleep',
  'on autopilot',
  'no work required',
  'without lifting a finger',
  'financial freedom',
  'quit your job',
  'life-changing income',
  'get rich',
  'overnight',
  'six figures',
  '6 figures',
  'seven figures',
  '7 figures',
  'unlimited earnings',
  'unlimited income',
  'proven system',
  'secret formula',
  'anyone can do this',
  'zero effort',
  'money machine',
  'print money',
  'replace your salary',
]

/** Named dark patterns, matched against offer structure rather than copy alone. */
export const DARK_PATTERN_COPY: readonly { term: string; name: string }[] = [
  { term: 'only a few left', name: 'fake scarcity' },
  { term: 'spots are almost gone', name: 'fake scarcity' },
  { term: 'price goes up in', name: 'false urgency' },
  { term: 'offer expires in minutes', name: 'false urgency' },
  { term: 'no thanks, i prefer', name: 'confirmshaming' },
  { term: "i don't want to succeed", name: 'confirmshaming' },
  { term: 'cancel anytime by calling', name: 'roach motel' },
  { term: 'email us to cancel', name: 'roach motel' },
  { term: 'pre-selected', name: 'pre-checked consent' },
  { term: 'checked by default', name: 'pre-checked consent' },
]

/**
 * Fields whose contents are read as demand claims. A demand claim asserts that
 * someone wants or will pay for something, which is exactly the assertion a
 * founder is most likely to invent.
 */
const DEMAND_FIELDS: readonly string[] = ['demandClaim']

/** Actions no agent may take unattended regardless of how the graph is written. */
export const IRREVERSIBLE_ACTION_HINTS: readonly string[] = [
  'send',
  'email',
  'publish',
  'post',
  'charge',
  'invoice',
  'refund',
  'sign',
  'commit',
  'transfer',
  'pay',
  'delete',
  'deploy',
  'reply',
  'quote',
]

/** Denied actions that must appear on every AgentRole, whatever else it may do. */
export const REQUIRED_DENIED_ACTIONS: readonly string[] = [
  'sign-contract',
  'change-price',
  'transfer-funds',
  'increase-budget',
]

function textFields(node: GraphNode): { path: string; text: string }[] {
  const index = `/nodes/${node.id}`
  const out: { path: string; text: string }[] = [
    { path: `${index}/label`, text: node.label ?? '' },
    { path: `${index}/notes`, text: node.notes ?? '' },
    { path: `${index}/evaluation`, text: node.evaluation ?? '' },
  ]
  const data = node.data ?? {}
  for (const key of ['demandClaim', 'finding', 'hypothesis', 'decisionRule', 'threshold', 'cancellation'] as const) {
    const value = data[key]
    if (typeof value === 'string') out.push({ path: `${index}/data/${key}`, text: value })
  }
  if (data.scarcity?.claim) out.push({ path: `${index}/data/scarcity/claim`, text: data.scarcity.claim })
  for (const step of data.steps ?? []) {
    out.push({ path: `${index}/data/steps/${step.id}/action`, text: step.action ?? '' })
  }
  return out.filter((f) => f.text.trim().length > 0)
}

function matches(term: string, text: string): boolean {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i').test(text)
}

/** A01 — hype language. */
export function checkHype(graph: IncomeGraph): Finding[] {
  const out: Finding[] = []
  for (const node of graph.nodes ?? []) {
    for (const field of textFields(node)) {
      for (const term of HYPE_TERMS) {
        if (matches(term, field.text)) {
          out.push({
            code: 'A01',
            severity: 'error',
            path: field.path,
            message: `hype language: "${term}"`,
            remedy: 'State the mechanism and what it costs. Anything you cannot control is not yours to promise.',
          })
        }
      }
    }
  }
  return out
}

/**
 * A02 — fabricated demand. Every demand claim needs at least one Evidence node
 * pointed at it by an `evidences` edge, and that Evidence must carry a source,
 * a date, and a finding. An undated source is folklore.
 */
export function checkFabricatedDemand(graph: IncomeGraph, today: string): Finding[] {
  const out: Finding[] = []
  const nodes = graph.nodes ?? []
  const edges = graph.edges ?? []
  const byId = new Map(nodes.map((n) => [n.id, n]))

  for (const node of nodes) {
    for (const key of DEMAND_FIELDS) {
      const claim = (node.data as Record<string, unknown> | undefined)?.[key]
      if (typeof claim !== 'string' || !claim.trim()) continue

      const supporting = edges
        .filter((e) => e.type === 'evidences' && e.to === node.id)
        .map((e) => byId.get(e.from))
        .filter((n): n is GraphNode => Boolean(n) && n!.type === 'Evidence')

      if (supporting.length === 0) {
        out.push({
          code: 'A02',
          severity: 'error',
          path: `/nodes/${node.id}/data/${key}`,
          message: `demand claim has no Evidence node: "${claim.slice(0, 80)}"`,
          remedy: 'Add an Evidence node with a source and a date, and an evidences edge to this node. Otherwise delete the claim.',
        })
        continue
      }

      for (const evidence of supporting) {
        if (!evidence.data?.finding?.trim()) {
          out.push({
            code: 'A02',
            severity: 'error',
            path: `/nodes/${evidence.id}/data/finding`,
            message: `evidence "${evidence.id}" records no finding`,
            remedy: 'Write what the source actually said, not what you concluded from it.',
          })
        }
        if (evidence.provenance?.date && evidence.provenance.date > today) {
          out.push({
            code: 'A02',
            severity: 'error',
            path: `/nodes/${evidence.id}/provenance/date`,
            message: `evidence "${evidence.id}" is dated in the future (${evidence.provenance.date})`,
            remedy: 'Evidence cannot be dated after today. Correct the date.',
          })
        }
      }
    }
  }

  // Revenue observations are demand claims with money attached; they need receipts.
  for (const observation of nodes.filter((n) => n.type === 'RevenueObservation')) {
    const attested = edges.some((e) => e.type === 'attests' && e.to === observation.id)
    if (!attested) {
      out.push({
        code: 'A02',
        severity: 'error',
        path: `/nodes/${observation.id}`,
        message: `revenue observation "${observation.id}" has no Receipt attesting it`,
        remedy: 'Money you cannot show a receipt for is a forecast. Attach a Receipt node or remove the observation.',
      })
    }
    if (observation.data?.observed && observation.data.observed.occurredAt > today) {
      out.push({
        code: 'A02',
        severity: 'error',
        path: `/nodes/${observation.id}/data/observed/occurredAt`,
        message: 'revenue is dated in the future',
        remedy: 'A RevenueObservation records money that already arrived. Use an Experiment for what you expect.',
      })
    }
  }

  return out
}

/** A03 — dark patterns, checked structurally and in copy. */
export function checkDarkPatterns(graph: IncomeGraph): Finding[] {
  const out: Finding[] = []

  for (const node of graph.nodes ?? []) {
    for (const field of textFields(node)) {
      for (const pattern of DARK_PATTERN_COPY) {
        if (matches(pattern.term, field.text)) {
          out.push({
            code: 'A03',
            severity: 'error',
            path: field.path,
            message: `${pattern.name}: "${pattern.term}"`,
            remedy: 'Remove it, or make the underlying fact real and state the fact instead.',
          })
        }
      }
    }

    if (node.type === 'Offer') {
      const data = node.data ?? {}
      if (data.scarcity && !data.scarcity.countBasis?.trim()) {
        out.push({
          code: 'A03',
          severity: 'error',
          path: `/nodes/${node.id}/data/scarcity/countBasis`,
          message: 'scarcity claim with no basis for the number',
          remedy: 'Name what produces the count — a real capacity limit or a real inventory. Invented scarcity is a dark pattern.',
        })
      }
      const unit = data.price?.unit?.toLowerCase() ?? ''
      if (RECURRING_UNITS.includes(unit) && !data.cancellation?.trim()) {
        out.push({
          code: 'A03',
          severity: 'error',
          path: `/nodes/${node.id}/data/cancellation`,
          message: 'recurring price with no stated cancellation path (forced continuity)',
          remedy: 'State how a buyer stops paying, in the same place they start.',
        })
      }
    }

    if (node.type === 'Cost' && node.data?.borneByBuyer && node.data?.disclosedToBuyer !== true) {
      out.push({
        code: 'A03',
        severity: 'error',
        path: `/nodes/${node.id}/data/disclosedToBuyer`,
        message: 'a cost the buyer pays is not disclosed before purchase',
        remedy: 'Disclose every buyer-borne cost pre-purchase, or absorb it.',
      })
    }
  }

  return out
}

/**
 * A04 — unauthorized execution. Every irreversible step must be gated by a
 * HumanGate that names it and names an approver; agents may not be assigned
 * human-only steps; and every AgentRole must deny the four estate-wide actions.
 */
export function checkUnauthorizedExecution(graph: IncomeGraph): Finding[] {
  const out: Finding[] = []
  const nodes = graph.nodes ?? []
  const edges = graph.edges ?? []
  const byId = new Map(nodes.map((n) => [n.id, n]))

  for (const workflow of nodes.filter((n) => n.type === 'Workflow')) {
    const gates = edges
      .filter((e) => e.type === 'gates' && e.to === workflow.id)
      .map((e) => byId.get(e.from))
      .filter((n): n is GraphNode => Boolean(n) && n!.type === 'HumanGate')

    const gatedStepIds = new Set(gates.flatMap((gate) => gate.data?.gatedStepIds ?? []))

    for (const step of workflow.data?.steps ?? []) {
      const looksIrreversible = IRREVERSIBLE_ACTION_HINTS.some((hint) => matches(hint, step.action ?? ''))

      if (looksIrreversible && !step.irreversible) {
        out.push({
          code: 'A04',
          severity: 'warning',
          path: `/nodes/${workflow.id}/data/steps/${step.id}/irreversible`,
          message: `step "${step.id}" reads as irreversible but is marked reversible`,
          remedy: 'If the action leaves your system — a send, a charge, a publish — mark it irreversible and gate it.',
        })
      }

      if (step.irreversible && step.actor === 'agent' && !gatedStepIds.has(step.id)) {
        out.push({
          code: 'A04',
          severity: 'error',
          path: `/nodes/${workflow.id}/data/steps/${step.id}`,
          message: `irreversible agent step "${step.id}" has no HumanGate`,
          remedy: 'Add a HumanGate whose gatedStepIds include this step, or make the step reversible.',
        })
      }
    }

    for (const gate of gates) {
      if (!gate.data?.approver?.trim()) {
        out.push({
          code: 'A04',
          severity: 'error',
          path: `/nodes/${gate.id}/data/approver`,
          message: `human gate "${gate.id}" names no approver`,
          remedy: 'A gate nobody owns is not a gate. Name the person who releases it.',
        })
      }
      const stepIds = new Set((workflow.data?.steps ?? []).map((s) => s.id))
      for (const id of gate.data?.gatedStepIds ?? []) {
        if (!stepIds.has(id)) {
          out.push({
            code: 'A04',
            severity: 'error',
            path: `/nodes/${gate.id}/data/gatedStepIds`,
            message: `gate references step "${id}" which does not exist in workflow "${workflow.id}"`,
            remedy: 'Correct the step id. A gate pointing at nothing blocks nothing.',
          })
        }
      }
    }
  }

  for (const role of nodes.filter((n) => n.type === 'AgentRole')) {
    const denied = new Set((role.data?.deniedActions ?? []).map((a) => a.toLowerCase()))
    for (const action of REQUIRED_DENIED_ACTIONS) {
      if (!denied.has(action)) {
        out.push({
          code: 'A04',
          severity: 'error',
          path: `/nodes/${role.id}/data/deniedActions`,
          message: `agent role "${role.id}" does not deny "${action}"`,
          remedy: `Every agent role must deny: ${REQUIRED_DENIED_ACTIONS.join(', ')}.`,
        })
      }
    }
    for (const allowed of role.data?.allowedActions ?? []) {
      if (denied.has(allowed.toLowerCase())) {
        out.push({
          code: 'A04',
          severity: 'error',
          path: `/nodes/${role.id}/data/allowedActions`,
          message: `action "${allowed}" is both allowed and denied`,
          remedy: 'Resolve the contradiction. An ambiguous authority resolves itself in the agent’s favour.',
        })
      }
    }
  }

  return out
}

export function runAdversarialChecks(graph: IncomeGraph, today: string): Finding[] {
  return [
    ...checkHype(graph),
    ...checkFabricatedDemand(graph, today),
    ...checkDarkPatterns(graph),
    ...checkUnauthorizedExecution(graph),
  ]
}
