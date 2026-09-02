/**
 * Adversarial checks. These are the four ways an income system lies:
 * it promises (hype), it invents its buyers (fabricated demand), it manipulates
 * them (dark patterns), or it acts without permission (unauthorized execution).
 *
 * Every check is deterministic and cites the exact path and matched text, so a
 * founder can argue with it instead of guessing what upset the linter.
 *
 * Written the second time against a review that evaded all four in one sitting.
 * The rules that survived that review are structural — a claim needs checkable
 * evidence, an external effect needs a person who approves it — and the literal
 * phrase lists that remain are examples layered on top, never the defence.
 */

import {
  RECURRING_UNITS,
  type Finding,
  type GraphEdge,
  type GraphNode,
  type IncomeGraph,
} from './model.ts'
import { hasPhrase, matchedPhrases, normalize, stemHits, tokenize, tokensAt, within, wordHits } from './text.ts'

/**
 * Hype lexicon. Fast path only: every phrase here is also caught by one of the
 * structural rules below, and the structural rules are what a paraphrase hits.
 */
export const HYPE_TERMS: readonly string[] = [
  'passive income',
  'guaranteed',
  'risk-free',
  'effortless',
  'set and forget',
  'while you sleep',
  'on autopilot',
  'no work required',
  'financial freedom',
  'quit your job',
  'get rich',
  'six figures',
  'unlimited income',
  'proven system',
  'secret formula',
  'anyone can do this',
  'money machine',
  'replace your salary',
]

/** Money the reader is told they will receive. */
const MONEY_STEMS = ['income', 'revenu', 'earn', 'paycheck', 'payday', 'salar', 'wage', 'profit', 'payout'] as const

/** The absence of work, asserted about that money. */
const WORK_ABSENCE_WORDS = ['rest', 'resting', 'sleep', 'sleeping', 'asleep', 'autopilot', 'residual', 'passive', 'passively'] as const
const WORK_ABSENCE_STEMS = ['effortless', 'automat', 'overnight'] as const
const WORK_ABSENCE_PHRASES = [
  'hands off',
  'hands free',
  'while you sleep',
  'in your sleep',
  'without lifting a finger',
  'no work required',
  'zero effort',
  'no selling',
  'zero selling',
  'set and forget',
  'set it and forget it',
  'on autopilot',
  'no ceiling',
] as const

/** Certainty asserted about an outcome the seller does not control. */
const GUARANTEE_STEMS = ['guarante'] as const
const GUARANTEE_WORDS = ['definitely', 'certainty', 'foolproof'] as const
const GUARANTEE_PHRASES = [
  'no risk',
  'zero risk',
  'risk free',
  'cannot lose',
  'cant lose',
  'never fails',
  'always works',
  'proven system',
  'sure thing',
] as const

/** "in 90 days", "within 6 months" — a promise about when the money arrives. */
const TIMEFRAME = /(^| )(in|within|inside|by) (\d+) (day|days|week|weeks|month|months|year|years)( |$)/

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
 * Assertions that someone wants or will pay for something. A02 requires
 * evidence for these wherever they appear, including prose — moving a claim
 * out of `demandClaim` and into `notes` used to delete the check entirely.
 */
const DEMAND_PHRASES: readonly string[] = [
  'customers said',
  'customers told',
  'customers want',
  'everyone wants',
  'everybody wants',
  'everyone needs',
  'people want',
  'people will pay',
  'clients want',
  'buyers want',
  'will pay',
  'would pay',
  'pay per',
  'pay for',
  'willing to pay',
  'happy to pay',
  'ready to buy',
  'huge demand',
  'strong demand',
  'lots of interest',
  'demand for',
  'the market wants',
]

/** Rate language: a number attached to a period is a volume claim. */
const RATE_PHRASES: readonly string[] = ['per month', 'a month', 'per week', 'a week', 'per year', 'a year', 'per day']

