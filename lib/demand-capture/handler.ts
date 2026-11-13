import type { DemandSignal, PriceBand, Stage, Urgency, WaitlistState } from './types'
import { addToAudience, getCount, isKvConfigured, joinSignal } from './store'

export interface ProductConfig {
  id: string
  stage: Stage
  waitlist: {
    enabled: boolean
    publicCountThreshold: number
    foundingCohort: number
    /**
     * A person has confirmed who owns this list, how an address is removed, and that the consent
     * wording is true. Storage being reachable proves persistence only, so a missing or false value
     * keeps the list closed. Default closed.
     */
    ownerConfirmed?: boolean
  }
}

/** Open only when the product enables it, a human confirmed the list owner, and the store is configured. */
export const isWaitlistOpen = (product: ProductConfig): boolean =>
  product.waitlist.enabled === true && product.waitlist.ownerConfirmed === true && isKvConfigured()

export const CLOSED_MESSAGE = 'The waitlist is not open yet. Nothing was recorded.'

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

const UTM_KEY = /^utm_[a-z0-9_]{1,32}$/i

/**
 * Campaign parameters from the request URL, then from the body: either a `utm` object or flat
 * `utm_*` keys. The URL wins when both name the same key. At most 8, keys and values bounded.
 */
export function readUtm(url: URL, body: Record<string, unknown>): Record<string, string> | undefined {
  const out: Record<string, string> = {}
  const add = (k: string, v: unknown) => {
    const value = clip(v, 200)
    if (value && UTM_KEY.test(k) && (k in out || Object.keys(out).length < 8)) out[k] = value
  }
  for (const [k, v] of url.searchParams.entries()) add(k, v)
  const fromBody: [string, unknown][] = Object.entries(body).filter(([k]) => k.startsWith('utm_'))
  if (body.utm && typeof body.utm === 'object' && !Array.isArray(body.utm)) fromBody.unshift(...Object.entries(body.utm))
  for (const [k, v] of fromBody) if (!(k in out)) add(k, v)
  return Object.keys(out).length ? out : undefined
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
export function publicState(product: ProductConfig, count: number | null, position?: number): WaitlistState {
  const { publicCountThreshold, foundingCohort } = product.waitlist
  return {
    productId: product.id,
    count,
    position,
    publicCount: count !== null && count >= publicCountThreshold ? count : null,
    foundingCohort,
    foundingSeatsLeft: count === null ? null : count < foundingCohort ? foundingCohort - count : 0,
    stage: product.stage,
  }
}

export async function handleJoin(product: ProductConfig, body: Record<string, unknown>, req: Request) {
  if (!product.waitlist.enabled) return { status: 404 as const, body: { error: 'No waitlist for this product' } }
  if (!isWaitlistOpen(product)) return { status: 503 as const, body: { open: false as const, error: CLOSED_MESSAGE } }

  const email = clip(body.email, MAX.email)?.toLowerCase()
  if (!email || !EMAIL_RE.test(email)) return { status: 400 as const, body: { error: 'Valid email required' } }
  if (body.consent !== true) return { status: 400 as const, body: { error: 'Consent required' } }

  const answers = readAnswers(body)
  const now = new Date().toISOString()
  const url = new URL(req.url)
  const fresh: Omit<DemandSignal, 'position'> = {
    productId: product.id,
    email,
    ...answers,
    source: clip(body.source, MAX.source) ?? url.pathname,
    referrer: clip(req.headers.get('referer'), MAX.source),
    utm: readUtm(url, body),
    createdAt: now,
    consent: true,
  }
  // Claim the position and create-or-merge the signal in one atomic store call: both are recorded or
  // neither, so a failed join never leaves a position or a count increment behind. A known address
  // keeps its first-touch source, referrer, utm and createdAt; supplied answers replace stored ones;
  // a re-join that brings nothing new writes nothing. This throws before anything is stored, so a
  // failure here is a real "not saved".
  const answerFields = Object.fromEntries(Object.entries(answers).filter(([, v]) => v !== undefined)) as Record<string, string>
  const saved = await joinSignal(fresh, answerFields, now)

  // From here the address is stored. A failure below must not be reported as "nothing saved":
  // log it and answer with what is true.
  let partial = false
  if (!(await addToAudience(email, answers.name ?? saved.name, product.id))) partial = true

  let count: number | null = null
  try {
    count = await getCount(product.id)
  } catch (err) {
    partial = true
    console.error(`demand-capture: count read failed after save for ${product.id}`, err)
  }

  const state = publicState(product, count, saved.position)
  return { status: 200 as const, body: partial ? { ...state, partial: true as const } : state }
}

export async function handleState(product: ProductConfig) {
  if (!isWaitlistOpen(product)) return { status: 200 as const, body: { open: false as const, productId: product.id } }
  const count = await getCount(product.id)
  return { status: 200 as const, body: { open: true as const, ...publicState(product, count) } }
}
