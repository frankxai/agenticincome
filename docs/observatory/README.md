# Agentic Income Product Observatory

This is a private research dataset and rubric, not a customer ledger, a verified-success leaderboard, or a replacement for the owned-product Registry. Twelve external products seed a bounded catalog; the universe of all launched digital products is neither available nor claimed.

## Deployed state

- Project: Starlight Platform, `gfrfcqyprekhazzugdkr`.
- Schema: `product_intelligence`, seven additive tables.
- Notion review hub: https://app.notion.com/p/40b26ac2b7f6810e8f9df800a802debe
- Catalog: https://app.notion.com/p/e6142e7989cd478e8ac1f20dc03eaf67
- Sources store canonical URL, publication time when known, observation time, retrieval receipt and content hash. Full third-party pages are excluded from this repository.
- `schema.sql` records the additive DDL applied through Supabase migration `create_private_product_intelligence` on 2026-11-01. It is a historical migration, not a rerunnable setup command.
- `verify.sql` contains seed verification and real permission/constraint rejection probes. Its exact seed-count assertions apply to setup, not the expanding catalog forever.
- `seed-2026-11-01.json` is a dated, paraphrased historical seed, not a live metrics feed.

All seven tables have RLS enabled. Schema and table privileges are revoked from PUBLIC, anon and authenticated. Only the existing server service role has select/insert/update grants; no policy, security-definer function, public view, exposed schema configuration or customer access was added. Do not add a service key to client code. Server-side approved projections still need a scoped authorization contract before any customer endpoint ships.

## Data authority

| Entity | Meaning | Boundary |
| --- | --- | --- |
| products | External product identity and editorial classification | Not owned-product admission or a checkout offer |
| sources | Dated evidence and original annotations | Retrieval success is not truth verification |
| observations | A narrowly defined signal and its reporting basis | Revenue, usage, reviews and traffic stay distinct |
| assessments | Versioned, weighted dimension assessments | Unknown is null, not zero; editorial differs from tested |
| funnel_edges | Attributed transitions or acquisition shares | Preserve denominators, cohort and period; do not multiply incompatible shares |
| operating_goals | Proposed targets scoped to existing Registry product IDs | Actuals remain null until authorized complete receipts exist |
| curation_runs | Retrieval usage and outcome receipts | Credit counts are not monetary spend or business results |

Recorded money uses integer minor units plus explicit ISO currency when the source supports that normalization. The Tally article uses a dollar symbol without an explicit ISO code in the retrieved passage; its public claims retain `reported_dollar_units` and are excluded from normalized financial sums. ARR is a recurring run rate, not earned annual revenue. The seed has zero provider-verified financial observations, which means no verified financial records were ingested, not that these businesses have zero sales.

## Rubric v1

| Dimension | Weight | Evidence required for a meaningful assessment |
| --- | ---: | --- |
| Job clarity | 10% | Concrete task, buyer, acceptance condition and observed time to value |
| Demand | 15% | Paid or otherwise costly commitment with a defined eligible sample |
| Outcome reliability | 20% | Reproducible task suite, accepted outcomes, failures and recovery |
| Review quality | 10% | Platform, count, period, verification and qualitative coding limitations |
| Unit economics | 15% | Refunds, fees, compute, support, acquisition and human time |
| Retention | 10% | Mature cohorts, second accepted use, cancellations and survival |
| Distribution | 10% | Comparable channel attribution, conversion and concentration |
| Portability and data controls | 10% | Export/reopen test, permissions, authorization and deletion behavior |

Anchors: 0 = directly demonstrated failure; 1 = materially below the defined acceptance bar; 2 = partial delivery with substantial intervention; 3 = meets the acceptance bar in the stated task/sample; 4 = exceeds it with a reproducible result; 5 = repeated evidence across representative tasks and mature cohorts. Unknown is never assigned one of these scores. The initial job-clarity 4/5 is an explicitly editorial page-content assessment of a concrete job, not a claim that the workflow or product passed testing. All other dimensions remain unknown. Each product has 10% editorial rubric coverage and 0% tested coverage. No overall success rank is issued.

With weights summing to one, scored coverage C = sum of weights for known dimensions. A provisional score on known dimensions is 20 times the weighted sum divided by C, but it must not be surfaced as a headline when C is small. Bounds that assign unknown dimensions zero or five are [8, 98] out of 100 for this seed; they are too broad to support a quality ordering. Commercial rankings require compatible evidence, at least 70% weighted coverage, and tested outcome, unit-economics and retention dimensions. This 70% threshold is an operating policy, not a scientifically calibrated probability.

