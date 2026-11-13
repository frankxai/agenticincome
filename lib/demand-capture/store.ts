import type { DemandSignal } from './types'

/**
 * Talks to Vercel KV and Resend over plain REST so this package installs into
 * any of the estate properties with zero new dependencies.
 */

/**
 * The Vercel KV marketplace product injects KV_REST_API_*; the legacy Upstash integration injects
 * UPSTASH_REDIS_REST_*. Same REST protocol, so either pair works, and KV_REST_API_* wins when both
 * are complete. A pair is used whole or not at all: a URL from one store with the token of another
 * fails as a confusing 401, so a half-set pair is skipped rather than mixed. Read on every call, so
 * a deployment never keeps serving a value it cached as missing at module load.
 */
const ENV_PAIRS = [
  ['KV_REST_API_URL', 'KV_REST_API_TOKEN'],
  ['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'],
] as const

function kvConfig(): { url: string; token: string } | null {
  for (const [urlName, tokenName] of ENV_PAIRS) {
    const url = process.env[urlName]?.trim()
    const token = process.env[tokenName]?.trim()
    if (url && token) return { url, token }
  }
  return null
}

/** For a page that shows "not open yet" instead of a form whose signup could not be recorded. */
export const isKvConfigured = (): boolean => kvConfig() !== null

/** Thrown before any request is made. The message is unchanged from earlier versions. */
export class KvNotConfiguredError extends Error {
  readonly code = 'E_KV_NOT_CONFIGURED'
  constructor() {
    super('KV not configured')
    this.name = 'KvNotConfiguredError'
  }
}

/**
 * A product promises its list "nothing from any other list". That only holds
 * with one audience per product, so RESEND_AUDIENCE_ID__<PRODUCT_ID> wins
 * over the shared RESEND_AUDIENCE_ID when it is set.
 */
const audienceFor = (productId: string) =>
  process.env['RESEND_AUDIENCE_ID__' + productId.toUpperCase().replace(/-/g, '_')] ?? process.env.RESEND_AUDIENCE_ID

const key = (productId: string, suffix: string) => `waitlist:${productId}:${suffix}`

type KvReply = { result?: unknown; error?: unknown }

/**
 * Upstash answers `{ result }` on success and `{ error }` on failure. The error usually arrives
 * with a 4xx, but the body is checked even on HTTP 200: reading an error envelope as a success is
 * how a failed write reports a position that was never stored. A reply carrying neither field is
 * refused too, because `undefined` would otherwise read as "key not found". Messages name the
 * command only, never its arguments, which carry email addresses.
 */
async function kv(command: unknown[]): Promise<unknown> {
  const config = kvConfig()
  if (!config) throw new KvNotConfiguredError()
  const name = String(command[0]).toUpperCase()
  const res = await fetch(config.url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
    cache: 'no-store',
  })
  let reply: KvReply | null = null
  try {
    const parsed: unknown = await res.json()
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) reply = parsed as KvReply
  } catch {
    reply = null
  }
  if (reply && reply.error != null) throw new Error(`KV ${res.status} on ${name}: ${String(reply.error).slice(0, 200)}`)
  if (!res.ok) throw new Error(`KV ${res.status} on ${name}`)
  if (!reply || !('result' in reply)) throw new Error(`KV ${res.status} on ${name}: reply carried no result`)
  return reply.result
}

/**
 * Email is the identity, so a re-submit returns the recorded position instead of taking a new one.
 *
 * One EVAL: the lookup, the increment and the record run with nothing in between, so two joins for
 * the same address can no longer both miss the lookup and take two positions. Nothing is reserved
 * ahead of the increment either, so there is no placeholder for a failed call to strand or for a
 * racing call to read as a number. A lost response is safe to retry: the retry finds the recorded
 * position. A stored value that is not a number is treated as unclaimed and replaced, never reported.
 */
export const CLAIM_POSITION_SCRIPT = [
  "local existing = tonumber(redis.call('HGET', KEYS[1], ARGV[1]))",
  'if existing then return existing end',
  "local position = redis.call('INCR', KEYS[2])",
  "redis.call('HSET', KEYS[1], ARGV[1], position)",
  'return position',
].join('\n')

export async function claimPosition(productId: string, email: string): Promise<number> {
  const raw = await kv(['eval', CLAIM_POSITION_SCRIPT, '2', key(productId, 'positions'), key(productId, 'count'), email])
  const position = Number(raw)
  // A position is shown to the person who joined. If the store did not return one, say so; never make one up.
  if (!Number.isInteger(position) || position < 1) throw new Error('KV on EVAL: claim returned no position')
  return position
}

export async function getCount(productId: string): Promise<number> {
  const raw = await kv(['get', key(productId, 'count')])
  return raw ? Number(raw) : 0
}

/** The stored signal for one address, or null. A record that no longer parses is logged and treated as absent. */
export async function getSignal(productId: string, email: string): Promise<DemandSignal | null> {
  const raw = await kv(['hget', key(productId, 'signals'), email])
  if (typeof raw !== 'string' || !raw) return null
  try {
    return JSON.parse(raw) as DemandSignal
  } catch {
    console.error(`demand-capture: unreadable signal record for ${productId}`)
    return null
  }
}

export async function saveSignal(signal: DemandSignal): Promise<void> {
  await kv(['hset', key(signal.productId, 'signals'), signal.email, JSON.stringify(signal)])
}

export async function allSignals(productId: string): Promise<DemandSignal[]> {
  const raw = (await kv(['hgetall', key(productId, 'signals')])) as unknown[] | null
  if (!raw) return []
  const values = Array.isArray(raw) ? raw.filter((_, i) => i % 2 === 1) : Object.values(raw)
  return values.map((v) => JSON.parse(String(v)) as DemandSignal)
}

/** Non-fatal: a Resend outage must not cost us the signal we already stored. */
export async function addToAudience(email: string, name: string | undefined, productId: string) {
  const resendKey = process.env.RESEND_API_KEY
  const audience = audienceFor(productId)
  if (!resendKey || !audience) return
  try {
    const res = await fetch(`https://api.resend.com/audiences/${audience}/contacts`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        first_name: name?.split(' ')[0],
        unsubscribed: false,
        properties: { waitlist: productId },
      }),
    })
    if (!res.ok) {
      console.error(`demand-capture: audience sync ${res.status} for ${productId}: ${await res.text()}`)
    }
  } catch (err) {
    // The signal is already in KV. Nothing reconciles this later, so the failure must be visible
    // in the logs or it is lost.
    console.error(`demand-capture: audience sync failed for ${productId}`, err)
  }
}
