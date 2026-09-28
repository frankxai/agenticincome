/**
 * Quote for one agent call. Report only: this module cannot turn a call on.
 * A key, an auto-pay flag, or a caller's "ready" bit is refused. The income
 * graph decides who pays. A sealed ledger would have to confirm the cap.
 */

import { reviewIncomeGraph } from './index.ts'
import type { IncomeGraph } from './model.ts'

export type AgentCallQuote = {
  /** Always false. A quote is not permission to run or to spend. */
  executable: false
  disposition: 'quote' | 'refuse'
  payer: 'calling-agent' | 'buyer' | 'none'
  offerId: string
  reason: string
  price: { currency: string; amount: number; unit: string } | null
  protocol: string | null
  asset: string | null
  chain: string | null
  /** Model, host, and facilitator costs the operator eats. */
  operatorPaysRuntime: { monthly: number; once: number }
  /** Costs the graph says the buyer pays, which must already be disclosed. */
  buyerPaysRuntime: { monthly: number; once: number }
}

const BANNED_KEY = /^(privatekey|seedphrase|mnemonic|walletkey|apikey|secret|autopay|execute|ready|approved|authorization)$/

export function quoteAgentCall(graph: IncomeGraph, today: string, request: unknown): AgentCallQuote {
  const empty = blank('')
  const banned = bannedPaths(request)
  if (banned.length > 0) {
    return { ...empty, reason: `Refused. The request carries a key or a self-approval: ${banned.join(', ')}.` }
  }
  if (!isObject(request) || typeof request.offerId !== 'string' || !request.offerId.trim()) {
    return { ...empty, reason: 'Refused. Name the offer id.' }
  }
  const offerId = request.offerId
  if (typeof request.task === 'string' && /ignore previous|system prompt|you are now/i.test(request.task)) {
    return { ...blank(offerId), reason: 'Refused. The task is an instruction, not a job.' }
  }

  const report = reviewIncomeGraph(graph, today)
  const verdict = report.settlements.find((item) => item.offerId === offerId)
  const offer = graph.nodes?.find((node) => node.id === offerId && node.type === 'Offer')
  const runtime = runtimeSplit(graph)
  if (!verdict || !offer) {
    return { ...blank(offerId), ...runtime, reason: `Refused. No offer "${offerId}".` }
  }
  if (!verdict.admitted || report.findings.some((finding) => finding.severity === 'error' && finding.path.includes(offerId))) {
    return {
      ...blank(offerId),
      ...runtime,
      reason: `Refused. ${verdict.because}`,
    }
  }

  const price = offer.data?.price
  const priced =
    price && typeof price.amount === 'number'
      ? { currency: price.currency, amount: price.amount, unit: price.unit }
      : null
  const settlement = offer.data?.settlement
  const cap = settlement?.spendCap?.amount
  if (verdict.rail === 'machine-payment' && typeof request.claimedRemaining === 'number' && priced && request.claimedRemaining < priced.amount) {
    return {
      ...blank(offerId),
      ...runtime,
      price: priced,
      reason: 'Refused. The claimed remaining cap is below the price. A person has to raise the cap.',
    }
  }

  const payer = verdict.rail === 'machine-payment' ? 'calling-agent' : 'buyer'
  const reason =
    verdict.rail === 'machine-payment'
      ? 'Quote only. Their agent would pay this price in a stablecoin. You still pay the model. The endpoint stays off until a fiat offer on this graph is activated.'
      : verdict.rail === 'on-chain-right'
        ? 'Quote only. The buyer pays for the right. A person signs the registration. The agent does not.'
        : 'Quote only. The buyer pays in a merchant account. You pay the runtime unless a cost says the buyer bears it.'

  return {
    executable: false,
    disposition: 'quote',
    payer,
    offerId,
    reason,
    price: priced,
    protocol: settlement?.protocol ?? null,
    asset: settlement?.asset ?? null,
    chain: settlement?.chain ?? null,
    ...runtime,
  }
}

function blank(offerId: string): AgentCallQuote {
  return {
    executable: false,
    disposition: 'refuse',
    payer: 'none',
    offerId,
    reason: '',
    price: null,
    protocol: null,
    asset: null,
    chain: null,
    operatorPaysRuntime: { monthly: 0, once: 0 },
    buyerPaysRuntime: { monthly: 0, once: 0 },
  }
}

function runtimeSplit(graph: IncomeGraph): Pick<AgentCallQuote, 'operatorPaysRuntime' | 'buyerPaysRuntime'> {
  const operator = { monthly: 0, once: 0 }
  const buyer = { monthly: 0, once: 0 }
  for (const node of graph.nodes ?? []) {
    if (node.type !== 'Cost') continue
    const amount = node.data?.amount
    if (!amount || typeof amount.amount !== 'number') continue
    const pot = node.data?.borneByBuyer === true ? buyer : operator
    if (amount.period === 'once') pot.once += amount.amount
    else if (amount.period === 'monthly') pot.monthly += amount.amount
    else if (amount.period === 'yearly') pot.monthly += amount.amount / 12
  }
  return { operatorPaysRuntime: operator, buyerPaysRuntime: buyer }
}

function bannedPaths(value: unknown, path = ''): string[] {
  if (!isObject(value)) return []
  const out: string[] = []
  for (const [key, child] of Object.entries(value)) {
    const here = path ? `${path}.${key}` : key
    if (BANNED_KEY.test(key.toLowerCase().replace(/[^a-z]/g, ''))) out.push(here)
    if (typeof child === 'string' && /0x[a-fA-F0-9]{32,}/.test(child)) out.push(here)
    out.push(...bannedPaths(child, here))
  }
  return out
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