/** Evidence findings that record nothing. Length alone would not catch these. */
const JUNK_FINDINGS: readonly string[] = [
  'everyone said yes',
  'they all said yes',
  'they loved it',
  'people want this',
  'trust me',
  'trust me bro',
  'confirmed',
  'looks good',
  'strong demand',
  'lots of interest',
  'obviously true',
  'common knowledge',
  'n a',
  'tbd',
  'tba',
]

const MIN_FINDING_CHARS = 40
const MIN_FINDING_WORDS = 8

/** Actions that leave the operator's own system. A hint that FORCES irreversible. */
export const IRREVERSIBLE_ACTION_HINTS: readonly string[] = [
  'send',
  'transmit',
  'dispatch',
  'deliver',
  'forward',
  'publish',
  'submit',
  'charge',
  'invoic',
  'refund',
  'transfer',
  'purchas',
  'deploy',
  'announc',
  'email',
  'notify',
  'upload',
  'broadcast',
  'escalat',
]

const IRREVERSIBLE_ACTION_WORDS: readonly string[] = [
  'post',
  'posts',
  'posted',
  'posting',
  'sign',
  'signs',
  'signed',
  'signing',
  'pay',
  'pays',
  'paid',
  'bill',
  'bills',
  'billed',
  'delete',
  'deletes',
  'deleted',
  'reply',
  'replies',
  'quote',
  'quotes',
  'commit',
  'commits',
  'release',
  'releases',
  'released',
]

/** Someone outside the operator's system. */
const RECIPIENT_WORDS: readonly string[] = [
  'customer',
  'customers',
  'client',
  'clients',
  'prospect',
  'prospects',
  'buyer',
  'buyers',
  'lead',
  'leads',
  'subscriber',
  'subscribers',
  'audience',
  'public',
  'recipient',
  'recipients',
]

/** Verbs of movement toward someone. Paired with a recipient, this is an external effect. */
const MOVEMENT_STEMS: readonly string[] = ['send', 'transmit', 'deliver', 'forward', 'hand', 'share', 'push', 'issue', 'onward', 'reach', 'provide', 'give']

/** Denied actions that must appear on every AgentRole, whatever else it may do. */
export const REQUIRED_DENIED_ACTIONS: readonly string[] = [
  'sign-contract',
  'change-price',
  'transfer-funds',
  'increase-budget',
]

type Field = { path: string; text: string }

function nodes(graph: IncomeGraph): GraphNode[] {
  return Array.isArray(graph?.nodes) ? graph.nodes : []
}

function edges(graph: IncomeGraph): GraphEdge[] {
  return Array.isArray(graph?.edges) ? graph.edges : []
}

function textFields(node: GraphNode): Field[] {
  const index = `/nodes/${node.id}`
  const out: Field[] = [
    { path: `${index}/label`, text: node.label ?? '' },
    { path: `${index}/notes`, text: node.notes ?? '' },
    { path: `${index}/evaluation`, text: node.evaluation ?? '' },
  ]
  const data = node.data ?? {}
  for (const key of [
    'demandClaim',
    'description',
    'finding',
    'hypothesis',
    'decisionRule',
    'threshold',
    'cancellation',
  ] as const) {
    const value = data[key]
    if (typeof value === 'string') out.push({ path: `${index}/data/${key}`, text: value })
  }
  if (data.scarcity?.claim) out.push({ path: `${index}/data/scarcity/claim`, text: data.scarcity.claim })
  for (const step of data.steps ?? []) {
    out.push({ path: `${index}/data/steps/${step.id}/action`, text: step.action ?? '' })
  }
  return out.filter((f) => f.text.trim().length > 0)
}

// ---------------------------------------------------------------------------
// A01 — hype
// ---------------------------------------------------------------------------

type HypeMatch = { path: string; rule: string; matched: string[] }

