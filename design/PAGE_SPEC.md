# Homepage Page Spec — 2026-07-24

## Audience

Founder-led teams with one valuable workflow or domain advantage who need a
credible revenue system implemented, not a broad AI transformation pitch.

## Conversion

Primary: inspect and request the scoped Implementation Sprint. Secondary:
inspect and run the public Agentic Income system. Product and research routes
remain available for lower-commitment users.

## Scene Order

1. Category, promise, implementation CTA, public-source CTA, four-stage product proof, artifact rail.
2. Agent-as-a-Service, products, open source, editorial authority.
3. One inspectable workflow with exact command, source links, output artifact, and human publish gate.
4. Offer ladder with explicit access and pricing states.
5. Dated, disclosed recommendation method.
6. Research and final implementation CTA.

## Public install contract

- Every executable install command must run against
  `https://github.com/frankxai/agentic-income-skills`.
- Public source and MIT links must resolve to that public repository or one of
  its files.
- The public command path is the repository's actual package surface:
  `income:init`, `income:validate`, and `test`.
- Do not advertise a Claude marketplace, plugin command, or one-command install
  that depends on the private application repository.
- Do not link the private application repository from `app/`, `components/`, or
  `lib/`.

No hero video or WebGL is introduced by this repair. Existing composition,
motion, responsive behavior, and visual tokens remain unchanged.

## Command preview truth repair — 2026-10-16

Surface: `/command` metadata and introductory copy, plus `components/IncomeCommandDesk.tsx`.

The route is a public illustrative interface. No account identity, access-control boundary,
live agent fleet, approval queue, revenue, CI result, or activity receipt is established by
this page. Display unconnected or unverified values and explicitly illustrative workflow
examples. Do not use relative timestamps, green verified states, fleet counts, or passing
checks as substitutes for connected evidence. The connected-activity view remains empty.

This repair changes text and example data in the existing composition. Authentication,
telemetry, data adapters, commerce, and production release remain separate implementation
work. Recheck desktop, mobile, keyboard, and reduced-motion output before promotion.

## Evidence Observatory Private Review Dashboard — 2026-11-02

Surface: Standalone HTML artifact generated via `scripts/query-observatory.mjs --format html` backed by `lib/observatory-health.mjs`.

### Audience

Internal research editors, systems architects, and review teams evaluating catalog evidence health, coverage completeness, and observation conflicts before any public ranking or commercial claims.

### Purpose and Conversion

The dashboard enforces the core thesis: "Evidence before rankings." It is an internal triage and audit tool, not a public promotion or customer portal. Outcome: pinpoint evidence freshness decay, missing core dimensions, and conflicting observations to prioritize research queue tasks.

### Scene Structure

1. **Header & Provenance**: Category eyebrow (`AGENTIC INCOME / PRODUCT INTELLIGENCE`), headline, snapshot timestamp, and audit timestamp with explicit unapproved publication notice.
2. **Evidence Metrics Grid**: 8 responsive metric cards displaying products in scope, distinct linked sources, total observations, mean tested coverage, stale sources (> policy threshold), ranking gate eligibility count, mean scored coverage, and unverified revenue status ("Unknown").
3. **Operational Policy Thresholds**: Clear callout of the 70% weighted coverage bar and mandatory tested outcome reliability, unit economics, and retention criteria.
4. **Interactive Catalog Filter**: Live client-side search input filtering across product name, layer, model, and evidence with an active match counter.
5. **Product Detail Cards**: Structured articles with layer badge, customer job, revenue model, revenue evidence level, native `<meter>` bars for scored and tested coverage, eligibility status badge, and an expandable `<details>` evidence drawer revealing unknown dimensions, linked sources with freshness tags, and signal counts.
6. **Integrity & Security Footer**: Explicit boundary declaration documenting zero external connections, credentials, or tracking.

### Design Contract & Accessibility

- Standalone zero-dependency HTML with strict CSP (`default-src 'none'; script-src 'sha256-...'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'`).
- Fully escaped dynamic text preventing HTML injection.
- Keyboard accessible with distinct emerald `:focus-visible` outlines (`outline: 3px solid #10b981; outline-offset: 4px`).
- Mobile responsive layout reflowing the metrics grid from 4 to 2 columns below 650px.
- Dedicated print stylesheet hiding search and expanding details for archival reporting.

## Offer ladder, file-tree inspection, and starting-kit fit check — 2026-11-03

Surface: `/offers`, `/offers/[slug]`, `/start`, `components/PackInspector.tsx`,
`components/OperatorFitCheck.tsx`, `components/ProductLadder.tsx`, `lib/pack-manifests.ts`,
and `public/images/products/plate-*.svg`.

1. **Inspect-before-you-buy workbench (`PackInspector`):** Every offer route renders file
   excerpts, byte sizes, and line counts generated deterministically by
   `scripts/build-pack-manifests.mjs` from verified repository files (`products/catalog.json`
   deliverables, `public/downloads/agentic-income-starter-kit.md`, `products/*/PRODUCT.md`,
   and `products/FULFILLMENT_RUNBOOK.md`). No fictional file sizes or synthetic excerpts are
   displayed.
2. **Starting-kit fit check (`OperatorFitCheck`):** Four-question customer-facing diagnostic
   on `/start` and `/offers` computing a deterministic Week-1 checklist locally (`lib/fit-check.ts`)
   with a one-click `Copy Markdown plan` action. Optional email capture is disclosed as a
   general release-updates subscription that does not send or store diagnostic answers.
3. **Fail-closed checkout and fallback anchor:** `products/catalog.json` governs Polar
   availability (`lib/polar.ts`). Non-free offers without a legacy static checkout URL retain
   `#request-access` on `/offers/[slug]` so `PolarCheckoutButton` and `/api/checkout` GET
   fallbacks always resolve to a reachable form.
