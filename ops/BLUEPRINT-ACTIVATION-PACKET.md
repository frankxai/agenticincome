# $67 Agentic Income Blueprint — Activation Decision Packet (`exp-002`)

**Issue:** `frankxai/agenticincome#103` (Item 1) · **Experiment:** `exp-002-blueprint-live-checkout` (`vault/experiments.json`)
**Owner / Approver:** Frank (`frankxai`) · **Spend Budget:** `$0` · **Merchant of Record:** Polar.sh

This 1-page packet defines the exact repository state, Vercel environment variables, buyer surfaces, refund/support workflow, and pre-activation merge sequence required to turn on the **$67 Agentic Income Blueprint** (`id: "blueprint"`).

---

## 1. What Flips in `products/catalog.json` and `lib/polar.ts`

### A. Catalog Gate (`products/catalog.json`)
- **Current state on `main`:** Already flipped.
  - `id`: `"blueprint"`
  - `price_cents`: `6700` (`$67.00` one-time)
  - `status`: `"for sale — private delivery via Polar"` (starts with `"for sale"`, so `catalogRefusal(product)` in `lib/polar.ts` returns `null`).
  - `delivery.path`: `"/delivery/blueprint"`
- **Deliverable file reconciliation (PR #121):**
  - On `main`, `products/blueprint/` contains **5 Markdown files** (`00-README.md`, `AGENTIC_INCOME_BLUEPRINT.md`, `service-kit.md`, `product-kit.md`, `system-kit.md`), whereas `products/catalog.json` on `main` lists only **4** of them (`00-README.md`, `service-kit.md`, `product-kit.md`, `system-kit.md`). `AGENTIC_INCOME_BLUEPRINT.md` ships in the repo but is not declared in the catalog.
  - **Action before live activation:** Merge PR `#121` (`fix/blueprint-v3-deliverables-reconciliation`), which adds `execution-roadmap-30-60-90.md`, `case-study-flywheel.md`, and `kill-criteria-and-guardrails.md` and reconciles `products/catalog.json`, `lib/offers.ts`, `lib/pack-manifests.ts`, and `/delivery/blueprint` to the exact 7-file package contract.

### B. Environment Gate (`lib/polar.ts` + Vercel Production Env)
`lib/polar.ts` fails closed until three environment variables exist in Vercel (`agenticincome` project, Production environment):

| Variable | Value / Source | Purpose in `lib/polar.ts` |
| --- | --- | --- |
| `POLAR_ACCESS_TOKEN` | Polar Organization Access Token (`checkouts:write` scope only) | Authenticates `POST https://api.polar.sh/v1/checkouts/` in `createCheckoutSession()` |
| `POLAR_PRODUCT_ID_BLUEPRINT` | Polar Product UUID (`prod_...`) for the $67 one-time Blueprint product | Mapped via `PRODUCT_ID_ENV_KEYS['blueprint']`; prevents cross-product checkout |
| `POLAR_SUCCESS_URL` | `https://www.agenticincome.ai` | Combined with `product.delivery.path` (`/delivery/blueprint`) to build `success_url: "https://www.agenticincome.ai/delivery/blueprint"` |

- **Sandbox verification note (PR #118):** If testing with a `sandbox.polar.sh` token first, merge PR `#118` (`fix/polar-sandbox-isolation`) so `POLAR_SERVER=sandbox` routes only non-production environments to `sandbox-api.polar.sh` while production remains fail-closed against sandbox tokens.
- **What stays gated:** Leaving `POLAR_PRODUCT_ID_AGENT_TEAM_PRO`, `POLAR_PRODUCT_ID_PRIVATE_INTEL`, `POLAR_PRODUCT_ID_CLAIMS_GUARD_PACK`, `POLAR_PRODUCT_ID_ABOS_PACK_BUNDLE`, and `POLAR_PRODUCT_ID_VIBE_OS_PACK` unset guarantees only `blueprint` becomes purchasable (`isCheckoutLive('blueprint') === true`), while every other paid tier stays in `request-access` mode.

---

## 2. Unit Economics

- **Committed scenario:** none yet models the Blueprint. The nearest committed scenario in `vault/margins.json` is `gencreator-byok-pack-polar` (`$29` hypothesis price, `93.3%` gross margin). The arithmetic below is a standalone calculation at the `$67` catalog price and is not stored as a vault scenario.
- **Price hypothesis:** `$67.00` (`priceIsHypothesis: true`)
- **Selling fee (`polar-starter-fee`):** `5% + $0.50` per transaction on the free Starter tier (source `https://polar.sh/resources/pricing`, retrieved `2026-10-25`; consistent with `ops/POLAR-SETUP.md`). At `$67.00`: `$3.35 + $0.50 = $3.85`.
- **Net kept before international/payout surcharges:** `$63.15` (`94.3%` gross margin)
- **Not modelled above:** `+1.5%` on non-US cards (relevant for an EU-based seller), `$15` per dispute, and Stripe payout pass-through (`$2/month` active payouts, `0.25% + $0.25` per payout, `0.25-1%` cross-border FX).
- **Variable AI inference COGS:** `$0.00` (static Markdown operating kits)

---

## 3. What the Buyer Sees

### A. Before Purchase: `/offers/blueprint` (`app/offers/[slug]/page.tsx`)
1. When `isCheckoutLive('blueprint')` flips to `true`, the primary CTA button changes from `"Reserve Blueprint access"` (scroll to `#request-access`) to **`"Get the Blueprint — $67"`** (`BuyButton` component).
2. Clicking **`"Get the Blueprint — $67"`** sends `POST /api/checkout` with `{ "productId": "blueprint" }`.
3. `app/api/checkout/route.ts` calls `createCheckoutSession('blueprint')` and returns `{ "url": "https://polar.sh/checkout/..." }`, redirecting the buyer to Polar's hosted checkout page (VAT/sales tax handled by Polar as Merchant of Record).
4. In MCP (`https://www.agenticincome.ai/api/mcp`), `list_products` automatically flips `blueprint.purchasable` from `false` to `true` and `blueprint.refusal` from `"checkout_unconfigured"` to `null`.

### B. After Purchase: `/delivery/blueprint` (`app/delivery/blueprint/page.tsx`)
1. Polar sends the buyer two things immediately upon payment:
   - The **VAT-compliant receipt email** with the attached `agentic-income-blueprint-v1.zip` download link from Polar.
   - An automatic redirect (`success_url`) to `https://www.agenticincome.ai/delivery/blueprint`.
2. On `/delivery/blueprint`, the buyer sees:
   - Firing of the privacy-safe `delivery_view` analytics event (`offer: 'blueprint'`).
   - The 4-step install order:
     1. **01 Confirm receipt** — Use the Polar receipt and attached zip archive as access proof.
     2. **02 Install the desk** — Read `00-README.md`, then configure the catalog, comparison template, offer ladder, and disclosure language in sequence.
     3. **03 Publish one loop** — Ship one citable comparison with the payer route, email capture, and product upgrade path connected.
     4. **04 Review support boundary** — Template-level documentation and release errata included; custom implementation work stays scoped separately under Implementation Sprint.

---

## 4. Refund Policy & Support Path

- **Refund Policy (`lib/offers.ts` & `/offers/blueprint`):**
  - **30-day no-questions refund via Polar.sh (Merchant of Record).**
  - Buyer replies to their Polar receipt email (or contacts support with their Polar order receipt) within 30 calendar days of purchase for a 100% refund issued through the Polar dashboard.
- **Support Path & Boundaries:**
  - **Included:** Self-serve Markdown install documentation (`00-README.md`), schema validation scripts, and packaged errata updates on Polar.
  - **Excluded (explicitly disclosed prior to checkout):** Done-for-you repository implementation, custom consulting, or guaranteed financial outcomes. Buyers seeking hands-on build execution are routed to `/offers/implementation-sprint`.

---

## 5. 5-Minute Execution Checklist for Frank (`exp-002` Human Gate)

1. [ ] **Merge PR #121** (`fix/blueprint-v3-deliverables-reconciliation`) so all 7 files in `products/blueprint/` match `products/catalog.json`.
2. [ ] **Build the release archive:**
   ```bash
   zip -j /tmp/agentic-income-blueprint-v1.zip products/blueprint/*.md
   ```
3. [ ] **Create the Polar product:** In Polar dashboard -> Products -> New Product -> Name: `Agentic Income Blueprint`, Price: `$67.00` USD one-time, attach `/tmp/agentic-income-blueprint-v1.zip`, copy Product ID (`prod_...`).
4. [ ] **Set Vercel Production env vars** (`agenticincome` project) and redeploy:
   - `POLAR_ACCESS_TOKEN` = `<polar_oat_...>`
   - `POLAR_PRODUCT_ID_BLUEPRINT` = `<prod_...>`
   - `POLAR_SUCCESS_URL` = `https://www.agenticincome.ai`
5. [ ] **Run post-deploy smoke check (`ops/POLAR-SETUP.md`):**
   ```bash
   curl -s -X POST https://www.agenticincome.ai/api/checkout \
     -H 'content-type: application/json' \
     -d '{"productId":"blueprint"}'
   ```
   Verify `200 OK` with `{"url":"https://...polar..."}` and confirm `{"productId":"agent-team-pro"}` still returns `409 {"error":"checkout_gated"}`.
