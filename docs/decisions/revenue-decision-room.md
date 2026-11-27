# Agentic Income | Revenue decision room

Product direction, 27 November 2026. This document distinguishes the release in this branch from the next commercial experiments. All figures used to evaluate a pilot are scenarios. See the [existing offer-brief decision](evidence-backed-offer-brief.md), [portfolio ownership](https://github.com/frankxai/agenticincome/issues/74), [ledger](https://github.com/frankxai/agenticincome/issues/75) and [agent contract](https://github.com/frankxai/agenticincome/issues/76).

## The buyer and the decision

Start with the owner of a repeatable B2B workflow who can bring a real example, name the budget owner and accept a delivered result. A sales lead needs evidence that a buyer will pay. A CFO needs contribution per accepted delivery, cash timing, and a downside case. A CEO needs a decision about the next commitment of time or money. Let all three inspect the same brief. Give them different questions to answer.

The free workbench produces a dated, portable hypothesis. The first paid service should turn one such hypothesis into an accepted pilot in customer-owned systems. The durable product is the difference between what a team expected to earn, the work it delivered and the cash it kept. It becomes defensible when customers return to reconcile actuals.

## What the first release gives the buyer

| Job | Customer surface | Artifact |
| --- | --- | --- |
| Decide whether to explore | Homepage scenario and research index | Immediate contribution estimate with editable assumptions |
| See a case in full | /blog/quote-review-pilot | Priced scope, fully loaded delivery costs, buyer payback, downside and acceptance criteria |
| Use the case | /api/research/quote-review/brief.json and /api/research/quote-review/case.md | Editable OfferBrief.v1 and a finance-readable Markdown case |
| Prepare a buyer test | /workbench/offer-brief | Source excerpt, price, per-unit cost, planned experiment and export |
| Inspect the machine contract | /mcp and /economics.openapi.json | MCP prompts and tools, published read-only unit-economics references |
| Commission delivery | /offers/implementation-sprint | Written scoping route. Paid checkout availability must match the provider state |

A shared, authenticated multi-user deal room is a later build. The local workbench already lets an owner keep a copy and share it deliberately. A shared room earns its place when real deals have multiple reviewers.

## Commercial sequence

| Product | Buyer receives | Evidence that earns the next investment |
| --- | --- | --- |
| Open case and starter kit | Worked model, exact inputs and reusable file | A buyer replaces the example with their own numbers and exports it |
| Blueprint at the catalog price | Versioned operator files, sample pages, receipt, ongoing access and documented support | One complete sandbox purchase, delivery, repeat download and refund/revocation reconciliation before opening sales |
| Scoped implementation | One workflow, measurable baseline, named reviewer, acceptance test, repository or handover archive | A real buyer signs the scope, accepts delivery, and pays |
| Private decision room | Buyer evidence, scope revisions, approvals, model versus actuals and a decision report | Two independent buyers bring a second decision or request a second reviewer |
| Circle member practice | Redacted case review, a weekly build session and a decision archive | Buyers volunteer a recurring use and a moderator owns delivery |
| Metered research API | Licensed field-level evidence with timestamps, response schema, usage receipt and hard spend limit | Repeat callers value a particular result enough to pay for it |

Suggested first cohort: founder-led B2B service teams already delivering proposals or quote reviews. Start with three design partners. A customer gets the full case before being asked for an email. For a conversation that yields a pilot, ask permission for an anonymized case only after the buyer sees the finished work. A partner can refer a qualified team under disclosed terms. Report retained contribution per referral after support, refunds and commission. The identity work earns attention; the sample model and buyer-owned handoff earn trust.

## Evidence and operating economics

A representative supplier scenario is €1,500 ex-tax revenue less €750 human time, €40 compute and retries, €45 assumed collection fees, €90 acquisition and €75 support. Contribution is €500, or 33.3%, before fixed costs. At €1,500 monthly overhead, three accepted and collected pilots cover fixed costs. Four additional hours at €75 reduce contribution to €200 and raise the threshold to eight pilots. Check delivery capacity before treating eight pilots as feasible. The buyer also needs an independently useful saving: six hours per month redeployed at €75, less €75 ongoing operations, creates €375 of potential value and four-month simple payback. Capacity value and cash released require separate columns.

| Evidence | Source or owner | Decision it changes |
| --- | --- | --- |
| Buyer pain and willingness to pay | Consented notes, quote history and signed pilot scope | Sales assigns an experiment, a price assumption and a stop condition |
| Manual baseline and error cost | Redacted samples, reviewer minutes, correction and refund records | Finance can price errors and identify which work can be delegated |
| Fulfilment cost | Actual human delivery and review, agent retries, infrastructure, support and acquisition | Owner prices the next accepted unit and caps concurrency |
| Net receipts | Merchant events, refunds and settlement ledger in one currency | Finance reconciles paid, delivered, accepted and settled separately |
| Partner and market terms | Dated first-party program terms, license, attribution window, enrollment evidence | Editor can publish a supported claim or mark it for review |
| Onchain settlement | Public transaction reference and confirmations on explicitly supported networks | Finance reconciles a payment, with customer identity in a separate private record |

Publish original observations and properly licensed projections. Keep private buyer excerpts, provider event bodies, full third-party reports and raw CRM exports within their respective access boundaries. Aggregated benchmarks become commercially meaningful when the cohort definitions, sample sizes and permission to publish are explicit.

## Platform and agent roles

The website and GitHub hold editorial content, portable schemas and public fixtures. Vercel serves the Next.js experience, HTML, downloads, REST and MCP. The Starlight Supabase observatory holds private evidence. It has a different purpose from a customer deal ledger. Introduce a tenant-scoped deal store only alongside team identity, invitation and revocation tests, and access logs. Do not expose the research schema as a shortcut.

| Agent | Input | Allowed result | Human decision |
| --- | --- | --- | --- |
| Research librarian | Approved first-party URLs, catalog and dated observations | Draft a source delta, freshness queue or withdrawal recommendation | Approve a claim and publication rights |
| Revenue analyst | One dated brief, labor rates, compute/customer acquisition assumptions | Calculate contribution, downside, payback and sensitivity | Set the price and fund the pilot |
| Delivery reviewer | Scope, redacted examples and acceptance rubric | Trace failures, reviewer time and remediation cost | Accept delivery and send the buyer the result |
| Finance reconciler | Provider events, entitlement IDs and delivery receipts | Match payments, calculate variance and surface exceptions | Refund, change budgets or write off amounts |
| Community editor | Opt-in cases, disclosures and independently accepted work | Prepare a case clinic or a disclosed referral asset | Obtain participant permission and publish |

Use the existing scheduled freshness workflow and the existing Queen/Burst/Fleet environment. Queue a bounded job with input hashes, permitted sources, spend cap, time limit, retry key, evidence destination and reviewer. Scaling compute comes after one job produces information a decision owner uses. No worker needs wallet authority to calculate economics or draft research.

## Distribution and payments

| Layer | Decision |
| --- | --- |
| Web publishing | One canonical HTML page per case with date, method, visible assumptions and internal links. Publish Markdown for reuse and a typed machine artifact for software. Google says it ignores llms.txt for ranking. |
| Polar | Own self-serve files and merchant fulfilment for the Blueprint. Validate the configured SKU, price, benefit, checkout, receipt, repeat download and refund path. |
| Stripe | Evaluate invoices or hosted payments for scoped B2B work. Reuse existing payment and entitlement identifiers. Turn on agent-purchasing features only for a specific eligible flow. |
| Whop | Use a partner-specific distributor offer when a named partner can bring buyers. Reconcile net revenue to the same entitlement contract. |
| Circle | Host opt-in case clinics in the existing Starlight community. Verify membership grant and revocation before bundling access. |
| Web3 | Price an API read in fiat first. Only after evidence of recurring demand, test x402 on Base Sepolia. Check the facilitator's live network list before a Base or Solana offer. Ethereum mainnet needs an expressly compatible settlement route. |
| Web4 / Web5 | Treat these as product ambitions: delegated purchasing within policy, portable identity and customer-controlled records. Give each a versioned, testable interface. Keep the labels out of buying decisions until customers use them. |

## Portfolio, craft and measurement

Agentic Income owns actively delivered revenue. Agentic Passive Income evaluates ongoing labor, automation fit and owned distribution. Disruptive Passive Income studies capital and compounding with dated evidence. FrankX carries the founder's engineering and musical practice. Use handoffs at the moment a visitor has work to move across brands. Keep source context with the customer, with explicit consent for any transfer of private material.

Use the two newly commissioned salon images for editorial identity. Maintain the five existing Agentic Income role plates as workflow cues. Reuse the existing scene and motion implementation with mobile/reduced-motion fallbacks. Admit OSS through a small technical spike, a license/provenance check and a measured bundle or GPU budget. A shared interaction must improve comprehension or completion at the decision point.

Measure the chain: case opened → case file retrieved → buyer edits and exports a valid brief → scope accepted → delivery accepted → payment settled → 30-day cost variance. Never infer paid revenue from a click. First decision after ten completed own-data briefs: identify the largest loss between export and a real buyer conversation. First decision after three paid pilots: reprice, standardize or retire the offer from observed contribution and founder time.

## External references

- [Starter Story](https://www.starterstory.com/) makes thousands of business examples available. [Clay](https://www.clay.com/pricing) sells prospecting, enrichment and execution. [Acquire](https://acquire.com/) connects metrics to a transaction. Our paid job is narrower: validate the buyer's own offer and measure its delivery.
- [Polar file benefits](https://polar.sh/docs/features/benefits/file-downloads), [Stripe agentic commerce](https://docs.stripe.com/agentic-commerce), [Whop payments](https://docs.whop.com/developer/guides/accept-payments) and [Circle APIs](https://api.circle.so/) document distinct integration capabilities.
- [Coinbase facilitator](https://docs.cdp.coinbase.com/x402/seller/facilitator), [Google search guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) and [HeyGen terms](https://www.heygen.com/geniverse/affiliate-program) were checked for this release.
