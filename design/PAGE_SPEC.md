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

### Fail-closed preview defaults, Codex, 4 November 2026, revision 3

Source: independent Claude review of `5bf2299`, findings N1, N2, N3 and N5.
Review state: new source and exact-revision verification pending.

Line and byte limits ignore interior blank lines and surrounding whitespace.
New file reads are protected by default; existing public specifications and the
sample issue are explicitly public. Every authored protected sample must be a
contiguous prefix of its source, so the inspector's line numbers remain true.
The CSV badge and its record limit share one value. Current public excerpts,
paid delivery files and product classifications stay the same. These limits
prevent accidental overexposure; they do not provide buyer access control.

## Cinematic homepage scroll film, Claude, 12 November 2026

Author: Claude (Anthropic). Direction: Frank, 2026-11-12. Contract: `docs/design/cinematic/design-lock.md`.
Surface: `app/page.tsx` and `components/motion/`. Protected surface `homepage`, kind evolve.
This entry supersedes the 2026-07-24 line "Existing composition, motion, responsive behavior, and visual tokens remain unchanged" for composition and motion. Tokens, audience, conversion and the public install contract are unchanged.

### Scene order

1. Opening stage: kicker, h1, sub, both actions, MCP terminal with the real `fit_check` answer.
2. Build path: Audit, Architect, Implement, Verify, Human gate, each with one repository artifact read at build time. Then the existing `AgentWorkflowProof` run, moved up from after the MCP section so the method is followed directly by its worked example.
3. Three delivery routes from `data/income-models.json`: summary, execution, timeframe, risk boundary.
4. Partner economics board from `lib/affiliate.ts`, with a new Verified column: date and source host per row.
5. MCP tools, doctrine lines, catalog with the same availability logic as before.
6. Close: both primary actions repeated, then the network handoff.

### Jobs

- Positioning: h1, sub and kicker word for word, first in the document.
- Proof: real MCP output, the build path artifacts, the unchanged workflow proof and its two source links.
- Income truth: routes and partner terms read from the same data through the same functions; each now shows its source or verification date.
- Next step: both hero actions unchanged and repeated in the close; every other link kept.

### Data shown that was not shown before

All read at build time, none authored: `incomeModels.updatedAt`, `catalog.updatedAt`, per-program `commissionVerifiedAt` and `commissionSourceUrl`, `package.json` scripts `audit:affiliate` and `merge:gate`, the first Starter Kit file row from `lib/pack-manifests.ts`, and counts derived from `catalogRefusal`.

### Boundaries

Repository paths are cited in mono and not linked: the application repository is not linked from `app/`, `components/` or `lib/`. Source links in the board go to each program's own terms page, never to a compensated link.


## Homepage waitlist capture, Claude, 13 November 2026 (WEB-01b)

Surface: `app/page.tsx`, protected surface `homepage`, kind evolve. One block, `components/HomeWaitlist.tsx` (`#waitlist`), placed directly after `AgentWorkflowProof`, before the delivery routes scene.

- Job: let a reader ask for one email when new packs open. Product `agentic-income` from the estate registry (`data/waitlist-products.json`). Source of the form: `lib/demand-capture/` (PROVENANCE.md).
- States: checking, closed, idle, error, confirmed. Closed is the default whenever the server cannot say the list is open (no KV pair, store failure, request failure); it shows no form. Confirmed is inline and carries one next step, the fit check at `/start`. Steps inside the form: email and consent, then three optional questions (the "questions" state, with Skip), then done. The block changes height between these states (about 414 px idle, 977 px with the questions open at 1440x900).
- Scroll interaction: the delivery routes scene below is pinned by ScrollTrigger from measured positions. `HomeWaitlist` observes its own height with a `ResizeObserver` and calls `ScrollTrigger.refresh()` on the next frame when the height changed. Check: `docs/design/waitlist-glass/README.md` section "Pinned deck check".
- Boundaries: no figure, count, countdown or founding benefit is shown; the public count appears only at or above the registry threshold. No outcome claim. Joining charges nothing and is not checkout. `/api/subscribe` and `EmailCapture` are untouched.
- Keeps: positioning, proof, income truth and the next-step actions are unchanged; this block adds one more next step.
- No change to the nav: `liquid-gl` was not added (167,480 B minified over the 150 KB budget; a `blob:` worker the CSP blocks). The existing CSS glass stays.

## Challenge sign-up truth repair, Claude, 18 November 2026

Surface: `app/challenge/page.tsx`, not a protected surface. Copy and one removed control; no layout, token or motion change.

- Finding: the page asked for an address under "One honest, concrete build step a day, by email" and confirmed with "Day 1 ... is on its way". No challenge email exists in this repository, and `/api/subscribe` keeps no address unless `SUBSCRIBE_WEBHOOK_URL` is set. Production reported `captureMode: "unwired"` on 18 November 2026.
- Change: the `EmailCapture` block is removed from `/challenge`. The section below it now says the challenge is the page, with no sign-up and no email. The seven day cards and their links are unchanged.
- Boundary: do not add an email field or a follow-up promise here until a sender and a store both exist. `tests/stale-claims.test.mjs` holds the check. `EmailCapture` and `/api/subscribe` on `/start`, `/offers/*` and `/delivery/*` are untouched.
