# Polar self-serve fulfillment and fail-closed checkout checklist

> **Part of the Agentic Income Operating Desk Blueprint v3.0 · Personal commercial license.**

Selling digital packs across borders introduces immediate VAT, GST, and sales-tax compliance obligations. Using a **Merchant of Record (MoR)** makes the platform the legal seller of record so tax calculation, collection, invoicing, and remittance happen automatically at checkout.

This checklist walks through configuring **Polar.sh** as your primary MoR, wiring a **3-gate fail-closed checkout client**, and completing a **12-point live purchase and refund rehearsal** before announcing availability.

---

## 1. Merchant-of-record comparison (verified as of September 2026)

*Source note: Platform fee schedules below were verified against official pricing documentation on September 28, 2026 (`polar.sh/docs/merchant-of-record/fees`, `support.stripe.com/questions/managed-payments-pricing`, `paddle.com/pricing`, `gumroad.com/pricing`, `docs.whop.com/fees`). Re-check live fee tables when creating your organization.*

| Platform | Headline fee (as of Sept 2026) | True MoR (EU VAT & US sales tax)? | Best technical fit | Key operational caveat |
|---|---|---|---|---|
| **Polar.sh** | `5% + $0.50/txn` on Starter (orgs created on/after May 27, 2026); `+1.5%` non-US cards; `$15` dispute fee; lower rates on paid Pro/Growth tiers | **Yes** | Developer-first digital packs, file downloads, license keys, GitHub repo access, and clean REST checkouts API | Always test Path B (`POST /v1/checkouts/`) with a real card before flipping catalog status |
| **Stripe Managed Payments** | `3.5%` per transaction **on top of** standard Stripe card processing fees | **Yes** | Existing Stripe-native SaaS businesses migrating from Lemon Squeezy | Invite/rollout gating across jurisdictions as of 2026; higher combined effective rate than raw Stripe |
| **Paddle** | `5% + $0.50/txn` standard | **Yes** | Established B2B SaaS subscriptions | Manual domain and product approval review adds friction for one-off Markdown/code packs |
| **Gumroad** | `10% + $0.50/txn` + payment processing (`~2.9% + $0.30`); `30%` via Discover | **Yes** | Zero-code audience storefronts | Highest take rate (`~13% to 19%` effective on direct links) |
| **Whop** | `2.7% + $0.30` base + opt-in tax/MoR (`+2%`), billing (`+0.5%`), international (`+1.5%`) | **Yes, when tax add-on enabled** | Paid communities paired with downloadable templates | Tax remittance is an opt-in toggle via Numeral; verify it is active before first EU sale |

---

## 2. Three-gate fail-closed checkout architecture

Never let a missing environment variable, a merge conflict, or an half-assembled product open a live payment button. Enforce **three independent server-side gates** that must all evaluate true before a checkout session can exist:

1. **Gate 1 · Catalog status prefix (`products/catalog.json`):** The product's `status` string must explicitly start with `"for sale"` (case-insensitive). Every other string (`"built: checkout gated..."`, `"payload not assembled..."`, `"free..."`) refuses checkout with `checkout_gated` or `free_product`.
2. **Gate 2 · Explicit SKU-to-env allowlist (`PRODUCT_ID_ENV_KEYS`):** Each paid catalog ID maps explicitly to its own environment variable (`POLAR_PRODUCT_ID_BLUEPRINT`). Unmapped IDs fail closed rather than falling back to a default SKU.
3. **Gate 3 · Runtime credentials present (`process.env`):** Both `POLAR_ACCESS_TOKEN` (server-only, never `NEXT_PUBLIC_`) and the specific SKU's `POLAR_PRODUCT_ID_*` must be non-empty, and the upstream Polar response must return a valid `https:` checkout URL within timeout.

### Reference server check (TypeScript)

```typescript
const PURCHASABLE_PREFIX = 'for sale'

const PRODUCT_ENV_MAP: Record<string, string> = {
  blueprint: 'POLAR_PRODUCT_ID_BLUEPRINT',
  'private-intel': 'POLAR_PRODUCT_ID_PRIVATE_INTEL',
}

export function canCreateCheckout(product: { id: string; price_cents: number; status: string }): boolean {
  if (product.price_cents <= 0) return false
  if (!product.status.trim().toLowerCase().startsWith(PURCHASABLE_PREFIX)) return false
  const envKey = PRODUCT_ENV_MAP[product.id]
  if (!envKey) return false
  return Boolean(process.env.POLAR_ACCESS_TOKEN?.trim() && process.env[envKey]?.trim())
}
```

