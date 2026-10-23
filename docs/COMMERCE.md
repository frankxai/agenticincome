# Commerce kit — provider-neutral, fail-closed checkout + webhooks

This is the estate standard for selling a digital product from a site in the
network. `agenticincome.ai` is the reference implementation; another site can
copy `lib/commerce/`, the two routes, and `tests/commerce-kit.test.mjs`, and
change `COMMERCE_SITE` plus its catalog join (`lib/commerce/server.ts`).

**Default state: closed.** With no new env vars set, nothing in this kit can
take money. `GET /api/checkout?offer=blueprint` keeps redirecting (302) to
`/offers/blueprint#request-access`.

## 1. The gates

A checkout opens only when **all** hold (`lib/commerce/checkout.ts`):

| # | Gate | Source | Closed reason |
|---|------|--------|---------------|
| 1 | Kill switch off | `COMMERCE_KILL_SWITCH` not `1/true/yes/on` | `kill_switch` |
| 2 | Product exists and is paid | `products/catalog.json` | `unknown_product`, `free_product` |
| 3 | **Catalog** status starts with `for sale` | `products/catalog.json` `status` | `catalog_not_for_sale` |
| 4 | **Provider** selected | `COMMERCE_PROVIDER` (`stripe` \| `payment_link` \| `polar` \| `none`; default `none`) | `provider_none` |
| 5 | Provider configured for this SKU | adapter `isConfigured()` | `provider_unconfigured` |

Gates 3 and 4 are the double gate: an env var alone (for example a pasted
checkout URL) never opens a sale, and flipping the catalog alone never does
either. **Setting `COMMERCE_PROVIDER` in Production is the owner's release
approval.** No agent sets it.

The same gate drives the page CTAs (`commerceCheckoutMode`), `/readiness`,
and both route methods, so a page never says "connected" while the route
refuses. `lib/polar.ts` additionally requires `COMMERCE_PROVIDER=polar` and
honors the kill switch on its own.

**GET never creates provider state.** `GET /api/checkout` is a crawlable link,
so it only follows a static link (`payment_link`). For session providers
(`stripe`, `polar`) it redirects to the offer page, which renders the buy
button; the button calls the same-origin, rate-limited `POST /api/checkout`,
which creates the session. While a session provider is open, the
`#request-access` section stays mounted as the fallback for a click-time
failure.

**Stripe counts as configured only with private fulfillment**, meaning all of
`STRIPE_SECRET_KEY`, `COMMERCE_SITE_URL`, `STRIPE_WEBHOOK_SECRET` (`whsec_…`),
a KV pair, and `COMMERCE_DELIVERY_WEBHOOK_URL`. The public `/delivery/*` page is
not fulfillment. Stripe is also one-time SKUs only, so recurring SKUs stay
closed (see §4). The repo has no feature-flag SDK, so the kill switch is a plain env var
(change it, then redeploy, because the offer pages are rendered at build time).

## 2. Interface

```ts
// lib/commerce/types.ts
type CommerceAdapter = {
  id: 'stripe' | 'payment_link' | 'polar'
  isConfigured(sku, env): boolean                         // no network
  createCheckout(sku, ctx): Promise<string | null>        // hosted https URL or null
  normalizeWebhook?(event): NormalizedCommerceEvent | 'pending' | null
}
type NormalizedCommerceEvent = {
  type: 'purchase' | 'refund' | 'dispute' | 'payment_failed'
  sku, site, entitlement, transactionId, email, amount, currency, full, eventId
}
```

`transactionId` is the provider's payment id (Stripe: the PaymentIntent). The
purchase, its refund, and its dispute all carry it, so it is the entitlement key.

Adapters:

- **stripe** — creates a Checkout Session over REST (no SDK), API version
  pinned to `2025-03-31.basil`. With `COMMERCE_STRIPE_MANAGED_PAYMENTS=true`
  it sends `managed_payments[enabled]=true` (Stripe Managed Payments, where
  Stripe/Link is merchant of record). Otherwise it is plain Stripe Checkout and
  tax is the seller's own responsibility. It never sends the parameters Managed
  Payments rejects (`automatic_tax`, `tax_id_collection`,
  `payment_method_types`, `invoice_creation`,
  `payment_intent_data.receipt_email`, …). It fetches the Stripe price and
  refuses unless amount, currency, and one-time/recurring shape equal the
  catalog.
- **payment_link** — the static https link in the offer's `*_CHECKOUT_URL`
  env var (the pre-kit behavior). The provider behind the link must deliver
  the product itself, for example Polar file downloads or a Stripe Payment Link
  plus this webhook with KV and a delivery sender configured. A Stripe Payment Link works here: set
  `metadata` on the link (it is copied to its Checkout Sessions) and the same
  webhook fulfills it.
- **polar** — wraps `lib/polar.ts` `createCheckoutSession`.

## 3. Naming standard

