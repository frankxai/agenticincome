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

## Blueprint preview boundary, Codex, 4 November 2026

Author: Codex (OpenAI). Revision: 1. Source: Vercel finding
`01M6J55D5BAMAXNA2W773AVTB1` at `e427da72ce2a3ca28777ca87658c29fab12692ef`.
Review state: source regression verified; preview and release checks pending.

The public CSV excerpt uses a separate, explicitly chosen header and two real
records from the delivered file. Its badge says `2-row CSV sample`. File sizes,
line counts and the seven-file package continue to describe the complete paid
delivery. A short protected file needs an explicit partial sample; generation
fails before replacing the last safe manifest when a whole file would be exposed.
Complete public Starter Kit samples remain allowed. This limits preview data;
it supplies no buyer authorization or repository access control.

### Preview guard refinement, Codex, 4 November 2026, revision 2

Source: independent Claude review of `a7e1958`, findings A1 to A6.
Review state: implementation and new exact-revision checks pending.

Protected excerpts must fit within half the meaningful source lines and half
the normalized UTF-8 bytes. The CSV sample must match the header and exactly
the first two records, keeping the inspector's line numbers accurate. Empty,
short, whitespace-padded, near-complete and byte-heavy excerpts fail before
the safe manifest is replaced. The existing sample and paid delivery stay the
same. Complete public Starter Kit excerpts remain allowed.