### Graceful buyer fallback rule

When `canCreateCheckout` returns `false`, or if `https://api.polar.sh/v1/checkouts/` times out or returns non-200, the offer page renders `"Reserve access"` / `"Request access"` and scrolls cleanly to `#request-access`. The buyer never hits a dead `500` page or a broken payment link.

---

## 3. Polar.sh dashboard setup sequence

Complete these steps in the Polar dashboard before touching production environment variables:

- [ ] **Step 1 · Organization & KYC:** Create your Polar organization, link your payout bank account (IBAN / ACH via Stripe Connect), and verify legal seller display details.
- [ ] **Step 2 · Build & checksum archive:** Generate `MANIFEST.json` for your delivered files, verify every SHA-256 hash locally, and build a versioned `.zip` archive (for example, `agentic-income-operating-desk-v3.0.0.zip`) alongside individual files for mobile readers.
- [ ] **Step 3 · Create Polar product:** Copy `name`, `description` (claims-audited, zero hype), and exact USD price (`$67.00` = `6700` cents, one-time) directly from `products/catalog.json`.
- [ ] **Step 4 · Attach File Downloads benefit:** Upload the `.zip` archive plus the individual `.md`, `.csv`, and `.json` files listed in `catalog.json` `delivery.files`.
- [ ] **Step 5 · Attach License Keys benefit:** Enable perpetual license keys (`expires: never`) so buyers have cryptographic proof of purchase for version `3.x` updates.
- [ ] **Step 6 · Configure success redirect:** Set `POLAR_SUCCESS_URL` to `https://yourdomain.com` so the server constructs `https://yourdomain.com/delivery/blueprint` per product.
- [ ] **Step 7 · Set server environment variables:** Add `POLAR_ACCESS_TOKEN`, `POLAR_PRODUCT_ID_BLUEPRINT`, and `POLAR_SUCCESS_URL` to Production environment variables (server-side only) and redeploy.

---

## 4. Mandatory 12-point live test-purchase and refund rehearsal

> **Human money gate:** Only the business owner executes live card tests, pricing changes, or refund actions. Complete all 12 checks below before announcing a product launch.

- [ ] **01 · Gated SKU refusal test:** `POST /api/checkout` with an unreleased SKU ID returns `503` (`reason: "checkout_gated"`).
- [ ] **02 · Free SKU refusal test:** `POST /api/checkout` with `starter-kit` returns `400` (`reason: "free_product"`).
- [ ] **03 · Offer CTA switch:** `/offers/blueprint` renders the live buy label (`Get the Blueprint`) while still keeping the backup `#request-access` anchor available below.
- [ ] **04 · Attribution passthrough:** Visiting `/offers/blueprint?utm_source=rehearsal&ref=desk` preserves attribution parameters or logs `checkout_click` / `checkout_redirect` cleanly without leaking PII.
- [ ] **05 · Hosted Polar session:** Clicking buy navigates over `https:` to `polar.sh` displaying the exact `$67.00` price and local VAT calculation.
- [ ] **06 · EU VAT / tax invoice verification:** Complete a real purchase and verify the receipt PDF names Polar.sh as merchant of record with compliant VAT treatment.
- [ ] **07 · Delivery redirect:** Post-purchase redirect lands `200 OK` on `/delivery/blueprint` with `noindex, nofollow` robots metadata.
- [ ] **08 · File download & SHA-256 check:** Download every attached file from the buyer portal and run the `00-README.md` SHA-256 verification snippet against `MANIFEST.json` (`0` mismatches).
- [ ] **09 · License key issuance:** Confirm a valid, non-expiring license key appears in the buyer receipt.
- [ ] **10 · 30-day refund execution:** Issue a full refund on the test order from the Polar dashboard and confirm the buyer refund email arrives promptly.
- [ ] **11 · Emergency rollback drill:** Verify you can close checkout in under two minutes either by unsetting `POLAR_PRODUCT_ID_BLUEPRINT` in hosting settings or changing `catalog.json` `status` back to `"built: checkout gated"`, returning the UI cleanly to `#request-access`.
- [ ] **12 · Receipt logged:** Record the rehearsal date, deployment ID, and pass status in `products/FULFILLMENT_RUNBOOK.md`.
