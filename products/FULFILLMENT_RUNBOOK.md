# Agentic Income Fulfillment Runbook

## Purpose

This runbook defines how each offer is delivered once the public site routes a buyer or subscriber into the product ladder.

## Offer States

| Offer | Public CTA | Payment dependency | Delivery path | Current state |
|---|---|---|---|---|
| Starter Kit | `/api/checkout?offer=starter-kit` | none | `/delivery/starter-kit` | live |
| Blueprint | `/api/checkout?offer=blueprint` | `AGENTIC_INCOME_BLUEPRINT_CHECKOUT_URL` | `/delivery/blueprint` | payment-link pending |
| Private Intel | `/api/checkout?offer=private-intel` | `AGENTIC_INCOME_PRIVATE_INTEL_CHECKOUT_URL` | `/delivery/private-intel` | payment-link pending |

## Payment Provider Setup

1. Create the payment product in Stripe, Lemon Squeezy, Gumroad, or the chosen provider.
2. Set the public success redirect to the matching delivery path.
3. Set the cancel/back link to the matching offer page.
4. Add the provider URL to Vercel:
   - `AGENTIC_INCOME_BLUEPRINT_CHECKOUT_URL`
   - `AGENTIC_INCOME_PRIVATE_INTEL_CHECKOUT_URL`
5. Redeploy or refresh environment variables.
6. Verify `/api/checkout?offer=...` redirects to the provider URL.
7. Verify the provider URL is `https:` and receives `utm_*`, `ref`, and other allowed attribution params from the checkout route.

## Email Capture Setup

Set `SUBSCRIBE_WEBHOOK_URL` on Vercel when the ESP/CRM endpoint is ready. The subscribe route sends:

- normalized email
- source
- request ID
- tags: `agentic-income`, `payer-brief`

For a temporary concierge fallback, set `ACCESS_REQUEST_EMAIL` and configure a working mailbox/MX record. The route will return a prefilled `mailto:` URL with the request ID, source, and buyer email. Without either `SUBSCRIBE_WEBHOOK_URL` or `ACCESS_REQUEST_EMAIL`, the UI shows an unwired state instead of claiming the request was captured.

Recommended sources to segment:

- `email-capture`
- `offer-blueprint`
- `offer-private-intel`
- `delivery-blueprint`
- `delivery-private-intel`

## Analytics Setup

Set `ANALYTICS_WEBHOOK_URL` when Plausible, PostHog, Make, n8n, or a CRM event endpoint is ready.

Vercel Web Analytics and Speed Insights are enabled on the Vercel project and rendered in the root layout. Keep them on for production observability, but still wire `ANALYTICS_WEBHOOK_URL` for owned checkout, subscribe, delivery, and affiliate events.

Events currently emitted:

- `checkout_click`
- `checkout_redirect`
- `checkout_fallback_request`
- `subscribe_success`
- `subscribe_error`
- `delivery_view`
- `affiliate_click`

## Support Boundaries

- Starter Kit: no support obligation beyond keeping the free delivery page live.
- Blueprint: template-level support, update notes, and correction of broken product assets.
- Private Intel: monthly briefs, catalog change notes, priority watchlist, and private Q&A window.
- Done-for-you implementation is not included unless a future partner package is sold separately.

## Launch QA

Before promoting production:

1. Build passes.
2. Internal link check passes.
3. `/trust` renders support/refund/disclosure policy.
4. Starter Kit checkout opens `/delivery/starter-kit`.
5. Paid checkout redirects to provider URLs in the Vercel environment.
6. Provider test purchase returns to the matching delivery path.
7. Subscribe route forwards to ESP/CRM or degrades intentionally.
8. Analytics route accepts known events and rejects unknown events.
9. `/api/readiness` returns `200` in the target environment.
10. `www.agenticincome.ai` serves the new surface and `/trust` renders.
11. `go.agenticincome.ai/systeme` and other active catalog routes redirect instead of returning 404.
12. Vercel preview is verified before production promotion.

## Latest Verification Snapshot

Date: 2026-06-26

- Main preview: `https://agenticincome-egwe0fv5x-starlight-intelligence.vercel.app`
- Deployment: `dpl_8Kn2p99RCC5ifDPhZBV2iq4RbMVJ`, READY
- go-router production: `https://go.agenticincome.ai`, deployment `dpl_7GZgRrJUY5titbEjEAjZn1dzrAvB`, READY and public
- Local gates: type-check, internal links, design evidence validation, and production build passed.
- Access request API smoke: invalid email returns `400`; no-env valid request returns `202` with `mode: unwired`; configured `ACCESS_REQUEST_EMAIL` returns `202` with `mode: manual_email` and a concierge `mailto:`.
- Readiness API smoke: no-env runtime returns `503`, `fullLaunchReady: false`, `captureMode: unwired`; synthetic configured runtime returns `200`, `fullLaunchReady: true`, `captureMode: webhook`.
- Observability smoke: Vercel Web Analytics and Speed Insights are enabled at project level, installed in the app, and reported by `/api/readiness` as configured/non-blocking.
- Checkout attribution smoke: no-env Blueprint fallback preserves `utm_source` and `ref`, Starter Kit delivery preserves `utm_campaign` and `src`, secure Blueprint provider URL preserves attribution, insecure Private Intel provider URL is rejected to request-access, and hydrated mobile offer CTAs include the current `utm_source`/`ref`.
- go-router smoke: `/systeme`, `/gamma`, `/heygen`, unknown slugs, `/programs`, and query passthrough passed locally and on the custom domain.
- Production blockers: payment checkout URLs, subscribe webhook or working concierge email/MX, analytics webhook, and `www.agenticincome.ai` promotion.
