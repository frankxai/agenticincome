# Polar Setup Runbook — agenticincome.ai

**For:** Frank · **Date:** 2026-07-11 · **Source of truth:** `products/catalog.json`
**Goal:** all four products live on Polar.sh, checkout wired into the site, one test purchase verified per paid product.

Fees (from `knowledge/07-field-dossier.md` §3, verified 2026-07-11 — re-check at org creation): new Polar orgs created on/after May 27, 2026 pay **5% + $0.50 per transaction** on the free Starter tier; paid plans Pro $20/mo, Growth $100/mo, Scale $400/mo reduce rates; **+1.5% on non-US cards; $15 per dispute**. Polar is a true merchant of record — it is the legal seller and handles EU VAT and global sales tax, which is load-bearing for EU-based Frank.

---

## 0. Prerequisites

- [ ] Decide the selling entity name/details (Polar KYC will ask).
- [ ] Have `products/catalog.json` open — every field below comes from it.
- [ ] Paid payloads staged privately (see §4) — **do not** upload files that would later be public in an open repo.

## 1. Organization creation

1. Go to `https://polar.sh` → Sign up (GitHub login recommended — keeps org linked to `frankxai`).
2. Create organization: suggested slug `agenticincome`. This fixes checkout URLs of the form `https://buy.polar.sh/...` / `https://polar.sh/agenticincome`.
3. Complete the payout/KYC flow (Stripe Connect under the hood): entity details, bank account (NL IBAN fine).
4. Settings → confirm the fee tier shown matches the dossier numbers above; note any change in the dossier at next refresh.

## 2. Product creation (from catalog.json)

Dashboard → Products → **New Product**, once per catalog entry. Copy `name`, `description`, and price exactly from `products/catalog.json`.

| Catalog id | Polar type | Price | Billing |
|---|---|---|---|
| `starter-kit` | **Skip** — free, delivered on-site; do not create in Polar (keeps checkout list clean). Optional later: create as $0 product for list-building via Polar. | — | — |
| `blueprint` | Digital product | $67.00 (6700¢) | One-time |
| `agent-team-pro` | Digital product | $129.00 (12900¢) | One-time |
| `private-intel` | Subscription | $19.00/mo (1900¢) | Monthly recurring |
| `claims-guard-pack` | Digital product | $39.00 (3900¢) | One-time |
| `abos-pack-bundle` | Digital product | $99.00 (9900¢) | One-time |
| `vibe-os-pack` | Digital product | $24.00 (2400¢) | One-time |

**Cross-repo packs (added 2026-08-07):** the three pack products' payloads live in sibling repos, not this one — `claims-guard-pack` and `abos-pack-bundle` in `frankxai/agentic-business-os` (see `packs/claims-guard-pack/PRODUCT.md` and `packs/PRODUCT-BUNDLE.md` there), `vibe-os-pack` in `frankxai/vibe-os` (see its root `PRODUCT.md`). Each PRODUCT.md carries the exact zip recipe. Both source repos are MIT and public; the catalog descriptions already say so — do not add exclusivity language in the Polar fields. Before creating these Polar products: assemble the zip per the PRODUCT.md, upload it as the File Downloads benefit, then set the env var (§5.1) and flip the catalog status (§5.4). Until all three happen, checkout stays refused by construction.

For each product:

1. **Name + description** from catalog.json (they are claims-clean; do not improvise marketing copy in the Polar fields).
2. **Pricing:** fixed price, currency USD (Polar handles buyer-currency presentation and tax).
3. **Checkout success URL:** set to the matching delivery path with checkout metadata:
   - blueprint → `https://agenticincome.ai/delivery/blueprint`
   - agent-team-pro → `https://agenticincome.ai/delivery/agent-team-pro` *(page must be created — see §5.3)*
   - private-intel → `https://agenticincome.ai/delivery/private-intel`
4. Save, then copy the **Checkout Link** for §5.

## 3. License keys

Products → (product) → **Benefits** → Add benefit → **License Keys**.

