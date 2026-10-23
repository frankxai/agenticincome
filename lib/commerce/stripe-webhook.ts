import { COMMERCE_SITE } from './config.ts'
import { normalizeStripeEvent } from './stripe.ts'
import { verifyStripeSignature } from './stripe-signature.ts'
import type { ApplyOutcome, CommerceStore, Entitlement, StoreMutation } from './store.ts'
import type { NormalizedCommerceEvent } from './types.ts'

/**
 * Stripe webhook processing, framework-free so `node --test` can drive it.
 * app/api/webhooks/stripe/route.ts is a thin wrapper.
 *
 * Status contract (Stripe retries any non-2xx for up to 3 days):
 *   400  signature missing/invalid/stale, or body is not JSON  -> never retried usefully
 *   503  webhook secret or durable store not configured        -> retried until fixed
 *   500  store or delivery failed while processing             -> retried
 *   200  processed, duplicate, ignored, or another site's event
 *
 * Grants happen only for `payment_status=paid`. A refund or dispute writes a
 * tombstone keyed by the PaymentIntent even when no grant exists yet, so a
 * late or out-of-order purchase event can never re-grant a refunded payment.
 */

export type DeliveryRequest = {
  /** Stable per purchase: `delivery:{transactionId}`. Send as the provider's Idempotency-Key. */
  idempotencyKey: string
  entitlement: Entitlement
}

/** Sends the delivery email. Must throw on failure so the webhook answers 5xx and Stripe retries. */
export type DeliveryNotifier = (request: DeliveryRequest) => Promise<void>

export type WebhookInput = {
  rawBody: string
  signature: string | null
  secret: string | null | undefined
  store: CommerceStore | null
  site?: string
  deliver?: DeliveryNotifier | null
  nowSeconds?: number
  now?: () => Date
}

export type WebhookResult = { status: number; body: Record<string, unknown> }

function mutationFor(event: NormalizedCommerceEvent): StoreMutation {
  if (event.type === 'purchase' && event.sku && event.entitlement) {
    return {
      op: 'grant',
      transactionId: event.transactionId,
      entitlement: {
        transactionId: event.transactionId,
        sku: event.sku,
        entitlement: event.entitlement,
        email: event.email,
        amount: event.amount,
        currency: event.currency,
        grantedBy: event.eventId,
      },
    }
  }
  if (event.type === 'dispute') return { op: 'revoke', transactionId: event.transactionId, reason: 'dispute' }
  if (event.type === 'refund' && event.full) return { op: 'revoke', transactionId: event.transactionId, reason: 'refund' }
  return { op: 'record', transactionId: event.transactionId }
}

async function deliverIfOwed(
  store: CommerceStore,
  transactionId: string,
  deliver: DeliveryNotifier | null | undefined,
  now: () => Date,
): Promise<'delivered' | 'already_delivered' | 'not_owed' | 'no_notifier'> {
  const entitlement = await store.getEntitlement(transactionId)
  if (!entitlement || entitlement.status !== 'active') return 'not_owed'
  if (entitlement.deliveredAt) return 'already_delivered'
  if (!deliver) return 'no_notifier'
  await deliver({ idempotencyKey: `delivery:${transactionId}`, entitlement })
  await store.markDelivered(transactionId, now().toISOString())
  return 'delivered'
}

export async function handleStripeWebhook(input: WebhookInput): Promise<WebhookResult> {
  const site = input.site ?? COMMERCE_SITE
  const now = input.now ?? (() => new Date())
  const secret = input.secret?.trim()
  if (!secret) return { status: 503, body: { ok: false, reason: 'webhook_unconfigured' } }
  if (!input.store) return { status: 503, body: { ok: false, reason: 'store_unconfigured' } }

  const verified = verifyStripeSignature(input.rawBody, input.signature, secret, { nowSeconds: input.nowSeconds })
  if (!verified.ok) return { status: 400, body: { ok: false, reason: 'signature_invalid', detail: verified.reason } }

  let event: unknown
  try {
    event = JSON.parse(input.rawBody)
  } catch {
    return { status: 400, body: { ok: false, reason: 'payload_invalid' } }
  }
  if (!event || typeof event !== 'object' || typeof (event as { id?: unknown }).id !== 'string') {
    return { status: 400, body: { ok: false, reason: 'payload_invalid' } }
  }

  const eventId = (event as { id?: unknown }).id
  const eventType = (event as { type?: unknown }).type
  const normalized = normalizeStripeEvent(event)
  if (normalized === null) return { status: 200, body: { ok: true, outcome: 'ignored', type: eventType } }

  try {
    if (normalized === 'pending') {
      // Completed but not yet paid (delayed method): acknowledge; the grant waits
      // for checkout.session.async_payment_succeeded.
      return { status: 200, body: { ok: true, outcome: 'pending_payment', type: eventType } }
    }

    // One Stripe account may serve several sites; act only on our own SKUs.
    // Refunds/disputes without metadata still tombstone (keyed by payment id).
    if (normalized.site && normalized.site !== site) {
      return { status: 200, body: { ok: true, outcome: 'other_site', type: eventType } }
    }
    if (normalized.type === 'purchase' && (!normalized.site || !normalized.sku || !normalized.entitlement)) {
      return { status: 200, body: { ok: true, outcome: 'unmapped_purchase', type: eventType } }
    }

    const outcome: ApplyOutcome = await input.store.applyEvent(String(eventId), mutationFor(normalized))

    // Delivery is re-attempted on duplicates too: if the grant committed but the
    // email failed, Stripe's retry (same event id) finishes the delivery.
    const delivery =
      normalized.type === 'purchase' && ['granted', 'already_granted', 'duplicate'].includes(outcome)
        ? await deliverIfOwed(input.store, normalized.transactionId, input.deliver, now)
        : 'not_owed'

    return { status: 200, body: { ok: true, outcome, delivery, type: eventType, sku: normalized.sku } }
  } catch {
    return { status: 500, body: { ok: false, reason: 'processing_failed', type: eventType } }
  }
}
