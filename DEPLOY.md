# Production & Deploy — agenticincome.ai

## Pre-flight (always)
pnpm type-check
pnpm links:check:static || true
pnpm sync:catalog
pnpm build   # must succeed

## Deploy target
Primary: Vercel (agenticincome)
- Project: starlight-intelligence / agenticincome
- Project ID: prj_h8sRP6o1Q16RIgznvD2VtFPaZgV4
- Root directory: (this repo)
- Framework: Next.js
- Environment: Production

go. router (critical for tracked income)
- Project: starlight-intelligence / go-agenticincome
- Project ID: prj_hmP01Z17haxMBhXgY7ggR5dcC7Fi
- Domain: go.agenticincome.ai
- Redeploy after every catalog sync that adds `ourLink`

## Domains
- agenticincome.ai → main site
- go.agenticincome.ai → edge redirect service (301 for live links)
- Spokes (optional DNS): agenticpassiveincome.com + disruptivepassiveincome.com

Current Vercel inspection, 2026-06-26:

- `agenticincome.ai` is registered under `starlight-intelligence` with Vercel nameservers.
- `go.agenticincome.ai` resolves under the same Vercel-managed root domain inspection.
- The `agenticincome` project has no production env vars configured yet.
- Production deployment `dpl_7ofTiUNXW4SzbndUbiSTSLjVao4r` is READY at `https://agenticincome-qlgi3o7tr-starlight-intelligence.vercel.app`.
- Production aliases include `https://www.agenticincome.ai`, `https://agenticincome.ai`, `https://agenticincome.vercel.app`, and Vercel project aliases.
- Live main-domain check: `www.agenticincome.ai` now serves the premium Income Desk surface. `/offers`, `/trust`, `/design`, and `/readiness` return 200.
- Full-launch readiness still returns 503 because payment checkout, owned capture, and first-party analytics forwarding env vars are not configured.
- The go-router is deployed to Vercel deployment `dpl_7GZgRrJUY5titbEjEAjZn1dzrAvB`, assigned to `go.agenticincome.ai`, and production smoke passed for `/systeme`, `/gamma`, `/heygen`, unknown slugs, `/programs`, and query passthrough.

## Email / ESP (owned audience)
Current: `/api/subscribe` validates email, returns a request ID, forwards to `SUBSCRIBE_WEBHOOK_URL` when configured, and never prints raw email values into analytics. If no webhook exists, it can return a manual concierge `mailto:` link when `ACCESS_REQUEST_EMAIL` is configured; otherwise the UI clearly says the capture route still needs operator routing.
Recommended: Systeme.io (60% lifetime in catalog — highest converting).

Domain email status, 2026-06-26: `agenticincome.ai` has no MX record in DNS lookup, so any concierge mailbox must be configured before relying on manual email access requests.

Options:
1. Embed Systeme form directly on pages (fastest).
2. POST /api/subscribe → Systeme webhook or their form endpoint.
3. Use Resend + your list for custom sequences.

Update the form action and the route handler when wired. Keep the "highest converting" callout.

## Analytics & tracking
- Vercel Web Analytics + Speed Insights are enabled on the `agenticincome` project and wired in `app/layout.tsx`.
- UTM/ref query param passthrough is active in both `go.agenticincome.ai` and the main `/api/checkout` route.
- Set `ANALYTICS_WEBHOOK_URL` to forward first-party events from `/api/analytics`
- Current event contract: `offer_view`, `checkout_click`, `checkout_redirect`, `checkout_fallback_request`, `subscribe_success`, `subscribe_error`, `delivery_view`, `affiliate_click`
- Consider Plausible or PostHog for cleaner ownership after the webhook is receiving events

## Required env vars before production promotion

```text
AGENTIC_INCOME_BLUEPRINT_CHECKOUT_URL
AGENTIC_INCOME_PRIVATE_INTEL_CHECKOUT_URL
SUBSCRIBE_WEBHOOK_URL
ACCESS_REQUEST_EMAIL
ANALYTICS_WEBHOOK_URL
```

Checkout, subscribe, and analytics URL env vars must use `https:`. Non-secure provider URLs are treated as missing and route to request-access instead of leaving the site.

## Visuals & assets
- hero-premium.jpg and flywheel-diagram.jpg in public/
- Regenerate or add per-post headers using Higgsfield / Grok Imagine as needed
- Keep public/hero-poster.svg as fallback

## Gates & CI
- merge:gate (type-check + links)
- predeploy = gate + sync:catalog
- Never merge if build fails or links are broken
- `/api/readiness` returns `503` until all full-launch systems are configured and `200` when payment checkout, capture, and analytics are wired.
- `/readiness` is a noindex human-readable launch gate for checkout, capture, and analytics state.
- Checkout QA must include attribution passthrough: `utm_*`, `ref`, `src`, `source`, `campaign`, `gclid`, `fbclid`, and `msclkid`.
- Observability QA must confirm Vercel Web Analytics and Speed Insights are enabled in the project and rendered in the root layout.

## After deploy
1. Current visual-production deploy is live by explicit operator instruction. Keep `/api/readiness` returning 503 until checkout, capture, and analytics env vars are configured.
2. Attach/promote future commerce launches only after `/api/readiness` returns `200` in the target environment.
3. Reverify `go.agenticincome.ai` after every catalog sync or router redeploy.
4. Verify go. links resolve (301/302 for active `ourLink` values, never 404).
5. Submit updated sitemap to search engines.
6. Add the site to any monitoring (queen / canary if available).
7. Run affiliate-audit on new content.

## Rollback
Vercel instant rollback from dashboard. Revert catalog only after verifying payouts still correct.

Last updated: 2026-06-26 (production visual upgrade live; commerce readiness still gated)