function hypeMatches(field: Field): HypeMatch[] {
  const normalized = normalize(field.text)
  const tokens = tokenize(field.text)
  const out: HypeMatch[] = []

  const money = stemHits(tokens, MONEY_STEMS)
  const absence = [...wordHits(tokens, WORK_ABSENCE_WORDS), ...stemHits(tokens, WORK_ABSENCE_STEMS)].sort((a, b) => a - b)
  const absencePhrases = matchedPhrases(normalized, WORK_ABSENCE_PHRASES)

  if (money.length > 0 && (within(money, absence, 8) || absencePhrases.length > 0)) {
    out.push({
      path: field.path,
      rule: 'money-without-work',
      matched: [...tokensAt(tokens, money), ...tokensAt(tokens, absence), ...absencePhrases],
    })
  }

  const guarantee = [
    ...tokensAt(tokens, stemHits(tokens, GUARANTEE_STEMS)),
    ...tokensAt(tokens, wordHits(tokens, GUARANTEE_WORDS)),
    ...matchedPhrases(normalized, GUARANTEE_PHRASES),
  ]
  if (guarantee.length > 0) {
    out.push({ path: field.path, rule: 'certainty', matched: guarantee })
  }

  const timeframe = TIMEFRAME.exec(normalized)
  if (timeframe && money.length > 0) {
    const at = tokens.indexOf(timeframe[3])
    if (at >= 0 && within(money, [at], 12)) {
      out.push({
        path: field.path,
        rule: 'timeframe-promise',
        matched: [timeframe[0].trim(), ...tokensAt(tokens, money)],
      })
    }
  }

  const lexicon = matchedPhrases(normalized, HYPE_TERMS)
  if (lexicon.length > 0) out.push({ path: field.path, rule: 'lexicon', matched: lexicon })

  return out
}

const HYPE_REMEDY: Record<string, string> = {
  'money-without-work':
    'You are asserting money and the absence of work in the same breath. State the mechanism and what it costs in hours.',
  certainty: 'Remove the certainty. An outcome you do not control is not yours to promise.',
  'timeframe-promise': 'Delete the deadline or attach the receipt. A date on someone else’s money is a forecast sold as a fact.',
  lexicon: 'This is a phrase from the genre, not a description of your system. Say what the buyer receives instead.',
}

/**
 * A01 — hype language. Scored across the whole graph: one accidental phrase is
 * a warning, two are a pattern and block. The rules match stems and distances,
 * so paraphrasing the lexicon does not clear the check.
 */
export function checkHype(graph: IncomeGraph): Finding[] {
  const all: HypeMatch[] = []
  for (const node of nodes(graph)) {
    for (const field of textFields(node)) all.push(...hypeMatches(field))
  }

  const severity: Finding['severity'] = all.length >= 2 ? 'error' : 'warning'
  return all.map((match) => ({
    code: 'A01',
    severity,
    path: match.path,
    message: `hype (${match.rule}): ${match.matched.map((m) => `"${m}"`).join(', ')}${
      severity === 'warning' ? ' — one occurrence, so this warns; a second one blocks' : ''
    }`,
    remedy: HYPE_REMEDY[match.rule] ?? 'Say what the buyer receives and what it costs.',
  }))
}

// ---------------------------------------------------------------------------
// A02 — fabricated demand
// ---------------------------------------------------------------------------

export type EvidenceSourceKind = 'url' | 'path' | 'interview' | 'unverifiable'

/**
 * Is this source something a stranger could go and check?
 *
 * A URL, a repository path, or an interview record naming a person and a date.
 * Anything else — "desk research", "trust me bro", "industry knowledge" — is
 * folklore, and folklore is how fabricated demand enters a graph.
 */
