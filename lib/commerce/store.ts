import { kvCredentials } from './config.ts'
import type { CommerceEnv } from './types.ts'

/**
 * Fulfillment store. One call — `applyEvent` — records the provider event id
 * AND applies its entitlement effect atomically, so a retried or duplicated
 * webhook can never grant twice, and a crash can never leave an event marked
 * processed without its grant.
 *
 * The repo has no KV dependency, so two implementations live here:
 *   - MemoryCommerceStore: tests and local dev only (not durable).
 *   - UpstashCommerceStore: Upstash Redis REST (Vercel Marketplace "KV"),
 *     one Lua script per event = one atomic transaction. Enabled only when
 *     KV_REST_API_URL + KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_URL +
 *     UPSTASH_REDIS_REST_TOKEN) are set. No new npm dependency: plain fetch.
 *
 * With neither configured, `commerceStoreFromEnv` returns null and the
 * webhook answers 503 so Stripe keeps retrying instead of events being lost.
 */

export type EntitlementStatus = 'active' | 'revoked'

export type Entitlement = {
  transactionId: string
  sku: string
  entitlement: string
  email: string | null
  amount: number
  currency: string
  status: EntitlementStatus
  grantedBy: string
  revokedBy: string | null
  deliveredAt: string | null
}

export type StoreMutation =
  /** Grant unless a refund/dispute tombstone exists or it is already granted. */
  | { op: 'grant'; transactionId: string; entitlement: Omit<Entitlement, 'status' | 'revokedBy' | 'deliveredAt'> }
  /** Write a tombstone (even with no grant yet) and revoke any existing grant. */
  | { op: 'revoke'; transactionId: string; reason: 'refund' | 'dispute' }
  /** Record the event only (pending, failed, partial refund). */
  | { op: 'record'; transactionId: string }

export type ApplyOutcome =
  | 'duplicate'
  | 'granted'
  | 'already_granted'
  | 'blocked_by_tombstone'
  | 'revoked'
  | 'tombstoned'
  | 'recorded'

export interface CommerceStore {
  applyEvent(eventId: string, mutation: StoreMutation): Promise<ApplyOutcome>
  getEntitlement(transactionId: string): Promise<Entitlement | null>
  markDelivered(transactionId: string, at: string): Promise<void>
}

const KEY_PREFIX = 'commerce:v1'
export const eventKey = (eventId: string) => `${KEY_PREFIX}:event:${eventId}`
export const entitlementKey = (transactionId: string) => `${KEY_PREFIX}:entitlement:${transactionId}`
export const tombstoneKey = (transactionId: string) => `${KEY_PREFIX}:tombstone:${transactionId}`

export class MemoryCommerceStore implements CommerceStore {
  readonly events = new Map<string, string>()
  readonly entitlements = new Map<string, Entitlement>()
  readonly tombstones = new Map<string, string>()

  async applyEvent(eventId: string, mutation: StoreMutation): Promise<ApplyOutcome> {
    // Synchronous body = atomic within one Node process.
    if (this.events.has(eventId)) return 'duplicate'
    let outcome: ApplyOutcome = 'recorded'
    const existing = this.entitlements.get(mutation.transactionId)
    if (mutation.op === 'grant') {
      if (this.tombstones.has(mutation.transactionId)) outcome = 'blocked_by_tombstone'
      else if (existing) outcome = 'already_granted'
      else {
        this.entitlements.set(mutation.transactionId, {
          ...mutation.entitlement,
          status: 'active',
          revokedBy: null,
          deliveredAt: null,
        })
        outcome = 'granted'
      }
    } else if (mutation.op === 'revoke') {
      this.tombstones.set(mutation.transactionId, `${mutation.reason}:${eventId}`)
      if (existing) {
        this.entitlements.set(mutation.transactionId, { ...existing, status: 'revoked', revokedBy: eventId })
        outcome = 'revoked'
      } else outcome = 'tombstoned'
    }
    this.events.set(eventId, mutation.op)
    return outcome
  }

  async getEntitlement(transactionId: string): Promise<Entitlement | null> {
    return this.entitlements.get(transactionId) ?? null
  }

  async markDelivered(transactionId: string, at: string): Promise<void> {
    const existing = this.entitlements.get(transactionId)
    if (existing) this.entitlements.set(transactionId, { ...existing, deliveredAt: at })
  }
}

/**
 * KEYS: 1 event, 2 entitlement (hash), 3 tombstone.
 * ARGV: 1 op, 2 event id, 3 reason, 4.. entitlement field/value pairs (grant).
 * Runs as one Redis script: all writes or none.
 */
