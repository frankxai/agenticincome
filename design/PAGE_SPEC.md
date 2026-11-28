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

## Offer evidence brief, November 2026

The customer is a founder or consultant deciding whether a buyer signal merits a paid offer test. The entry route is `/workbench/offer-brief`, linked from the homepage, workbench and challenge. The existing graph remains available for deeper review. The new page first exposes a clearly identified fictional brief, its literal source, unit assumptions and decision threshold.

A three-section editor accepts one dated source, an untested offer and a bounded experiment. Editing marks the last generated version stale and disables both exports until recalculation. Markdown preserves the decision for discussion. JSON opens in the same editor and recomputes derived values. The optional connected-assistant handoff names exactly which pasted fields leave the browser and stays under the owner's control. Pricing, outreach and spending remain human decisions.

## Access requests when intake is closed

Across offer, start and delivery pages, the access panel checks its existing
intake route before requesting an address. A closed destination links directly to
the free Starter Kit. A configured mailbox offers a user-sent email draft. Only a
configured webhook accepts an address inline.

## Challenge sign-up truth repair, Claude, 18 November 2026

Surface: `app/challenge/page.tsx`, not a protected surface. Copy and one removed control; no layout, token or motion change.

- Finding: the page asked for an address under "One honest, concrete build step a day, by email" and confirmed with "Day 1 ... is on its way". No challenge email exists in this repository, and `/api/subscribe` keeps no address unless `SUBSCRIBE_WEBHOOK_URL` is set. Production reported `captureMode: "unwired"` on 18 November 2026.
- Change: the `EmailCapture` block is removed from `/challenge`. The section below it now says the challenge is the page, with no sign-up and no email. The seven day cards and their links are unchanged.
- Boundary: do not add an email field or a follow-up promise here until a sender and a store both exist. `tests/stale-claims.test.mjs` holds the check. `EmailCapture` and `/api/subscribe` on `/start`, `/offers/*` and `/delivery/*` are untouched.

## Revenue desk and unit economics · November 27, 2026

A founder or revenue lead brings one possible paid service. The home page leads into a calculation they can challenge before they collect data, subscribe or pay. The starter example is a hypothetical website handover review. An operator can vary the assumed selling price, delivery cost and monthly fixed cost, inspect the effect on contribution and break-even units, and carry the two unit assumptions into the existing offer brief. The brief retains the source, buyer, offer and bounded validation experiment. Its portable file gives a human or compatible agent the same inputs to review.

An offer with losses on every sale needs a different price or delivery method. The calculator should express this clearly without producing a negative or infinite break-even count. A zero fixed cost has a different meaning from a missing input. No financial input should enter analytics or a request URL. The opening illustration depicts a fictional performer. Real offer terms, fees and availability stay with their owning source.

The founder's commissioning brief sets the visual direction. The owning [Agentic Income brand pack](https://github.com/Starlight-Intelligence/starlight-design-intelligence/blob/5fb0bdde1c4b4af871b1e1d35172b4030b1e7aa2/brand-packs/agentic-income/BRAND.md) defines the commercial voice, and the [Frontier constitution](https://github.com/Starlight-Intelligence/starlight-design-intelligence/blob/e25fab4c5a0dac2ea8c7b91e9397972f5af4b454/portfolio/frontier-experience-constitution.md) defines the review evidence. The old and new screens are recorded in `design/evidence/2026-11-27-revenue-desk/`.

## Quote-review pilot field note

A sales lead and finance owner arrive from the research index to decide whether a scoped quote-review pilot merits a real buyer test. The article names the sample and its modeled status before showing costs. The cost breakdown, four-hour rework scenario and buyer-capacity calculation give the reader one decision to inspect. Acceptance belongs to the finance owner.

The page offers an editable JSON brief and a Markdown case. The existing offer workbench opens the JSON and recalculates its derived economics. One record supplies all three editions. The canonical page is `/blog/quote-review-pilot`.