export function classifyEvidenceSource(source: string): EvidenceSourceKind {
  const raw = (source ?? '').trim()
  if (raw.length === 0) return 'unverifiable'
  if (/^https?:\/\/[^\s]+\.[^\s]+$/i.test(raw)) return 'url'
  if (/^interview:\s*\S.*\d{4}-\d{2}-\d{2}/.test(raw) && /[a-z]/i.test(raw.slice(10))) return 'interview'
  if (!/\s/.test(raw) && (raw.includes('/') || /\.[a-z0-9]{1,6}(#\S*)?$/i.test(raw))) return 'path'
  return 'unverifiable'
}

function isTrivialFinding(finding: string): boolean {
  const normalized = normalize(finding)
  if (normalized.length < MIN_FINDING_CHARS) return true
  if (normalized.split(' ').length < MIN_FINDING_WORDS) return true
  return JUNK_FINDINGS.some((junk) => hasPhrase(normalized, junk))
}

/** Demand language in free prose, returned with what matched. */
export function demandLanguage(text: string): string[] {
  const normalized = normalize(text)
  const tokens = tokenize(text)
  const matched = matchedPhrases(normalized, DEMAND_PHRASES)

  if (tokens.some((token) => token.includes('%'))) matched.push('a percentage')
  const rate = RATE_PHRASES.find((phrase) => hasPhrase(normalized, phrase))
  if (rate && /\d/.test(normalized)) {
    const numbers = tokens.map((t, i) => (/^\d/.test(t) ? i : -1)).filter((i) => i >= 0)
    const at = tokens.indexOf(normalize(rate).split(' ')[0])
    if (numbers.length > 0 && at >= 0 && within(numbers, [at], 4)) matched.push(`a rate ("${rate}")`)
  }
  return [...new Set(matched)]
}

type DemandAssertion = { path: string; why: string; quote: string }

/** Everything in one node that asserts demand and therefore owes evidence. */
export function demandAssertions(node: GraphNode): DemandAssertion[] {
  const index = `/nodes/${node.id}`
  const out: DemandAssertion[] = []
  const data = node.data ?? {}

  if (typeof data.demandClaim === 'string' && data.demandClaim.trim()) {
    out.push({ path: `${index}/data/demandClaim`, why: 'a demand claim', quote: data.demandClaim.trim() })
  }

  // A price or a volume is a demand claim with a number on it. Opt-in ended here.
  if (node.type === 'Customer' || node.type === 'Offer') {
    const price = data.price
    if (price && typeof price.amount === 'number' && price.amount !== 0) {
      out.push({
        path: `${index}/data/price`,
        why: 'a non-zero price',
        quote: `${price.currency} ${price.amount} per ${price.unit}`,
      })
    }
    const volume = data.volumeAssumption
    const units = volume?.unitsPerMonth ?? 0
    const conversion = volume?.conversionRate ?? 0
    if (units !== 0 || conversion !== 0) {
      out.push({
        path: `${index}/data/volumeAssumption`,
        why: 'a volume assumption',
        quote: units !== 0 ? `${units} units per month` : `conversion rate ${conversion}`,
      })
    }
  }

  for (const [field, text] of [
    ['notes', node.notes],
    ['description', data.description],
  ] as const) {
    if (typeof text !== 'string' || !text.trim()) continue
    const matched = demandLanguage(text)
    if (matched.length > 0) {
      out.push({
        path: `${index}/${field === 'notes' ? 'notes' : 'data/description'}`,
        why: `demand language in prose (${matched.join(', ')})`,
        quote: text.trim().slice(0, 120),
      })
    }
  }

  return out
}

/**
 * A02 — fabricated demand. Every demand claim needs an Evidence node pointed at
 * it by an `evidences` edge; every Evidence node needs a source a stranger can
 * check, a finding that records what the source actually said, and a date that
 * is not in the future. Revenue needs a Receipt.
 */
export function checkFabricatedDemand(graph: IncomeGraph, today: string): Finding[] {
  const out: Finding[] = []
  const all = nodes(graph)
  const links = edges(graph)
  const byId = new Map(all.map((n) => [n.id, n]))

  // 1. Evidence quality, once per Evidence node.
  for (const evidence of all.filter((n) => n.type === 'Evidence')) {
    const source = evidence.provenance?.source ?? ''
    const kind = classifyEvidenceSource(source)
    if (kind === 'unverifiable') {
      out.push({
        code: 'A02',
        severity: 'error',
        path: `/nodes/${evidence.id}/provenance/source`,
        message: `evidence source "${source.slice(0, 60)}" cannot be checked by anyone else`,
        remedy:
          'Cite an http(s) URL, a file path in this repository, or an interview record in the form "interview:Jane Roe 2026-08-14". A source only you can see is not evidence.',
      })
    }

    const finding = evidence.data?.finding
    if (!finding?.trim()) {
      out.push({
        code: 'A02',
        severity: 'error',
        path: `/nodes/${evidence.id}/data/finding`,
        message: `evidence "${evidence.id}" records no finding`,
        remedy: 'Write what the source actually said, not what you concluded from it.',
      })
    } else if (isTrivialFinding(finding)) {
      out.push({
        code: 'A02',
        severity: 'error',
        path: `/nodes/${evidence.id}/data/finding`,
        message: `evidence "${evidence.id}" records nothing checkable: "${finding.trim().slice(0, 60)}"`,
        remedy: `Quote or summarise the source in at least ${MIN_FINDING_WORDS} words. "Everyone said yes" is a feeling with a citation stapled to it.`,
      })
    }

    if (!evidence.data?.kind) {
      out.push({
        code: 'A02',
        severity: 'warning',
        path: `/nodes/${evidence.id}/data/kind`,
        message: `evidence "${evidence.id}" does not say what kind of artifact it is`,
        remedy: 'Set kind to interview, transcript, payment, listing, analytics, or document, and n to how many observations it covers.',
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

  // 2. Every demand assertion needs at least one Evidence node aimed at it.
  for (const node of all) {
    const assertions = demandAssertions(node)
    if (assertions.length === 0) continue

    const supporting = links
      .filter((e) => e.type === 'evidences' && e.to === node.id)
      .map((e) => byId.get(e.from))
      .filter((n): n is GraphNode => Boolean(n) && n?.type === 'Evidence')

    if (supporting.length > 0) continue

    for (const assertion of assertions) {
      out.push({
        code: 'A02',
        severity: 'error',
        path: assertion.path,
        message: `${assertion.why} with no Evidence node behind it: "${assertion.quote.slice(0, 80)}"`,
        remedy:
          'Add an Evidence node with a checkable source and a dated finding, and an evidences edge to this node. Otherwise delete the claim — including the number.',
      })
    }
  }

  // 3. Revenue observations are demand claims with money attached; they need receipts.
  for (const observation of all.filter((n) => n.type === 'RevenueObservation')) {
    const attested = links.some((e) => e.type === 'attests' && e.to === observation.id)
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

// ---------------------------------------------------------------------------
// A03 — dark patterns
// ---------------------------------------------------------------------------

/** A03 — dark patterns, checked structurally and in copy. */
export function checkDarkPatterns(graph: IncomeGraph): Finding[] {
  const out: Finding[] = []

  for (const node of nodes(graph)) {
    for (const field of textFields(node)) {
      const normalized = normalize(field.text)
      for (const pattern of DARK_PATTERN_COPY) {
        if (hasPhrase(normalized, pattern.term)) {
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

// ---------------------------------------------------------------------------
// A04 — unauthorized execution
// ---------------------------------------------------------------------------

/**
 * Does this step reach outside the operator's own system? Verb stems are the
 * fast path; the structural rule is a movement verb aimed at a recipient, which
 * survives rewording ("transmits the finished document onward to the prospect").
 */
export function hasExternalEffect(action: string): string[] {
  const tokens = tokenize(action)
  const matched = [
    ...tokensAt(tokens, stemHits(tokens, IRREVERSIBLE_ACTION_HINTS)),
    ...tokensAt(tokens, wordHits(tokens, IRREVERSIBLE_ACTION_WORDS)),
  ]

  const recipients = wordHits(tokens, RECIPIENT_WORDS)
  const movement = stemHits(tokens, MOVEMENT_STEMS)
  if (recipients.length > 0 && movement.length > 0 && within(recipients, movement, 10)) {
    matched.push(...tokensAt(tokens, recipients), ...tokensAt(tokens, movement))
  }

  return [...new Set(matched)]
}

/**
 * Can this approver release a gate? Only a named person can: a Human node, or
 * the graph's own principal. An AgentRole is explicitly rejected — a system
 * whose agent approves its own irreversible steps has no gate at all.
 */
export function resolveApprover(
  graph: IncomeGraph,
  approver: string,
): { ok: boolean; resolvedTo?: string; reason?: string } {
  const wanted = normalize(approver)
  if (!wanted) return { ok: false, reason: 'empty' }

  for (const role of nodes(graph).filter((n) => n.type === 'AgentRole')) {
    if (normalize(role.id) === wanted || normalize(role.label ?? '') === wanted) {
      return { ok: false, reason: `it is the agent role "${role.id}"` }
    }
  }
  if (/(^| )(the )?(agent|bot|system|ai|assistant|automation)( |$)/.test(wanted)) {
    return { ok: false, reason: 'it names software, not a person' }
  }

  for (const human of nodes(graph).filter((n) => n.type === 'Human')) {
    if (normalize(human.id) === wanted || normalize(human.label ?? '') === wanted) {
      return { ok: true, resolvedTo: `Human node "${human.id}"` }
    }
  }
  if (normalize(graph.metadata?.principal ?? '') === wanted && wanted.length > 0) {
    return { ok: true, resolvedTo: 'metadata.principal' }
  }
  return { ok: false, reason: 'it resolves to no Human node and is not the named principal' }
}

/**
 * A04 — unauthorized execution. Every step with an external effect is
 * irreversible whether or not it says so; every irreversible step is gated by a
 * HumanGate; every gate is released by a person; every AgentRole denies the
 * four estate-wide actions.
 */
export function checkUnauthorizedExecution(graph: IncomeGraph): Finding[] {
  const out: Finding[] = []
  const all = nodes(graph)
  const links = edges(graph)
  const byId = new Map(all.map((n) => [n.id, n]))

  for (const workflow of all.filter((n) => n.type === 'Workflow')) {
    const gates = links
      .filter((e) => e.type === 'gates' && e.to === workflow.id)
      .map((e) => byId.get(e.from))
      .filter((n): n is GraphNode => Boolean(n) && n?.type === 'HumanGate')

    const gatedStepIds = new Set(gates.flatMap((gate) => gate.data?.gatedStepIds ?? []))

    for (const step of workflow.data?.steps ?? []) {
      const external = hasExternalEffect(step.action ?? '')
      const irreversible = step.irreversible === true || external.length > 0

      if (external.length > 0 && step.irreversible !== true) {
        out.push({
          code: 'A04',
          severity: 'error',
          path: `/nodes/${workflow.id}/data/steps/${step.id}/irreversible`,
          message: `step "${step.id}" reaches outside your system (${external
            .map((m) => `"${m}"`)
            .join(', ')}) but is marked reversible; it is treated as irreversible`,
          remedy:
            'Set irreversible to true and gate it. Whether a step can be undone is decided by where it lands, not by how the sentence is worded.',
        })
      }

      if (irreversible && !gatedStepIds.has(step.id)) {
        out.push({
          code: 'A04',
          severity: 'error',
          path: `/nodes/${workflow.id}/data/steps/${step.id}`,
          message: `irreversible ${step.actor === 'human' ? 'human' : 'agent'} step "${step.id}" has no HumanGate`,
          remedy: 'Add a HumanGate whose gatedStepIds include this step, or make the step reversible.',
        })
      }
    }

    for (const gate of gates) {
      const approver = gate.data?.approver ?? ''
      if (!approver.trim()) {
        out.push({
          code: 'A04',
          severity: 'error',
          path: `/nodes/${gate.id}/data/approver`,
          message: `human gate "${gate.id}" names no approver`,
          remedy: 'A gate nobody owns is not a gate. Name the person who releases it.',
        })
      } else {
        const resolution = resolveApprover(graph, approver)
        if (!resolution.ok) {
          out.push({
            code: 'A04',
            severity: 'error',
            path: `/nodes/${gate.id}/data/approver`,
            message: `gate "${gate.id}" approver "${approver}" is not a person: ${resolution.reason}`,
            remedy:
              'Point approver at a Human node (id or label) or at metadata.principal. A gate an agent can release is a gate in name only.',
          })
        }
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

  for (const role of all.filter((n) => n.type === 'AgentRole')) {
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
