import type { DemandSignal, PriceBand, Stage, Urgency, WaitlistState } from './types'
import { addToAudience, claimPosition, getCount, getSignal, saveSignal } from './store'

export interface ProductConfig {
  id: string
  stage: Stage
  waitlist: { enabled: boolean; publicCountThreshold: number; foundingCohort: number }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX = { email: 320, name: 100, pain: 400, alternative: 200, source: 160 }

/** Trimmed and capped. Blank counts as absent, so an emptied field never erases a stored answer. */
const clip = (v: unknown, n: number) => {
  if (typeof v !== 'string') return undefined
  const value = v.trim().slice(0, n)
  return value.length ? value : undefined
}

const URGENCIES: Urgency[] = ['now', 'this-quarter', 'exploring']
const BANDS: PriceBand[] = ['free-only', 'under-25', '25-99', '100-299', '300-999', 'over-1000', 'company-pays']
const oneOf = <T extends string>(v: unknown, allowed: T[]) =>
  typeof v === 'string' && (allowed as string[]).includes(v) ? (v as T) : undefined

/** The step-2 answers (and name). Every field optional, every field validated. */
export type Answers = Pick<DemandSignal, 'name' | 'role' | 'pain' | 'urgency' | 'priceBand' | 'alternative'>

export function readAnswers(body: Record<string, unknown>): Answers {
  return {
    name: clip(body.name, MAX.name),
    role: clip(body.role, MAX.name),
    pain: clip(body.pain, MAX.pain),
    urgency: oneOf(body.urgency, URGENCIES),
    priceBand: oneOf(body.priceBand, BANDS),
    alternative: clip(body.alternative, MAX.alternative),
  }
}

const hasAnswers = (answers: Answers) => Object.values(answers).some((v) => v !== undefined)

/**
 * A known address updates in place instead of being rebuilt from the latest request. The form
 * posts twice (email first, answers second) and people come back later, so rebuilding meant the
 * answers post rewrote `source` to the API path and a later re-join erased every answer.
 *   answers      a new value replaces the stored one; a missing or blank one keeps it
 *   first touch  source, referrer, utm and createdAt stay as they were at the first join
 *   position     from the claim, which returns the recorded position for a known address
 */
export function mergeSignal(existing: DemandSignal, answers: Answers, position: number, now: string): DemandSignal {
  return {
    ...existing,
    name: answers.name ?? existing.name,
    role: answers.role ?? existing.role,
    pain: answers.pain ?? existing.pain,
    urgency: answers.urgency ?? existing.urgency,
    priceBand: answers.priceBand ?? existing.priceBand,
    alternative: answers.alternative ?? existing.alternative,
    position,
    consent: true,
    updatedAt: now,
  }
}

/**
 * A count below the product's threshold is withheld, never rounded up or
 * estimated. Publishing "join 12 others" reads worse than publishing nothing,
 * and inventing a number is the one thing that would cost us the brand.
 */
export function publicState(product: ProductConfig, count: number, position?: number): WaitlistState {
  const { publicCountThreshold, foundingCohort } = product.waitlist
  return {
    productId: product.id,
    count,
    position,
    publicCount: count >= publicCountThreshold ? count : null,
    foundingCohort,
    foundingSeatsLeft: count < foundingCohort ? foundingCohort - count : 0,
    stage: product.stage,
  }
}

export async function handleJoin(product: ProductConfig, body: Record<string, unknown>, req: Request) {
  if (!product.waitlist.enabled) return { status: 404 as const, body: { error: 'No waitlist for this product' } }

  const email = clip(body.email, MAX.email)?.toLowerCase()
  if (!email || !EMAIL_RE.test(email)) return { status: 400 as const, body: { error: 'Valid email required' } }
  if (body.consent !== true) return { status: 400 as const, body: { error: 'Consent required' } }

  const position = await claimPosition(product.id, email)
  const existing = await getSignal(product.id, email)
  const answers = readAnswers(body)
  const now = new Date().toISOString()

  if (!existing) {
    const url = new URL(req.url)
    const utm = Object.fromEntries(
      [...url.searchParams.entries()].filter(([k]) => k.startsWith('utm_')).slice(0, 8),
    )
    const signal: DemandSignal = {
      productId: product.id,
      email,
      ...answers,
      source: clip(body.source, MAX.source) ?? url.pathname,
      referrer: clip(req.headers.get('referer'), MAX.source),
      utm: Object.keys(utm).length ? utm : undefined,
      position,
      createdAt: now,
      consent: true,
    }
    await saveSignal(signal)
  } else if (hasAnswers(answers)) {
    await saveSignal(mergeSignal(existing, answers, position, now))
  }
  // A re-join that brings nothing new writes nothing. There is nothing to update, and not writing
  // means it cannot race an answers post from the same person and put the older record back.

  await addToAudience(email, answers.name ?? existing?.name, product.id)

  const count = await getCount(product.id)
  return { status: 200 as const, body: publicState(product, count, position) }
}

export async function handleState(product: ProductConfig) {
  const count = await getCount(product.id)
  return { status: 200 as const, body: publicState(product, count) }
}