## The price of a second look · November 28, 2026

A sales operations lead and a finance partner must decide whether to test an AI-assisted quote review. Show the modeled €1,500 fee and the cost of four additional hours on the cover. Lead to one working model. Ten redacted historical quotes and one approved rate card define the scope. The buyer still has to supply the examples and agree the acceptance threshold.

Use the same source, currency, dates and cost assumptions for the homepage, the published research case and the transferred brief. Changing fee or hours must update both the seller contribution and the buyer payback. A loss, a fragile margin under rework, and positive downside contribution each need a distinct textual decision. The buyer's capacity must remain identifiable as modeled time, and the seller's contribution is measured before fixed costs.

An operator can change the scenario by keyboard, read its assumptions, print a decision memo, download editable JSON, or take the same numbers and evidence into the existing brief editor. A reader with JavaScript disabled can inspect and download the base case. Keep the founder's other material one click away through the case article, implementation, self-service toolkit, and agent-access routes.

## Quote-review workbench · 2026-11-28

At `/workbench/quote-review`, a sales lead can price a review of ten quotes and a finance owner can inspect what happens when human review overruns. The worked case and the main workbench both open the instrument. The two editable assumptions are fee and review hours.

The first result shows euros retained per pilot before fixed costs. The stress case adds four review hours. Keep monthly break-even in whole pilots and buyer payback in months. State the value of redeployed time separately from cash savings. The user can carry the chosen assumptions into the existing brief editor, download the editable JSON, or print a decision memo. The source case and fixed assumptions are available from the same screen.

The price negotiation disclosure compares a 20% contribution margin after rework with a four-month buyer payback target. When the price window is empty, show the seller’s cost reduction or the buyer’s extra monthly value needed to close the gap. The scenario API, print memo and editable brief carry the same bounds.

## Pricing AI work field note, 28 November 2026

A sales lead and a finance owner use `/blog/pricing-ai-work` to identify the billed unit, compare a downside seller fee with a buyer’s payback ceiling, and choose which assumption to test. A reader can open the quote-review calculator or inspect the source observations and scenario inputs in a public JSON download.

The route reuses the existing research article layout and type styles. Four offer descriptions cite five provider guides plus one database description, with USD amounts scoped to the named products. A separate EUR ledger shows the formula and result on each row. Datelines, source URLs and machine-readable units travel with the observations. The blog registry, sitemap and LLM index point to the edition. Both reading and export work without signing in.

## Product opening correction — 28 November 2026

The founder rejected the finance-journal positioning and the quote-review case as the homepage identity. The surface now introduces the actual product with “Build your next business with AI” and a working offer-plan editor. The primary audience is independent founders, creators and small teams. The primary action is to build a personal plan, then edit the complete portable brief. Secondary actions open the free toolkit, research and scoped implementation.

Three directions were assessed. The finance journal misrepresented the broader product. A pure cosmic film would still conceal the product. The selected direction places the real planning controls within an original dark Starlight studio scene.

The homepage has three independent example drafts. Switching between them preserves edits. Price and delivery cost remain explicitly marked example assumptions until edited in the full workbench. The same validated OfferBrief contract powers Markdown download and the bounded URL-fragment handoff. Text entered in the two fields is preserved across the handoff. Editing a buyer changes the suggested customer experiment. This local experience proposes work for the customer's tools. It does not simulate completed agent execution.

Retained jobs
- Positioning is AI-assisted business creation across services, products and research.
- Proof is the working local artifact, existing source-linked audit workflow and existing research.
- Income truth is explicit example economics, source provenance and untested hypotheses.
- Next steps are the editor, local download, free kit, MCP connection and scoped implementation.

The original illustration assets are reused from the registered campaign masters. Owned logo authority remains the existing LogoMark. Constitution revision e25fab4c5a0dac2ea8c7b91e9397972f5af4b454 remains the recorded authority. The prior candidate is in draft because the founder rejected its direction.