- `blueprint`: enable license keys — used as the buyer's proof for update access. No activation limit needed (documents, not software); set "expires: never".
- `agent-team-pro`: enable license keys, **expires: 1 year after purchase is WRONG here** — updates are 12 months but the product is perpetual; set key to never expire and note the 12-month update window in the delivery doc instead.
- `private-intel`: license key optional; the subscription state itself gates access. Enable "GitHub Repository Access" benefit later if briefs move to a private repo.

## 4. File delivery upload

Products → (product) → Benefits → **File Downloads** benefit:

- `blueprint`: upload the four files listed in catalog.json `delivery.files` (zip them as `income-architecture-blueprint-v2.zip` AND attach the four .md files individually — buyers on mobile want single files).
- `agent-team-pro`: payload not yet assembled (catalog `_note`). Blocker: assemble `products/agent-team-pro/` payload first. Do not put the product live until the upload exists — the site's request-access fallback handles the interim honestly.
- `private-intel`: upload the current month's brief (`products/private-intel/2026-06-BRIEF.md`, then `ops/brief/`-derived member editions monthly); ongoing delivery is "new file added monthly" + email.

**Repo-privacy rule (from catalog.json `_note`):** before this repo ever goes public, paid payloads (`products/blueprint/*.md` except a public README stub, `products/private-intel/*`, future `products/agent-team-pro/*`) must move to Polar file delivery or a private repo. Add this to the open-sourcing checklist.

## 5. Wiring checkout into the site

There are two checkout paths in `app/api/checkout/route.ts`. Both are wired, both are fail-closed, and they are independent — you can activate either or both.

| | **Path A — static link** (`GET`) | **Path B — API session** (`POST`, preferred) |
|---|---|---|
| Mechanism | Redirects to a checkout link you copy out of the Polar dashboard | Calls the Polar checkouts API and creates a session per click |
| Config | `AGENTIC_INCOME_*_CHECKOUT_URL` via `lib/offers.ts` (`checkout.envKey`) | `POLAR_ACCESS_TOKEN` + `POLAR_PRODUCT_ID_*` via `lib/polar.ts` |
| Gate | Env var present and https | Catalog `status` **and** env, both required |
| Success URL | Baked into the Polar product | Built per product from the catalog's `delivery.path` |
| Attribution | Appends `utm_*`/`ref` to the outgoing URL | Fires `checkout_click` / `checkout_redirect` events |
| Missing config | Honest request-access fallback | 503 + machine-readable `reason` |

Path B is preferred: the success URL follows the catalog instead of a link you copied months ago, and refusals are explicit rather than a silent redirect. Path A stays because the offer-page CTA still uses it whenever Path B is not live.

**Path B's second gate is the point.** Setting the env vars alone cannot open checkout — `products/catalog.json` `status` must also start with `for sale` (see `_checkoutGate` in that file, and §5.4). Setting the catalog alone cannot either. Checkout therefore cannot be opened as a side effect of an environment change or a merge.

### 5.1 Env vars (Vercel → Project → Settings → Environment Variables, Production)

Names and purpose are also documented in `.env.example`.

**Path B (preferred):**

| Env var | Value |
|---|---|
| `POLAR_ACCESS_TOKEN` | Organization Access Token (Polar → Settings → Developers). Server-side only — never `NEXT_PUBLIC_`. |
| `POLAR_PRODUCT_ID_BLUEPRINT` | Polar product id for `blueprint` |
| `POLAR_PRODUCT_ID_PRIVATE_INTEL` | Polar product id for `private-intel` |
| `POLAR_PRODUCT_ID_AGENT_TEAM_PRO` | Leave unset until the payload exists (§4) |
| `POLAR_PRODUCT_ID_CLAIMS_GUARD_PACK` | Leave unset until the pack zip is uploaded (§2, cross-repo packs) |
| `POLAR_PRODUCT_ID_ABOS_PACK_BUNDLE` | Leave unset until the bundle zip is uploaded (§2, cross-repo packs) |
| `POLAR_PRODUCT_ID_VIBE_OS_PACK` | Leave unset until the pack zip is uploaded (§2, cross-repo packs) |
| `POLAR_SUCCESS_URL` | Site origin, e.g. `https://agenticincome.ai`. The per-product path comes from the catalog's `delivery.path`. |

