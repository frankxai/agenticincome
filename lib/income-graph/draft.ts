/**
 * Intake. The workbench's first move, and the one a stranger meets.
 *
 * Before this existed, a first paste landed in `blocked` behind twenty
 * structural findings about semver and visibility strings — ceremony, not
 * judgment. `draftIncomeGraph` takes the sentence a founder already believes,
 * builds the smallest graph that can carry it, and leads with the refusal:
 * here is the claim in your own thesis that nothing supports, here is the
 * evidence that would settle it, and here is what getting that evidence costs
 * you in founder hours this week.
 *
 * Deterministic and pure: same text and same date in, same graph out. It
 * invents no evidence, no revenue, and no buyer — every value it had to assume
 * is returned in `assumptions` rather than hidden in the document.
 */

import { demandLanguage } from './adversarial.ts'
import { CURRENT_API_VERSION, type GraphEdge, type GraphNode, type IncomeGraph } from './model.ts'
import { normalize } from './text.ts'

export type UnsupportedClaim = {
  /** The founder's own words. */
  claim: string
  /** Where it now lives in the drafted graph. */
  path: string
  why: string
  /** The artifact that would end the argument. */
  evidenceThatWouldSettleIt: string
  /** Deterministic arithmetic on the method above — not an estimate of your speed. */
  costInFounderHours: number
}

export type IncomeGraphDraft = {
  graph: IncomeGraph
  /** Ordered: the claim the whole thesis rests on first. */
  unsupported: UnsupportedClaim[]
  /** Every value the draft had to invent to make a well-formed document. */
  assumptions: string[]
  /** One sentence to read before anything else. */
  headline: string
}

const MAX_LABEL = 90

function clip(text: string, max = MAX_LABEL): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}…`
}

function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

function slug(text: string): string {
  const base = normalize(text).split(' ').filter(Boolean).slice(0, 5).join('-').replace(/%/g, '')
  const clean = base.replace(/[^a-z0-9-]/g, '').replace(/^-+|-+$/g, '')
  return clean.length >= 2 ? clean.slice(0, 60) : 'untitled-thesis'
}

function addDays(iso: string, days: number): string {
  const date = new Date(`${iso}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

function firstMatch(text: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const match = pattern.exec(text)
    if (match?.[1]?.trim()) return match[1].trim().replace(/[,;:.]+$/, '')
  }
  return null
}

const CURRENCY_SYMBOLS: Record<string, string> = { '€': 'EUR', $: 'USD', '£': 'GBP' }

/** "brief for someone who does" is not a billing unit. Take the noun, stop at the clause. */
const UNIT_STOP_WORDS = new Set(['for', 'and', 'or', 'with', 'to', 'that', 'who', 'which', 'if', 'when', 'so', 'because', 'from', 'of', 'a', 'the', 'in'])

function unitWords(raw: string): string {
  const words: string[] = []
  for (const word of raw.toLowerCase().split(/\s+/).filter(Boolean)) {
    if (UNIT_STOP_WORDS.has(word) || words.length === 2) break
    words.push(word)
  }
  return words.join(' ') || 'unit'
}

function extractPrice(text: string): { currency: string; amount: number; unit: string } | null {
  const symbol = /([€$£])\s?(\d[\d.,]*)/.exec(text)
  const worded = /(\d[\d.,]*)\s?(eur|usd|gbp|euros?|dollars?|pounds?)\b/i.exec(text)
  let currency: string | null = null
  let raw: string | null = null
  if (symbol) {
    currency = CURRENCY_SYMBOLS[symbol[1]] ?? null
    raw = symbol[2]
  } else if (worded) {
    const word = worded[2].toLowerCase()
    currency = word.startsWith('eur') ? 'EUR' : word.startsWith('usd') || word.startsWith('dollar') ? 'USD' : 'GBP'
    raw = worded[1]
  }
  if (!currency || !raw) return null
  const amount = Number(raw.replace(/[.,](?=\d{3}\b)/g, '').replace(',', '.'))
  if (!Number.isFinite(amount) || amount <= 0) return null
  const unit = firstMatch(text, [/\bper ([a-z][a-z -]{2,30})/i, /\ba ([a-z][a-z -]{2,30}) (?:each|apiece)/i])
  return { currency, amount, unit: unit ? unitWords(unit) : 'unit' }
}

