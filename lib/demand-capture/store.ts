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

/**
 * Claim the position and create-or-merge the signal in ONE EVAL, so a join either records both or
 * neither. Claiming first and writing second left a failed write holding a position and a count
 * increment with no signal behind it. Everything that can fail (decoding the inputs) runs before the
 * first write, and the same script serialises overlapping requests for one address, so each keeps
 * its own answers instead of the later write replacing the earlier one.
 *
 *   KEYS[1] positions hash   KEYS[2] count   KEYS[3] signals hash
 *   ARGV[1] email   ARGV[2] the new signal as JSON, without position (used only when none is stored)
 *   ARGV[3] answers as JSON (only the fields supplied and valid)   ARGV[4] now
 *
 * Returns the stored record as JSON. A known address keeps its recorded position; with no new
 * answers it is returned untouched and nothing is written. A stored signal that does not parse is
 * replaced, as getSignal treats it as absent. A stored position that is not a number is replaced.
 */
export const JOIN_SCRIPT = [
  'local fresh = cjson.decode(ARGV[2])',
  'local answers = cjson.decode(ARGV[3])',
  "local raw = redis.call('HGET', KEYS[3], ARGV[1])",
  'local stored = nil',
  'if raw then',
  '  local ok, decoded = pcall(cjson.decode, raw)',
  "  if ok and type(decoded) == 'table' then stored = decoded end",
  'end',
  "local position = tonumber(redis.call('HGET', KEYS[1], ARGV[1]))",
  'local claimed = false',
  'if not position then',
  "  position = redis.call('INCR', KEYS[2])",
  "  redis.call('HSET', KEYS[1], ARGV[1], position)",
  '  claimed = true',
  'end',
  'if not stored then',
  '  fresh.position = position',
  '  local created = cjson.encode(fresh)',
  "  redis.call('HSET', KEYS[3], ARGV[1], created)",
  '  return created',
  'end',
  "local fields = {'name', 'role', 'pain', 'urgency', 'priceBand', 'alternative'}",
  'local changed = false',
  'for _, field in ipairs(fields) do',
  '  if answers[field] ~= nil then',
  '    stored[field] = answers[field]',
  '    changed = true',
  '  end',
  'end',
  'if not changed then return raw end',
  'stored.position = position',
  'stored.consent = true',
  'stored.updatedAt = ARGV[4]',
  'local merged = cjson.encode(stored)',
  "redis.call('HSET', KEYS[3], ARGV[1], merged)",
  'return merged',
].join('\n')

export async function joinSignal(
  signal: Omit<DemandSignal, 'position'>,
  answers: Record<string, string | undefined>,
  now: string,
): Promise<DemandSignal> {
  const raw = await kv([
    'eval',
    JOIN_SCRIPT,
    '3',
    key(signal.productId, 'positions'),
    key(signal.productId, 'count'),
    key(signal.productId, 'signals'),
    signal.email,
    JSON.stringify(signal),
    JSON.stringify(answers),
    now,
  ])
  let saved: DemandSignal | null = null
  try {
    saved = JSON.parse(String(raw)) as DemandSignal
  } catch {
    saved = null
  }
  // A position is shown to the person who joined. If the store did not return one, say so.
  if (!saved || !Number.isInteger(saved.position) || saved.position < 1) throw new Error('KV on EVAL: join returned no record')
  return saved
}

export async function allSignals(productId: string): Promise<DemandSignal[]> {
  const raw = (await kv(['hgetall', key(productId, 'signals')])) as unknown[] | null
  if (!raw) return []
  const values = Array.isArray(raw) ? raw.filter((_, i) => i % 2 === 1) : Object.values(raw)
  return values.map((v) => JSON.parse(String(v)) as DemandSignal)
}

/**
 * Non-fatal: a Resend outage must not cost us the signal we already stored, so this never throws.
 * Returns false when a sync was attempted and failed (so the caller can report a partial success),
 * true when it succeeded or none is configured.
 */
export async function addToAudience(email: string, name: string | undefined, productId: string): Promise<boolean> {
  const resendKey = process.env.RESEND_API_KEY
  const audience = audienceFor(productId)
  if (!resendKey || !audience) return true
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
      return false
    }
    return true
  } catch (err) {
    // The signal is already in KV. Nothing reconciles this later, so the failure must be visible
    // in the logs or it is lost.
    console.error(`demand-capture: audience sync failed for ${productId}`, err)
    return false
  }
}