**Path A (legacy static links):**

| Env var | Value |
|---|---|
| `AGENTIC_INCOME_BLUEPRINT_CHECKOUT_URL` | Polar checkout link for blueprint |
| `AGENTIC_INCOME_PRIVATE_INTEL_CHECKOUT_URL` | Polar checkout link for private-intel |
| `AGENTIC_INCOME_AGENT_TEAM_PRO_CHECKOUT_URL` | Polar checkout link for agent-team-pro *(new — requires §5.2)* |

Redeploy after setting. The route reads env at request time, but the statically-rendered offer pages call `checkoutUrl()` and `isCheckoutLive()` at render — they keep showing the old state until rebuilt.

No CSP change is needed: checkout is a top-level navigation to Polar, not an embedded frame or a cross-origin XHR, so `connect-src 'self'` in `vercel.json` still covers the `POST /api/checkout` call. If Polar checkout is ever embedded in an iframe instead, `frame-src` has to be widened — and that is a deliberate decision, not a patch.

### 5.2 Code touches (exact files)

1. **`lib/offers.ts`** — add an `agent-team-pro` offer entry (copy the `blueprint` entry shape) with:
   - `slug: 'agent-team-pro'`, `price: '$129'`, `checkout: { provider: 'external', envKey: 'AGENTIC_INCOME_AGENT_TEAM_PRO_CHECKOUT_URL', fallback: 'request-access' }`, `deliveryPath: '/delivery/agent-team-pro'`.
   - `refundPolicy` fields: the 30-day no-questions text (§7) is already live on `blueprint` and `private-intel` (updated 2026-07-11); give `agent-team-pro` the same text when its entry is created.
2. **`app/delivery/agent-team-pro/page.tsx`** — create (copy `app/delivery/blueprint/page.tsx` as the pattern).
3. **`app/offers/[slug]/page.tsx`** — no changes needed; it renders from `lib/offers.ts` automatically (including the new offer via `generateStaticParams`).
4. **`app/pack/page.tsx`** — currently links only to GitHub + `/start`. Add one `cta-secondary` link to `/offers/agent-team-pro` ("The pro crew") once live — the pack page is the natural upgrade surface.
5. **`components/ProductLadder.tsx`** — check whether the home-page ladder lists Agent Team Pro; add the rung if not.
6. **`products/FULFILLMENT_RUNBOOK.md`** — update the Offer States table: provider = Polar, add agent-team-pro row, flip states as links go live.

### 5.3 Delivery pages

- Existing: `/delivery/blueprint`, `/delivery/private-intel`, `/delivery/starter-kit` (in `app/delivery/`).
- Create: `/delivery/agent-team-pro`.
- Each paid delivery page should state: what was purchased, the file list, the license line, the 30-day refund line, and the support boundary.

### 5.4 Flip the catalog status gate (Path B only — do this last)

Nothing above opens checkout on its own. The final gate is `products/catalog.json`, and it should only be flipped once the Polar product exists, the files are uploaded, and the env vars are set:

```diff
       "id": "blueprint",
-      "status": "built — checkout gated pending Polar product and file upload"
+      "status": "for sale — private delivery via Polar"
```

The gate is the literal prefix `for sale` (case-insensitive), checked by `PURCHASABLE_STATUS_PREFIX` in `lib/polar.ts`. Any other wording keeps the product refused, so a typo fails closed rather than opening a sale.

Rules that stay in force:

