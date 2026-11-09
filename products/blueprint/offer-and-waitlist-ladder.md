# Evidence-backed offer and waitlist ladder

> **Part of the Agentic Income Operating Desk Blueprint v3.0 · Personal commercial license.**

Most technical creators either give away 100% of their work with no commercial path, or jump straight from free blog posts to a `$1,500` course that nobody trusts yet. An evidence-backed offer ladder bridges that gap in four explicit stages, using **inspectable file manifests** and **waitlist-first validation** so you never build a large product in the dark.

---

## 1. The four-stage self-serve offer ladder

Design your ladder so every rung solves the exact bottleneck created by completing the previous rung:

| Stage | Price band | Buyer job | What ships | Access & validation gate |
|---|---|---|---|---|
| **Stage 01 · Entry (`entry`)** | `Free ($0)` | Complete one concrete 30-minute win and verify your teaching quality firsthand | Direct on-site Markdown checklist, starter template, or open-source MIT CLI | Live on-site from Day 1; zero login wall required to read or download |
| **Stage 02 · Focused pack (`pack`)** | `$24 to $39` | Automate or audit one narrow, recurring task without assembling files from scratch | Single-purpose skill pack, script utility, or pre-publish audit checklist (`PRODUCT.md` + `.zip`) | Gated `#request-access` waitlist until 15+ qualified signups or packaged `.zip` passes test checkout |
| **Stage 03 · Operating system (`system`)** | `$67 to $129` | Install the complete multi-file desk, templates, CSV ledgers, and verification runbooks | Versioned multi-file blueprint or 4-pack governance bundle with `MANIFEST.json` SHA-256 digests | Full file-tree preview (`PackInspector`) + 30-day no-questions Polar.sh refund |
| **Stage 04 · Continuity & sprints (`continuity`)** | `$19/mo` or `Scoped proposal` | Stay current on monthly partner/pricing diffs, or get a workflow implemented on an isolated git branch | Monthly dated `YYYY-MM-BRIEF.md` report, or a milestone-gated repository sprint (`scope-first`) | Continuity gated until 3 sample briefs exist; sprints take zero on-site payment before written scope |

### Why `$19 to $149` is the self-serve trust band

Below `$19`, merchant-of-record fixed fees (`$0.50` per transaction) and support overhead compress unit margin. Above `$149`, technical buyers reasonably expect live onboarding calls, custom troubleshooting, or team SLAs. Inside `$24 to $129`, a buyer can evaluate your verbatim file excerpts, verify your refund policy, and purchase asynchronously in three minutes without a sales call.

---

## 2. Waitlist-first validation protocol (never fake a live checkout)

Before you spend 30 hours packaging a new paid SKU, publish its honest `PRODUCT.md` specification and measure real buyer intent:

1. **Write the `PRODUCT.md` contract first (60 minutes):** List the exact planned file tree, target price, license terms, and an explicit `"Who should skip this"` section.
2. **Expose the specification publicly on `/offers/<slug>`:** Render `status: "checkout gated pending packaged zip and Polar upload"` in your catalog JSON. Never render a fake "Buy Now" button that leads to a "Coming Soon" modal; deceptive door-test buttons destroy technical credibility.
3. **Collect `#request-access` signups tagged by `offer-<slug>`:** Tell the visitor plainly whether their request is stored in your webhook CRM or routed via concierge email, and confirm that zero payment is taken while gated.
4. **Apply the build-or-cut threshold at Day 30:**
   - **10+ organic waitlist requests from high-intent comparison pages:** Assemble the v1.0 archive, generate `MANIFEST.json`, upload to Polar.sh, complete a real-card test purchase, and flip `status` to `"for sale"`.
   - **Under 5 requests after 300+ qualified offer-page views:** Interview the few signups or archive the SKU spec cleanly before sinking build weeks into an unwanted pack.

---

## 3. Copyable TypeScript & JSON offer contract

Drop this schema into `lib/offers.ts` and `products/catalog.json` so your public UI, MCP server, and checkout route share a single source of truth:

```typescript
export type OfferStage = 'entry' | 'pack' | 'system' | 'continuity'

export type OfferRecord = {
  slug: string
  tier: string
  ladderStage: OfferStage
  title: string
  shortTitle: string
  price: string
  summary: string
  promise: string
  cta: string
  audience: string
  firstWin: string
  deliverables: string[]
  outcomes: string[]
  skipIf: string
  buyIf: string
  deliveryPath: string
  refundPolicy: string
  checkout: {
    provider: 'internal' | 'external'
    envKey?: string
    fallback: 'delivery' | 'request-access'
    buyLabel?: string
  }
}
```

### Matching `products/catalog.json` entry (fail-closed by construction)

```json
{
  "id": "claims-audit-kit",
  "name": "Pre-Publish Claims Audit Kit",
  "price_cents": 3900,
  "interval": null,
  "status": "built: checkout gated pending Polar product and file upload",
  "description": "Deterministic 5-gate copy and disclosure checklist for technical publishers. Evaluates earnings claims, dated vendor citations, inline FTC/EU disclosures, and page clarity. Editorial tool only, never legal advice.",
  "delivery": {
    "type": "polar-files",
    "path": "/delivery/claims-audit-kit",
    "files": [
      "products/claims-audit-kit/00-README.md",
      "products/claims-audit-kit/SKILL.md",
      "products/claims-audit-kit/rules.json",
      "products/claims-audit-kit/MANIFEST.json"
    ]
  },
  "license": "Personal commercial license for the buyer's own repositories. Not for resale or redistribution."
}
```

---

## 4. Pre-publish copy audit for every offer page

Before committing any offer update to `lib/offers.ts` or `products/*/PRODUCT.md`, verify all six lines below pass:

- [ ] **Deliverable 1:1 parity:** Every bullet in `deliverables` maps to a real file in `delivery.files` (or is explicitly labeled `product-specification` while waitlist-gated).
- [ ] **Zero outcome or earnings promises:** Search the draft for `earn`, `passive`, `guaranteed`, `autopilot`, multiplier slogans, `ROI`, and `$` figures; ensure `$` appears only in verified vendor prices, product prices, or explicitly labeled arithmetic scenarios.
- [ ] **Candid `"Skip this if"` block:** Names at least two concrete buyer profiles who should *not* buy (for example, buyers needing legal counsel, video courses, or done-for-you implementation).
- [ ] **Open-source transparency (when packaging MIT code):** If the underlying skill or script is MIT-licensed in a public GitHub repository, state that plainly on the offer page and link the public repository so buyers pay knowingly for the curated, checksummed bundle.
- [ ] **Refund clarity above the fold:** States the exact 30-day no-questions refund mechanism via your merchant of record before the buyer clicks checkout.
- [ ] **Punctuation and voice restraint:** Sentence-case headings, zero `ALL CAPS` hype badges, zero rhetorical contrast formulas, and zero prohibited internal orchestration jargon.