/** Evidence prescriptions. One method per claim shape, with its own arithmetic. */
const PRESCRIPTIONS = {
  willingness: {
    evidence:
      'Five recorded discovery calls in which the buyer names a price band before you do. Evidence kind: interview, n=5, source "interview:<name> <date>".',
    hours: 4,
  },
  price: {
    evidence:
      'One accepted quote at this price, or three refusals of it. Evidence kind: payment or listing, with the artifact path.',
    hours: 2,
  },
  volume: {
    evidence:
      'A count taken from a real list: how many names the channel actually holds and how many answered last time. Evidence kind: analytics.',
    hours: 2,
  },
  problem: {
    evidence:
      'Five interviews recording how the buyer handles this today, in their words, with dates. Evidence kind: interview, n=5.',
    hours: 3,
  },
  generic: {
    evidence:
      'A dated artifact a stranger could open: a URL, a file in the repository, or an interview record naming the person and the date.',
    hours: 1,
  },
} as const

function prescribe(claim: string): { evidence: string; hours: number } {
  const normalized = normalize(claim)
  if (/(pay|price|cost|charge|worth|budget)/.test(normalized)) {
    return /(\d)/.test(normalized) ? PRESCRIPTIONS.price : PRESCRIPTIONS.willingness
  }
  if (/(month|week|year|%|percent|customers|clients|leads)/.test(normalized)) return PRESCRIPTIONS.volume
  if (/(struggle|lose|problem|waste|slow|fail|cannot|nobody)/.test(normalized)) return PRESCRIPTIONS.problem
  return PRESCRIPTIONS.generic
}

/**
 * @param thesisText the founder's own sentence or paragraph.
 * @param options.today ISO date; the clock is never read here.
 */
