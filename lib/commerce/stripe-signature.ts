import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Stripe webhook signature verification without the `stripe` SDK, following
 * docs.stripe.com/webhooks#verify-manually: the `Stripe-Signature` header is
 * `t=<unix>,v1=<hex>[,v1=<hex>...][,v0=...]`; the signed payload is
 * `${t}.${rawBody}`, HMAC-SHA256 with the endpoint secret; only `v1` counts
 * (no downgrade to v0); constant-time compare; 5-minute default tolerance.
 *
 * The raw body must be the exact bytes Stripe sent — read it with
 * `await req.text()` before any JSON parsing.
 */

export const DEFAULT_TOLERANCE_SECONDS = 300

export type SignatureFailure = 'missing_header' | 'malformed_header' | 'timestamp_out_of_tolerance' | 'no_matching_signature'

export function computeStripeSignature(rawBody: string, secret: string, timestamp: number): string {
  return createHmac('sha256', secret).update(`${timestamp}.${rawBody}`, 'utf8').digest('hex')
}

/** Header in Stripe's format — the equivalent of stripe.webhooks.generateTestHeaderString. */
export function stripeSignatureHeader(rawBody: string, secret: string, timestamp: number): string {
  return `t=${timestamp},v1=${computeStripeSignature(rawBody, secret, timestamp)}`
}

export function verifyStripeSignature(
  rawBody: string,
  header: string | null | undefined,
  secret: string,
  options: { nowSeconds?: number; toleranceSeconds?: number } = {},
): { ok: true; timestamp: number } | { ok: false; reason: SignatureFailure } {
  if (!header) return { ok: false, reason: 'missing_header' }
  let timestamp: number | null = null
  const signatures: string[] = []
  for (const part of header.split(',')) {
    const index = part.indexOf('=')
    if (index <= 0) continue
    const prefix = part.slice(0, index).trim()
    const value = part.slice(index + 1).trim()
    if (prefix === 't' && /^\d+$/.test(value)) timestamp = Number(value)
    else if (prefix === 'v1' && /^[0-9a-f]{64}$/i.test(value)) signatures.push(value.toLowerCase())
  }
  if (timestamp === null || signatures.length === 0) return { ok: false, reason: 'malformed_header' }

  const tolerance = options.toleranceSeconds ?? DEFAULT_TOLERANCE_SECONDS
  const now = options.nowSeconds ?? Math.floor(Date.now() / 1000)
  // A tolerance of 0 would disable the replay window; never allow it.
  if (tolerance <= 0 || Math.abs(now - timestamp) > tolerance) return { ok: false, reason: 'timestamp_out_of_tolerance' }

  const expected = Buffer.from(computeStripeSignature(rawBody, secret, timestamp), 'hex')
  const matched = signatures.some((signature) => {
    const candidate = Buffer.from(signature, 'hex')
    return candidate.length === expected.length && timingSafeEqual(candidate, expected)
  })
  return matched ? { ok: true, timestamp } : { ok: false, reason: 'no_matching_signature' }
}