For repeated binary outcomes use a Beta(1,1) prior: the posterior is Beta(accepted+1, eligible-accepted+1). Show eligible count and a credible interval; the prior is a modeling assumption. Goal credit still requires the measurement contract's minimum sample and complete period. Do not substitute a posterior mean for actual paid-customer proof.

For review averages a shrinkage estimate can reduce tiny-sample volatility: adjusted mean = (n*r + m*prior_mean)/(n+m). Use a comparable layer/platform prior and publish m and the source. This is perceived satisfaction only. No such adjusted ranking is stored yet, because distribution, recency and reviewer provenance have not been assessed. Never derive a binary Wilson interval from only an average star rating.

`research_priority` is an editorial learning queue, not product quality. Its rationale prioritizes dated commercial evidence, browser/API surface coverage, and relevance to the admitted Field Guide and Creator Launch OS. Portfolio admission remains in Registry and Foundry.

## Layer audits

| Surface | Required experiment | Revenue model to investigate |
| --- | --- | --- |
| Digital asset/template | Install, complete job, reopen/export, update and support burden | Defined one-time edition; optional separate maintenance |
| Browser extension | Permission review, realistic browser task, breakage recovery and store policy | Subscription or bounded utility purchase |
| Local CLI/developer tool | Clean install, secret boundary, reproducibility and offline/export path | Seat, license, usage or commercial support |
| API/MCP | Auth scope, schema validity, idempotency, retry, latency and cost per accepted result | Metered usage plus included subscription allowance |
| Workflow/agent service | Approval points, accepted outcome, dispute rules and human escalation | Implementation plus recurring managed operation; outcome fees only with clear acceptance |
| SaaS | Activation, scoped access, mature retention, support and contribution | Subscription with explicit use limits |
| Marketplace/distribution | Attribution, take rate, refunds, channel concentration and rights | Take rate or disclosed referral; avoid ranking incentives |

## Data sourcing and quality gates

1. Official pages and changelogs establish what a vendor documents; pricing pages need a dedicated date/locale/currency audit. A homepage scrape is not a pricing verification.
2. Public founder reports can populate self-reported ARR/MRR with a dated definition. Independently verified provider receipts require owner consent and scoped access. Screenshot badges and testimonials do not establish verification.
3. Chrome Web Store, G2, Capterra and marketplace reviews provide platform-specific perception signals. Observe terms, licenses and collection limits; store original annotations and source links instead of reproducing review corpora.
4. Semrush/Similarweb supply modeled traffic and channel estimates; they do not establish sales. First-party PostHog/GA4/GSC require a verified project/domain mapping. The connected PostHog default project has not established that mapping here.
5. RevenueCat/Stripe/Polar/Gumroad/Shopify exports or authorized webhooks can provide actual provider events for owned or consented businesses. Reconcile collected, earned, refunded and payout amounts separately in the owning ledger, then project aggregates here only if permitted.
6. Demand/comments analysis needs a defined query, date window, sample, deduplication, language and incentive disclosures. AI sentiment is an annotation with evaluation error, not an objective measurement of value.
7. Failed retrievals, changed pages and missing records are not proof of shutdown, failure or zero sales. Preserve contradictions and revisions.

Current first-party revenue and accepted customer outcomes are unknown. Existing measurement PR #110 checks aggregate source scope, completeness, freshness, period, integer money, denominator size and unknown handling; it does not authenticate a provider or authorize a tenant on its own.

## Customer suite and monetization

The first paid promise should be the outcome of the admitted Field Guide or Creator Launch OS. Observatory packaging remains research until a buyer and acceptance test justify its support cost.

| Edition | Customer value | Proposed revenue logic | Validation gate |
| --- | --- | --- | --- |
| Discovery index | Understand tools by job, surface and evidence class | Free acquisition | Source clarity, useful filtering and traceable links |
| Curated database edition | Receive original comparisons and reproducible evaluation templates | One-time dated snapshot | Three non-founder paid accepted deliveries; no implied perpetual updates |
| Research workspace | Track meaningful changes and compare saved workflows | Subscription | Repeated use, bounded refresh SLA, positive contribution after research/support |
| CLI/MCP access | Query the same approved data from agent workflows | Included access or capped usage add-on | Same entitlements and authorization as web; no duplicate backend |
| Implementation package | Install one useful customer workflow and transfer operation | Scoped project fee | Signed acceptance condition and explicit support boundary |
| Managed operation | Maintain a working workflow with measurable accepted outcomes | Retainer or clearly defined usage/outcome fee | Reliable recovery, dispute rules and positive contribution |

