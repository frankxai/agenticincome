# Agentic Income Revenue And Delivery System

## Current State

The offer ladder is now an internal product system instead of three buttons pointing to one placeholder commerce URL.

## Live Paths

| Offer | Route | Price | Checkout path | Delivery state |
|---|---|---:|---|---|
| Income Flywheel Starter Kit | `/offers/starter-kit` | Free | `/api/checkout?offer=starter-kit` | Live: redirects to `/delivery/starter-kit` |
| Agentic Income Blueprint | `/offers/blueprint` | $67 | `/api/checkout?offer=blueprint` | Provider-ready: redirects to checkout URL when configured, otherwise request-access; post-checkout handoff is `/delivery/blueprint` |
| Private Intel | `/offers/private-intel` | $19/mo | `/api/checkout?offer=private-intel` | Provider-ready: redirects to checkout URL when configured, otherwise request-access; post-checkout handoff is `/delivery/private-intel` |

## Environment Variables

Set these on Vercel when payment links exist:

```text
AGENTIC_INCOME_BLUEPRINT_CHECKOUT_URL
AGENTIC_INCOME_PRIVATE_INTEL_CHECKOUT_URL
SUBSCRIBE_WEBHOOK_URL
ACCESS_REQUEST_EMAIL
ANALYTICS_WEBHOOK_URL
```

The route handler only redirects to secure `https:` provider URLs. If a value is missing or non-secure, it returns the user to the relevant product page at `#request-access`.

As of the 2026-06-26 Vercel inspection, the `starlight-intelligence/agenticincome` project has no environment variables configured. The visual production upgrade is live with honest request-access fallbacks, but full commerce launch remains gated until the payment, subscribe/manual concierge, and analytics endpoints exist. DNS lookup also found no MX record for `agenticincome.ai`, so manual concierge email requires mailbox/DNS setup before launch.

Latest production deployment:

- URL: `https://www.agenticincome.ai`
- Deployment: `dpl_7ofTiUNXW4SzbndUbiSTSLjVao4r`
- State: READY and public on the custom domain
- Build: 26 app routes generated, including `/trust`, `/offers/[slug]`, paid handoff pages, `/readiness`, and analytics/checkout/readiness APIs
- Access request QA: valid no-env subscribe returns `202` with `mode: unwired` and a request ID; configured `ACCESS_REQUEST_EMAIL` returns `mode: manual_email` with a prefilled concierge `mailto:`; invalid email returns `400`.
- Live QA: `/`, `/offers`, `/trust`, `/design`, and `/readiness` return 200. `/api/readiness` correctly returns 503 with `fullLaunchReady: false` until checkout, capture, and analytics env vars are configured.

go-router production deployment:

- URL: `https://go.agenticincome.ai`
- Deployment: `dpl_7GZgRrJUY5titbEjEAjZn1dzrAvB`
- Project: `starlight-intelligence/go-agenticincome`
- State: READY and public on the custom domain
- Production QA: `/systeme`, `/gamma`, `/heygen`, unknown slugs, `/programs`, and query passthrough passed

Provider success redirects should point to:

- Blueprint: `/delivery/blueprint`
- Private Intel: `/delivery/private-intel`

## Free Product Delivery

The Starter Kit delivers immediately:

- Product page: `/offers/starter-kit`
- Checkout redirect: `/api/checkout?offer=starter-kit`
- Delivery page: `/delivery/starter-kit`
- Download: `/downloads/agentic-income-starter-kit.md`

This proves the on-site product delivery loop before paid checkout is live.

## Paid Product Access

Blueprint and Private Intel are ready for provider links. Until those links are configured, the site routes access requests through `/api/subscribe` with offer-specific sources:

- `offer-blueprint`
- `offer-private-intel`
- `delivery-blueprint`
- `delivery-private-intel`