export function draftIncomeGraph(
  thesisText: string,
  options: { today: string; principal?: string },
): IncomeGraphDraft {
  const thesis = clip(thesisText, 600)
  const today = options.today
  const principal = (options.principal ?? '').trim() || 'The founder'
  const id = slug(thesis)
  const lines = sentences(thesis)
  const assumptions: string[] = []

  const buyer =
    firstMatch(thesis, [
      /\bfor ([a-z][^.,;]{3,60})/i,
      /\b(?:sell|selling|offer|offering) (?:to|it to) ([a-z][^.,;]{3,60})/i,
      /^([A-Z][^.,;]{3,60}?) (?:want|need|lose|struggle|pay|will pay|cannot)/,
    ]) ?? null
  if (!buyer) assumptions.push('No buyer segment could be read from the thesis; the Customer node is a placeholder you must name.')

  const thing =
    firstMatch(thesis, [
      /\b(?:sell|selling|offer|offering|deliver|delivering|charge for) ([a-z][^.,;]{3,60})/i,
      /\bpay (?:me |us )?(?:per |for )([a-z][^.,;]{3,60})/i,
    ]) ?? null
  if (!thing) assumptions.push('No offer could be read from the thesis; the Offer node is a placeholder you must name.')

  const price = extractPrice(thesis)
  if (!price) assumptions.push('No price appears in the thesis, so the Offer has none and the graph cannot compute break-even.')

  const problemLine = lines.find((line) => /(because|lose|slow|waste|struggle|cannot|nobody|no one)/i.test(line)) ?? lines[0] ?? thesis
  const willingness = lines.find((line) => /(pay|price|buy|purchase|subscribe)/i.test(line)) ?? lines[0] ?? thesis

  assumptions.push('Founder time is set to 10 hours a month as a placeholder. Replace it with your own number before you trust break-even.')
  assumptions.push(`The kill review is set to ${addDays(today, 90)}, 90 days out. Move it if your thesis deserves less patience.`)

  const provenance = {
    source: `thesis:${id}`,
    date: today,
    method: 'drafted from the founder’s own sentence by draftIncomeGraph; nothing here is evidence',
  }

  const base = (over: Partial<GraphNode> & Pick<GraphNode, 'id' | 'type' | 'label' | 'evaluation'>): GraphNode => ({
    owner: principal,
    provenance,
    version: '0.1.0',
    visibility: 'private',
    ...over,
  })

  const edge = (
    over: Pick<GraphEdge, 'id' | 'type' | 'from' | 'to' | 'evaluation'>,
  ): GraphEdge => ({
    owner: principal,
    provenance,
    version: '0.1.0',
    visibility: 'private',
    ...over,
  })

  const nodes: GraphNode[] = [
    base({
      id: 'problem-1',
      type: 'Problem',
      label: clip(problemLine),
      evaluation: 'Ask five people in the segment how they handle this today. If none describes it as a problem worth money, this node is wrong.',
      data: { description: problemLine },
    }),
    base({
      id: 'customer-1',
      type: 'Customer',
      label: buyer ? clip(buyer) : 'Buyer segment not yet named',
      evaluation: 'Ten conversations. If fewer than three recognise themselves in this description, the segment is wrong.',
      data: { demandClaim: clip(willingness, 240) },
    }),
    base({
      id: 'offer-1',
      type: 'Offer',
      label: thing ? clip(thing) : 'Offer not yet named',
      evaluation: 'The buyer accepts the delivered work without rewriting it.',
      data: price ? { price } : {},
    }),
    base({
      id: 'channel-1',
      type: 'Channel',
      label: 'How this buyer finds out you exist — not yet chosen',
      evaluation: 'Twenty contacts through this channel produce at least two conversations, or it does not reach this buyer.',
    }),
    base({
      id: 'workflow-1',
      type: 'Workflow',
      label: 'Request to delivered work',
      evaluation: 'Ten requests run end to end with no step completed outside its stated actor and no gate bypassed.',
      data: {
        steps: [
          { id: 'intake', action: 'Structure the incoming request', irreversible: false, actor: 'agent' },
          { id: 'draft', action: 'Produce the work against the stated acceptance checks', irreversible: false, actor: 'agent' },
          { id: 'review', action: 'Read the draft against the acceptance checks', irreversible: false, actor: 'human' },
          { id: 'deliver', action: 'Send the finished work to the customer', irreversible: true, actor: 'agent' },
        ],
      },
    }),
    base({
      id: 'role-1',
      type: 'AgentRole',
      label: 'Drafting agent',
      evaluation: 'Read the run log weekly. Any action outside allowedActions revokes the role until the cause is fixed.',
      data: {
        allowedActions: ['structure-request', 'produce-draft'],
        deniedActions: ['sign-contract', 'change-price', 'transfer-funds', 'increase-budget'],
      },
    }),
    base({
      id: 'human-1',
      type: 'Human',
      label: principal,
      evaluation: 'This person can be reached and does release gates within a working day.',
      data: { role: 'founder' },
    }),
    base({
      id: 'gate-1',
      type: 'HumanGate',
      label: 'Release before anything reaches the customer',
      evaluation: 'Every delivery has a recorded release by the named approver, timestamped before delivery.',
      data: { gatedStepIds: ['deliver'], approver: principal },
    }),
    base({
      id: 'cost-founder-time',
      type: 'Cost',
      label: 'Founder review and release time',
      evaluation: 'Time the next ten releases. The placeholder is wrong until you have measured it.',
      data: { founderMinutesPerMonth: 600, borneByBuyer: false },
    }),
    base({
      id: 'kill-1',
      type: 'KillCriterion',
      label: 'No paid order after the first ten conversations',
      evaluation: 'Checked on the review date against paid invoices only. Interest, replies, and calls do not count.',
      data: { threshold: 'Zero paid orders after ten completed conversations', reviewBy: addDays(today, 90) },
    }),
  ]

  const edges: GraphEdge[] = [
    edge({ id: 'e-customer-problem', type: 'suffers', from: 'customer-1', to: 'problem-1', evaluation: 'Drop the edge if conversations describe a different bottleneck.' }),
    edge({ id: 'e-offer-customer', type: 'serves', from: 'offer-1', to: 'customer-1', evaluation: 'The buyer accepts the work without rewriting it.' }),
    edge({ id: 'e-channel-customer', type: 'reaches', from: 'channel-1', to: 'customer-1', evaluation: 'Twenty contacts produce two conversations.' }),
    edge({ id: 'e-workflow-offer', type: 'fulfills', from: 'workflow-1', to: 'offer-1', evaluation: 'Ten requests run end to end without a gate bypass.' }),
    edge({ id: 'e-role-workflow', type: 'performs', from: 'role-1', to: 'workflow-1', evaluation: 'Weekly run-log read against allowedActions.' }),
    edge({ id: 'e-gate-workflow', type: 'gates', from: 'gate-1', to: 'workflow-1', evaluation: 'Every delivery has a timestamped release.' }),
    edge({ id: 'e-workflow-cost', type: 'incurs', from: 'workflow-1', to: 'cost-founder-time', evaluation: 'Time the next ten releases.' }),
    edge({ id: 'e-kill-offer', type: 'retires', from: 'kill-1', to: 'offer-1', evaluation: 'Checked on the review date against paid invoices only.' }),
  ]

  const graph: IncomeGraph = {
    apiVersion: CURRENT_API_VERSION,
    kind: 'IncomeGraph',
    metadata: {
      id,
      name: clip(lines[0] ?? thesis, 80),
      version: '0.1.0',
      updatedAt: today,
      principal,
      thesis,
    },
    nodes,
    edges,
  }

  const unsupported: UnsupportedClaim[] = []
  const push = (claim: string, path: string, why: string) => {
    if (unsupported.some((u) => u.claim === claim && u.path === path)) return
    const { evidence, hours } = prescribe(claim)
    unsupported.push({ claim, path, why, evidenceThatWouldSettleIt: evidence, costInFounderHours: hours })
  }

  push(
    clip(willingness, 240),
    '/nodes/customer-1/data/demandClaim',
    'This is the claim the whole thesis rests on: that this buyer pays for this. Nothing in the graph attests it.',
  )
  if (price) {
    push(
      `${price.currency} ${price.amount} per ${price.unit}`,
      '/nodes/offer-1/data/price',
      'A price is a claim about what someone will hand over. It needs evidence like any other.',
    )
  }
  for (const line of lines) {
    const matched = demandLanguage(line)
    if (matched.length > 0) {
      push(clip(line, 240), '/metadata/thesis', `Demand language with nothing behind it: ${matched.join(', ')}.`)
    }
  }

  const headline =
    unsupported.length === 0
      ? 'Nothing in this thesis asserts demand yet, which means it also does not yet claim anyone will pay. Say what you believe someone will buy.'
      : `${unsupported.length} claim${unsupported.length === 1 ? '' : 's'} in your own sentence ${
          unsupported.length === 1 ? 'has' : 'have'
        } nothing behind ${unsupported.length === 1 ? 'it' : 'them'}. The first one is the thesis: "${unsupported[0].claim}". ${
          unsupported[0].evidenceThatWouldSettleIt
        } That is about ${unsupported.reduce((sum, u) => sum + u.costInFounderHours, 0)} founder hours of work, and it is the cheapest thing you can do this week.`

  return { graph, unsupported, assumptions, headline }
}
