import { NextResponse } from 'next/server'
import { forwardAnalyticsEvent } from '@/lib/analytics'
import { processEnv } from '@/lib/commerce/config'
import { deliveryNotifierFromEnv } from '@/lib/commerce/delivery'
import { commerceStoreFromEnv } from '@/lib/commerce/store'
import { handleStripeWebhook } from '@/lib/commerce/stripe-webhook'

/**
 * Stripe webhook endpoint (docs/COMMERCE.md). Subscribe it to:
 *   checkout.session.completed, checkout.session.async_payment_succeeded,
 *   checkout.session.async_payment_failed, charge.refunded, charge.dispute.created
 *
 * The raw body is read once with req.text() — never parsed before the
 * signature check. All logic lives in lib/commerce/stripe-webhook.ts.
 * Without STRIPE_WEBHOOK_SECRET or a KV store this answers 503 (fail-closed;
 * Stripe retries once configured).
 */

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const env = processEnv()
  const rawBody = await req.text()
  const result = await handleStripeWebhook({
    rawBody,
    signature: req.headers.get('stripe-signature'),
    secret: env.STRIPE_WEBHOOK_SECRET,
    store: commerceStoreFromEnv(env),
    deliver: deliveryNotifierFromEnv(env),
  })

  const outcome = typeof result.body.outcome === 'string' ? result.body.outcome : null
  const sku = typeof result.body.sku === 'string' ? result.body.sku : 'unknown'
  if (outcome === 'granted') {
    await forwardAnalyticsEvent({ event: 'purchase', offer: sku, state: outcome, ts: new Date().toISOString() })
  } else if (outcome === 'revoked' || outcome === 'tombstoned') {
    await forwardAnalyticsEvent({ event: 'refund', offer: sku, state: outcome, ts: new Date().toISOString() })
  }

  return NextResponse.json(result.body, { status: result.status })
}