export const APPLY_EVENT_SCRIPT = `
if redis.call('EXISTS', KEYS[1]) == 1 then return 'duplicate' end
local outcome = 'recorded'
if ARGV[1] == 'grant' then
  if redis.call('EXISTS', KEYS[3]) == 1 then outcome = 'blocked_by_tombstone'
  elseif redis.call('EXISTS', KEYS[2]) == 1 then outcome = 'already_granted'
  else
    local fields = {}
    for i = 4, #ARGV do fields[#fields + 1] = ARGV[i] end
    redis.call('HSET', KEYS[2], unpack(fields))
    outcome = 'granted'
  end
elseif ARGV[1] == 'revoke' then
  redis.call('SET', KEYS[3], ARGV[3] .. ':' .. ARGV[2])
  if redis.call('EXISTS', KEYS[2]) == 1 then
    redis.call('HSET', KEYS[2], 'status', 'revoked', 'revokedBy', ARGV[2])
    outcome = 'revoked'
  else outcome = 'tombstoned' end
end
redis.call('SET', KEYS[1], ARGV[1])
return outcome
`

const OUTCOMES: readonly ApplyOutcome[] = [
  'duplicate',
  'granted',
  'already_granted',
  'blocked_by_tombstone',
  'revoked',
  'tombstoned',
  'recorded',
]

export class UpstashCommerceStore implements CommerceStore {
  // Plain fields, not parameter properties: node --test strips types but cannot transform them.
  private readonly url: string
  private readonly token: string
  private readonly fetcher: typeof fetch

  constructor(url: string, token: string, fetcher: typeof fetch = fetch) {
    this.url = url
    this.token = token
    this.fetcher = fetcher
  }

  private async command(args: (string | number)[]): Promise<unknown> {
    const response = await this.fetcher(this.url, {
      method: 'POST',
      headers: { authorization: `Bearer ${this.token}`, 'content-type': 'application/json' },
      body: JSON.stringify(args),
      signal: AbortSignal.timeout(5_000),
    })
    const payload = (await response.json().catch(() => null)) as { result?: unknown; error?: unknown } | null
    // Throwing surfaces as a 5xx from the webhook, so Stripe retries.
    if (!response.ok || !payload || payload.error) throw new Error('commerce_store_unavailable')
    return payload.result
  }

  async applyEvent(eventId: string, mutation: StoreMutation): Promise<ApplyOutcome> {
    const fields: string[] = []
    if (mutation.op === 'grant') {
      const record: Entitlement = { ...mutation.entitlement, status: 'active', revokedBy: null, deliveredAt: null }
      for (const [name, value] of Object.entries(record)) fields.push(name, value === null ? '' : String(value))
    }
    const reason = mutation.op === 'revoke' ? mutation.reason : ''
    const result = await this.command([
      'EVAL',
      APPLY_EVENT_SCRIPT,
      3,
      eventKey(eventId),
      entitlementKey(mutation.transactionId),
      tombstoneKey(mutation.transactionId),
      mutation.op,
      eventId,
      reason,
      ...fields,
    ])
    if (typeof result !== 'string' || !(OUTCOMES as readonly string[]).includes(result)) {
      throw new Error('commerce_store_unexpected_result')
    }
    return result as ApplyOutcome
  }

  async getEntitlement(transactionId: string): Promise<Entitlement | null> {
    const result = await this.command(['HGETALL', entitlementKey(transactionId)])
    if (!Array.isArray(result) || result.length === 0) return null
    const hash: Record<string, string> = {}
    for (let index = 0; index + 1 < result.length; index += 2) hash[String(result[index])] = String(result[index + 1])
    return {
      transactionId: hash.transactionId ?? transactionId,
      sku: hash.sku ?? '',
      entitlement: hash.entitlement ?? '',
      email: hash.email || null,
      amount: Number(hash.amount) || 0,
      currency: hash.currency ?? '',
      status: hash.status === 'active' ? 'active' : 'revoked',
      grantedBy: hash.grantedBy ?? '',
      revokedBy: hash.revokedBy || null,
      deliveredAt: hash.deliveredAt || null,
    }
  }

  async markDelivered(transactionId: string, at: string): Promise<void> {
    await this.command(['HSET', entitlementKey(transactionId), 'deliveredAt', at])
  }
}

/** The durable store, or null when no KV env is present (webhook then answers 503). */
export function commerceStoreFromEnv(env: CommerceEnv, fetcher: typeof fetch = fetch): CommerceStore | null {
  const credentials = kvCredentials(env)
  return credentials ? new UpstashCommerceStore(credentials.url, credentials.token, fetcher) : null
}