| Thing | Pattern | Blueprint example |
|-------|---------|-------------------|
| Provider product id / name key | `{site}_{sku}` | `agenticincome_blueprint` |
| Price lookup key | `{site}.{sku}.{onetime\|month}.{cur}.v{n}` | `agenticincome.blueprint.onetime.usd.v1` |
| Metadata (session + payment) | `site`, `sku`, `entitlement` | `agenticincome`, `blueprint`, `agenticincome:blueprint` |
| Entitlement | `{site}:{sku}` | `agenticincome:blueprint` |
| Per-SKU env | `{PROVIDER}_..._{SKU}` (upper snake) | `STRIPE_PRICE_ID_BLUEPRINT` |

A price change means a new price with `v{n+1}`: move the lookup key with
`transfer_lookup_key`, and never edit an existing price in place. Metadata
`site` lets one Stripe account serve several sites. The webhook ignores events
whose `site` is another site's.

## 4. Webhook — `POST /api/webhooks/stripe`

Subscribe the endpoint to exactly:
`checkout.session.completed`, `checkout.session.async_payment_succeeded`,
`checkout.session.async_payment_failed`, `charge.refunded`,
`charge.dispute.created`.

| Behavior | Rule |
|----------|------|
| Signature | Raw body (`req.text()`) + `Stripe-Signature`, HMAC-SHA256 with `STRIPE_WEBHOOK_SECRET`, `v1` only, constant-time compare, 300 s tolerance (`lib/commerce/stripe-signature.ts`). Fail → **400**. |
| Config missing | No secret or no durable store → **503** (Stripe retries until it is configured). |
| Grant | Only when `payment_status === 'paid'`. A completed-but-unpaid session (delayed method) waits for `async_payment_succeeded`. |
| Idempotency | `store.applyEvent(eventId, mutation)` records the event id **and** applies the grant/revoke in one atomic step (one Redis `EVAL`). A duplicate event id is a no-op. A second event for the same payment is `already_granted`. |
| Refund / dispute | Full refund or any dispute writes a **tombstone** keyed by `transactionId`, even when no grant exists yet (refund-before-paid). A later purchase event for that payment is `blocked_by_tombstone`. A partial refund is recorded and does not revoke. |
| Delivery email | After a grant, `COMMERCE_DELIVERY_WEBHOOK_URL` is called with `Idempotency-Key: delivery:{transactionId}`, then `deliveredAt` is stored. If the send fails → **500**, and Stripe's retry (a duplicate event) finishes the delivery. |
| Errors | Any store/delivery failure → **500** so Stripe retries (up to 3 days). |
| Other events / sites | **200** `ignored` / `other_site` / `unmapped_purchase`. |

### Store

The repo has no KV dependency. `lib/commerce/store.ts` defines `CommerceStore`
with two implementations:

- `MemoryCommerceStore`: tests and local dev only. It is not durable.
- `UpstashCommerceStore`: Upstash Redis REST over `fetch` (no new npm
  dependency). It is enabled by `KV_REST_API_URL` + `KV_REST_API_TOKEN` (or
  `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`). Keys are
  `commerce:v1:event:{eventId}`, `commerce:v1:entitlement:{transactionId}`
  (hash), and `commerce:v1:tombstone:{transactionId}`.

Subscriptions (Private Intel) are not fulfilled by this webhook yet. A
subscription Checkout Session has no PaymentIntent, so its refunds could not
be matched to a grant. The Stripe adapter therefore refuses `month` SKUs, and
the webhook acknowledges subscription sessions without granting. Opening one
needs `invoice.paid` / `customer.subscription.deleted` handling keyed by
subscription or invoice id.

Analytics attribution: `purchase`/`refund` fire only for events that are
provably this site's, meaning our `site` metadata or a grant in our store. A
metadata-less reversal from another site on a shared account still writes a
harmless tombstone but is never counted.

## 5. Events

| Standard name | This repo's event | Where |
|---------------|-------------------|-------|
| `view_offer` | `offer_view` | client, offer pages |
| `start_checkout` | `checkout_click` (client) → `checkout_redirect` state `provider_checkout:{provider}` (server) | `/api/checkout` |
| (closed) | `checkout_fallback_request` state = closed reason | `/api/checkout` |
| `purchase` | `purchase` state `granted` | webhook, **server-only** |
| `refund` | `refund` state `revoked` \| `tombstoned` | webhook, **server-only** |

`purchase`/`refund` are rejected by `normalizeAnalyticsEvent`, so a browser
cannot forge them. No email or amount is sent to analytics.

## 6. Test mode first

1. Build everything in a Stripe **sandbox/test mode** (`sk_test_…`, test
   webhook endpoint secret) on a Vercel **Preview** deployment.
2. Set the env vars on Preview only, buy with `4242 4242 4242 4242`, refund it,
   and open a dispute with the documented test card. Confirm the
   grant/revoke in KV and that the endpoint shows all deliveries as 2xx.
3. Only then repeat with live keys in Production, after the owner approves the
   release.

Run the suite: `node --test tests/commerce-kit.test.mjs` (or `pnpm test`).