The subscribe route returns a request ID on every valid request. With `SUBSCRIBE_WEBHOOK_URL`, it forwards the email, source, request ID, and tags to the owned-audience system. With `ACCESS_REQUEST_EMAIL`, it returns a prefilled manual concierge email. With neither configured, the UI makes the unwired state explicit instead of claiming that an access queue captured the lead.

The paid delivery pages are `noindex` launch-state handoff surfaces. They define receipt expectations, install/member rhythm, support boundaries, and request-access fallback. They do not expose private paid files publicly.

## Analytics Contract

The site emits lightweight first-party events to `/api/analytics`; the route forwards to `ANALYTICS_WEBHOOK_URL` when configured and otherwise returns success without blocking the user.

- `checkout_click`
- `checkout_redirect`
- `checkout_fallback_request`
- `subscribe_success`
- `subscribe_error`
- `delivery_view`
- `affiliate_click`

Vercel Web Analytics and Speed Insights are also enabled on the Vercel project and rendered from the root layout. They are useful production observability, but they do not replace the owned first-party event webhook required for full launch readiness.

## Checkout Attribution

The main product checkout path preserves allowed attribution params through client CTAs and the server redirect route:

- `utm_*`
- `ref`
- `src`
- `source`
- `campaign`
- `gclid`
- `fbclid`
- `msclkid`

Server QA verified no-env fallback keeps attribution on `/offers/[slug]#request-access`, free delivery keeps attribution on `/delivery/starter-kit`, secure provider checkout receives attribution, and insecure provider URLs are rejected into request-access.

## Launch Readiness Gate

- Human page: `/readiness` (`noindex`)
- Machine gate: `/api/readiness`
- Missing required systems: returns `503`, `fullLaunchReady: false`, and the missing categories.
- Fully configured runtime: returns `200`, `fullLaunchReady: true`, and only boolean/configuration state, never secret values.
- Vercel observability appears as a configured non-blocking item; payment, capture, and first-party analytics forwarding remain the four required launch gates.
- Local smoke verified both states: no-env runtime returned `503` with `captureMode: unwired`; synthetic configured runtime returned `200` with `captureMode: webhook`.

## Trust Surface

The public trust standard lives at `/trust` and documents:

- recommendation-first policy
- affiliate disclosure behavior
- checkout readiness and fallback behavior
- support and refund boundaries

## Support Boundary

- Starter Kit: self-serve.
- Blueprint: template-level support and update notes.
- Private Intel: monthly updates and private Q&A windows.
- Done-for-you implementation is not included unless a future partner package is created.

## QA Requirements

Before promotion:

- `/offers` renders all products and internal CTAs.
- `/offers/[slug]` renders every product detail page.
- `/api/checkout?offer=starter-kit` redirects to `/delivery/starter-kit`.
- `/api/checkout?offer=blueprint` redirects to the configured provider URL or `/offers/blueprint#request-access`.
- `/api/checkout?offer=private-intel` redirects to the configured provider URL or `/offers/private-intel#request-access`.
- Checkout redirects preserve allowed attribution params and reject non-secure provider URLs.
- `/delivery/starter-kit` renders and the Markdown download is available.
- `/delivery/blueprint` and `/delivery/private-intel` render noindex handoff pages.
- `/trust` renders the recommendation, disclosure, support, and refund policy.
- `/api/analytics` accepts allowed event names and rejects unknown events.
- `/api/readiness` returns `503` before full launch wiring and `200` only when checkout, capture, and analytics systems are configured.
- `www.agenticincome.ai` serves the new surface, including `/trust`.
- `go.agenticincome.ai/<slug>` resolves active catalog routes and does not return 404 for live `ourLink` values.
- Type-check, internal links, build, local click-path smoke, and Vercel production verification pass.

The go-router source now avoids self-redirect loops when catalog `ourLink` values are public `go.agenticincome.ai` shortlinks. Local QA and production custom-domain QA passed for `/systeme`, `/gamma`, `/heygen`, and an unknown slug with query passthrough.