- `starter-kit` keeps its free status — it is delivered on-site and must never be sold through checkout. `POST /api/checkout` refuses it with `free_product` regardless of env.
- `agent-team-pro` keeps `payload not assembled — not for sale` until the payload in §4 actually exists. Do not flip it to sell a product that has nothing to deliver.
- `claims-guard-pack`, `abos-pack-bundle`, and `vibe-os-pack` keep their gated status until their zips (assembled from the sibling repos per §2, cross-repo packs) are uploaded to Polar AND their `/delivery/<id>` pages exist (§5.3 pattern — none are created yet). Same rule: nothing to deliver, nothing for sale.
- The `_note` repo-privacy rule still applies: paid payloads must be out of the public tree, or the repo stays private.

Once flipped and redeployed, `/offers/blueprint` renders a real buy button instead of "Reserve Blueprint access" (label from `checkout.buyLabel` in `lib/offers.ts`), and the access-path panel says checkout is live.

**Rolling back:** unset `POLAR_ACCESS_TOKEN` and redeploy, or revert the status string. Either one independently returns every surface to the request-access state — neither leaves a page claiming a product is buyable when it is not.

## 6. Test-purchase checklist (per paid product — do not skip)

> **Path B has never touched the live Polar API.** The request shape in `lib/polar.ts` (`POST https://api.polar.sh/v1/checkouts/` with `{ products: [id], success_url }`, reading `url` off the response) was written against Polar's documented current API — `products` as an array, since the singular `product_id` is deprecated — but outbound calls to `api.polar.sh` are blocked from the environment it was built in, so it has only been verified as far as "the gates open and the request is attempted." The first item below is therefore a genuine test, not a formality. If Polar answers unusably the route returns 502 `checkout_upstream_failed` and the button falls back to request-access, so a wrong field name degrades to the honest state rather than a broken checkout.


- [ ] Polar sandbox OR a real purchase with your own card (real is better; refund after).
- [ ] Path B: `agenticincome.ai/offers/<slug>` → CTA is a buy button → click reaches a Polar-hosted checkout (not the request-access fallback).
- [ ] Path B: `POST /api/checkout` with a still-gated id (e.g. `agent-team-pro`) returns 503 `checkout_gated`, and with `starter-kit` returns 400 `free_product`. Confirm before announcing — this is the guard that stops an unfinished product being sold.
- [ ] Path A (if used): `/api/checkout?offer=<slug>` redirects to Polar (not the request-access fallback).
- [ ] `utm_source=test&ref=qa` on the offer URL survives to the Polar checkout URL (attribution passthrough).
- [ ] Complete purchase → redirected to the correct `/delivery/<slug>` page.
- [ ] Receipt email arrives from Polar; seller name is correct.
- [ ] File download works; license key issued (where enabled).
- [ ] VAT: test with a EU billing address once — invoice must show VAT handled by Polar as MoR.
- [ ] Refund the test purchase from the Polar dashboard; confirm refund email.
- [ ] `private-intel` only: confirm subscription shows as active, then cancel; confirm access-state change.
- [ ] Check the site's analytics events fired: `checkout_click`, `checkout_redirect` (state `provider_checkout`).

## 7. Refund policy text (publish on /trust and in each Polar product description footer)

> **Refunds — 30 days, no questions.** If a paid product isn't what you needed, reply to your receipt or email us within 30 days of purchase and we refund it in full. No forms, no exit interview. (Private Intel: cancel anytime from the Polar customer portal; if your first month wasn't useful, ask and we'll refund it.) Refunds are processed by Polar.sh, our merchant of record, back to your original payment method.

`lib/offers.ts` `refundPolicy` fields already match for blueprint + private-intel (updated 2026-07-11). Still to update: `agent-team-pro` when its offer entry is created, `/trust` page copy, `products/FULFILLMENT_RUNBOOK.md` support boundaries.

## 8. After launch

- [ ] Add Polar webhook → `ANALYTICS_WEBHOOK_URL` pipeline (order.created, subscription.canceled) for the morning-brief loop.
- [ ] Record fee actually charged on first real sale vs. dossier §3; log drift in the dossier at next refresh.
- [ ] Move this runbook's completed state into `products/FULFILLMENT_RUNBOOK.md` ("Latest Verification Snapshot" pattern).