These are proposed packaging layers, not six newly admitted launches. No prices or checkout changes are made by this work. Affiliate compensation must be disclosed and must not raise a product's evidence/quality score.

Use contribution per accepted outcome, not revenue alone:

contribution = earned_sales_excluding_tax_and_pass_throughs - attributable_refunds - payment fees - inference/API - delivery - support - acquisition allocation - valued human time.

Track product-period currency, eligible and accepted counts, p50/p95 delivery latency, failure/retry rate, support minutes, time-to-first-accepted-result, cohort retention and channel concentration. Do not label recurring income passive until measured maintenance and intervention stay within a stated budget for mature periods.

## Product operating goals

All five targets are proposals for the admitted pair and remain unmeasured: three paid accepted activations by November 8; two seven-day repeat customers by November 15; positive EUR contribution by November 30; at least 90% accepted outcomes with a minimum sample of 20; at most eight support minutes per active workspace by November 30. Dates are operating targets, not forecasts. No October full-month results or November future outcomes are fabricated.

## Context and decision evolution

Not all ChatGPT, other-AI or CLI histories are available through a universal connector. Do not claim a full import. Use the existing Starlight memory/Atlas and portfolio authorities for owned decisions; import selected exported conversations and CLI artifacts only through a defined source manifest. Preserve message time, author, source provider, project, original URI/hash, confidentiality, rights and supersession links. Distill claims, decisions, hypotheses, experiments and outcomes separately. New thinking supersedes a specific dated decision after review; it does not silently overwrite raw history or brand canon. Raw private context stays outside public research products.

## Operations

Use one bounded research scheduler. It reads current due items, source revisions and daily call receipts; new observations are append-only with deterministic identity, and Notion updates use Product ID. Never issue migrations or overwrite unrelated human edits from scheduled research. Public projection requires a separately reviewed field allowlist and customer authorization. Existing n8n can transport provider events later; do not add a competing cron or another commerce ledger.

Initial verification: twelve products, fifteen source fingerprints, twenty-five observations, ninety-six dimension entries (eighty-four unknown), two attributed funnel edges and five unmeasured goals. Real rejection probes passed for duplicate identity, unknown numeric score, fractional minor-unit money, invalid rate, anonymous read and authenticated read. Security advisor comparison preserves the two existing unrelated warnings; seven new informational RLS-without-policy notices correspond to the deliberately server-only tables. No new warning was introduced by this schema.


## Portable review catalog (2 November)

`lib/observatory.mjs` projects an explicit field allowlist from an authorized private snapshot. `scripts/query-observatory.mjs` makes the same catalog available to local CLI/agent workflows without a new server or credentials:

```sh
node scripts/query-observatory.mjs data/observatory/seed-2026-11-01.json --layer 'API and MCP'
node scripts/query-observatory.mjs data/observatory/seed-2026-11-01.json --model 'One-time' --format csv
node scripts/query-observatory.mjs /path/to/authorized-snapshot.json --search 'workflow'
node --test tests/observatory.test.mjs
```

All outputs are `private_review`, publication unapproved. JSON includes dates, source fingerprints, per-dimension scored/tested coverage and attributed signals. CSV preserves unknowns as blanks and guards spreadsheet formula injection. Filters intersect; empty results remain empty. Per-product source lineage follows the same filtered population. Latest assessment revision wins without double-counting; ambiguous timestamp ties fail, preserving PostgreSQL microsecond precision. No overall quality score or normalized verified revenue is invented.

Private goals, customer records, research priorities, source retrieval IDs, free-text internal notes, first-party receipts and their financial observations are excluded. This is preparation for a customer edition, not permission to publish a third-party dataset. It neither retrieves from Supabase nor authenticates a tenant: obtain a scoped authorized input before running. The CLI reads at most two MiB and never echoes private parse errors or paths. Focused tests cover the real seed, privacy sentinels, source linkage, archived rows, filter scope, revision handling, money, CSV injection and bounded CLI behavior.

Operating definitions are aligned with PR110: contribution uses earned sales, not collected cash; the acceptance denominator includes failed eligible attempts; support is normalized to workspace-month equivalents. The November1 seed is historical evidence with these definition corrections, not a claim of fresh commercial observations.
