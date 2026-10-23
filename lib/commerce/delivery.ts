import { commerceSiteUrl, httpsUrl } from './config.ts'
import type { DeliveryNotifier } from './stripe-webhook.ts'
import type { CommerceEnv } from './types.ts'

/**
 * Delivery email hand-off. The repo has no email SDK; like the subscribe
 * route, it forwards to an owned endpoint (COMMERCE_DELIVERY_WEBHOOK_URL —
 * e.g. a Resend/Loops/Zapier hook) with an Idempotency-Key of
 * `delivery:{transactionId}`, so a retried webhook never sends twice at a
 * provider that honors the key. Unset -> null: the buyer still lands on the
 * delivery page via the checkout success URL, and the grant is still stored.
 */
export function deliveryNotifierFromEnv(env: CommerceEnv, fetcher: typeof fetch = fetch): DeliveryNotifier | null {
  const endpoint = httpsUrl(env.COMMERCE_DELIVERY_WEBHOOK_URL)
  if (!endpoint) return null
  const siteUrl = commerceSiteUrl(env)
  return async ({ idempotencyKey, entitlement }) => {
    const response = await fetcher(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'Idempotency-Key': idempotencyKey },
      body: JSON.stringify({
        type: 'commerce_delivery',
        sku: entitlement.sku,
        entitlement: entitlement.entitlement,
        email: entitlement.email,
        transactionId: entitlement.transactionId,
        deliveryUrl: siteUrl ? new URL(`/delivery/${entitlement.sku}`, siteUrl).toString() : null,
      }),
      signal: AbortSignal.timeout(5_000),
    })
    if (!response.ok) throw new Error('delivery_failed')
  }
}
