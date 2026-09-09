# Agentic Funnel Builder — product, architecture and launch plan

Decision memo · 9 September 2026 · FrankX portfolio
Status: proposed commercial plan, grounded repository audit, source prototype in a draft PR. Prices, targets and scenarios below are proposals, not observed results.

## Decision

Build Agentic Funnel Builder as a shared product-engineering and funnel module. Distribute the first version through portable skills and an MCP server. Use the existing Agentic Income and Agentic Passive Income properties. Introduce a hosted workspace only after repeated paid use establishes the need.

The product promise: **Turn a useful workflow into a product people can try, buy, and successfully use.**

The central engineering advantage is the link between buyer evidence, product artifacts, acceptance, the sales promise, fulfillment, and measured usefulness. Page generation alone is already a crowded capability. ClickFunnels itself now offers an official MCP beta, so “funnels from chat” is insufficient differentiation.

## What already exists

These observations came from repository files and account metadata. They are not an independent end-to-end production audit.

| Existing asset | Observed evidence | Consequence |
|---|---|---|
| agenticincome | README and SYSTEM define accepted paid work, Outcome Packs and scope-first implementation; paid catalog routes are described as gated | Extend the current product/delivery contract; confirm actual checkout state before launch |
| agentic-income-skills | MIT public skill, IncomeSystem schema, validator and request-to-quote reference implementation | Put reusable source here; avoid a competing agent framework |
| agenticpassiveincome | README describes viability audit, Stream Atlas and IncomeAsset scenario builder | Retain the asset-selection entry point and add product/funnel execution downstream |
| Passive Income product catalog | Stream Pack 01 built at $47 but not for sale; $129 bundle is partial, one of four packs | Delivery and product completion outrank traffic expansion |
| Agentic Creator OS | Source distribution with skills, commands, agent profiles and MCP workspaces | Reuse creator production workflows selectively; no blanket installation |
| Vercel | Relevant projects exist and point at the expected income and GenCreator repositories | Use existing hosting and branch previews |

Verified Vercel projects: agenticincome, agenticpassiveincome, go-agenticincome, gencreator-ai and gencreator-community. This check established project/repository links, not health or successful purchases.

Private/public separation matters: paid files remain in the private passive-income repository. The new public prototype contains only original operating instructions and clearly synthetic examples.

Repository evidence:
- [Agentic Income README](https://github.com/frankxai/agenticincome/blob/main/README.md)
- [Product system](https://github.com/frankxai/agenticincome/blob/main/SYSTEM.md)
- [Public Outcome Pack source](https://github.com/frankxai/agentic-income-skills)
- [Passive Income README](https://github.com/frankxai/agenticpassiveincome/blob/main/README.md)
- [Passive Income catalog](https://github.com/frankxai/agenticpassiveincome/blob/main/products/catalog.json)
- [Creator OS](https://github.com/frankxai/agentic-creator-os)

## Brunson: retain the commercial intelligence, extend the product discipline

The author's bibliography identifies DotCom Secrets, Expert Secrets, Traffic Secrets and Unlock the Secrets. Further company material includes The LinchPin, Perfect Webinar Secrets and The Funnel Hacker's Cookbook. This work reviewed public descriptions and product surfaces; it did not ingest every book or reproduce proprietary exercises. Full-edition coverage remains a separate licensed-source task.

| Teaching family | Use in our system | Extension |
|---|---|---|
| DotCom Secrets | Buyer journey, value ladder and coherent entry offer | Each rung has an artifact, acceptance test, cost and owner |
| Expert Secrets | Explain the mechanism, use truthful narrative, address objections | Working demonstrations and source-linked evidence support the message |
| Traffic Secrets | Locate the buyer's communities and publications; build an owned audience | Use content as customer research and measure activation by source |
| Unlock the Secrets | Make implementation concrete | Original decision records and executable contracts |
| The LinchPin | Design continuity and growth events | Charge recurring fees for recurring work, fresh evidence or operations |
| Perfect Webinar material | Teach and demonstrate a complex product | Participants leave with a useful output; sales is optional |
| Cookbook | Reusable page and funnel structures | Original accessible components, event contracts and release checks |

Hook–Story–Offer, Epiphany Bridge, Attractive Character, Soap Opera/Seinfeld follow-up and Perfect Webinar can inform workflow modules. Exact step sequences require the relevant official material or licensed passages before detailed attribution. Dream 100 has broader provenance including Chet Holmes; classic direct-response techniques are not all Brunson inventions.

Do not copy scarcity, inflated bonus valuations or revenue claims. Use actual capacity, real deadlines, clear price comparison and independently useful base offers. A digital product does not need a physical-book shipping mechanic.

Sources: [author bibliography](https://www.russellbrunson.com/russells-books), [value ladders](https://www.clickfunnels.com/blog/value-ladder/), [Traffic Secrets publisher contents](https://books.google.com/books/about/Traffic_Secrets.html?id=kL-eEAAAQBAJ), [LinchPin description](https://support.myclickfunnels.com/docs/the-linchpin-book-faqs/), [webinar package](https://support.myclickfunnels.com/docs/perfect-webinar-secrets-faqs/), [Cookbook description](https://support.myclickfunnels.com/docs/the-funnel-hackers-cookbook/).

## What ClickFunnels does, and what to borrow

Its public book funnel combines an accessible first purchase, optional adjacent materials and a path into training/software. Borrow the connected journey and clear next task. For us: a working diagnostic, a complete implementation pack, then recurring operations when there is an ongoing job. [Observed DotCom offer](https://www.dotcomsecrets.com/).

ClickFunnels already combines funnels, checkout, websites, courses/community, CRM/email, automation, testing and AI. Its current pricing lists $97/$197/$297 monthly tiers; full API/webhooks appear at Scale and above. Those are vendor-listed terms, not a procurement recommendation. [Pricing](https://www.clickfunnels.com/pricing).

The official MCP beta uses per-user OAuth and offers read-only or read/write access. Its endpoint is https://agents.myclickfunnels.com/mcp. It remains a technical preview, and no ClickFunnels connection was present in this session. Evaluate it as an optional backend for customers already using ClickFunnels. [Official MCP documentation](https://support.myclickfunnels.com/docs/clickfunnels-mcp-server-beta-1/).

The developer API supports integration and OAuth. Its endpoint index includes page/product operations and agent-facing skills; some external/custom-HTML page functions are closed alpha. Avoid making those unconfirmed capabilities an MVP dependency. [API introduction](https://developers.myclickfunnels.com/docs/intro), [endpoint and skill index](https://developers.myclickfunnels.com/llms.txt).

The category is already moving toward agent-controlled builders: [Leadpages](https://leadpages.com) publicly advertises AI generation and MCP access, and [Flint](https://www.flint.com/articles/flint-vs-landingi-vs-leadpages) describes MCP-assisted page production. Treat these as vendor claims until tested. Our defensible hypothesis is stronger delivery evidence, reusable engineering assets and lower total time to an accepted customer result. That hypothesis must be measured against both a generic coding-agent workflow and a builder-assisted workflow.

## Portfolio structure

| Surface | Responsibility | Proposed user journey |
|---|---|---|
| agenticincome.ai | Active agent services and product engineering | Useful diagnostic → scoped build or Product-to-Funnel pack |
| agenticpassiveincome.com | Maintained owned assets | Viability audit → one asset → product/funnel → maintenance |
| GenCreator | Capture, create and distribute product demonstrations | Turn real product work into tutorials, clips, launch materials |
| FrankX.ai | Research, authority and education | Evidence-rich articles and public build demonstrations |
| Starlight | Shared intelligence, memory, evaluation and operations | Internal infrastructure shared across these products |

Use **Agentic Funnel Builder** as a working product name, not another independent brand/domain. Longer-term UI location: a module of an existing workspace, with routes such as /studio/products and /studio/funnels subject to the owning site's design plan.

Keep one product identity across channels. Brand-specific pages reference the same offer/version; they should not create competing fulfillment records or prices.

## First buyer and useful products

Beachhead: an AI-capable consultant, educator or independent expert who has a repeatable professional workflow and access to potential buyers, but lacks a reliable way to turn it into a sellable, maintainable product.

The paid outcome is a reviewable product launch kit with a tested useful artifact. Avoid promising a revenue result or first customer by a date.

| Segment | Real product example | Useful free entry | Acceptance |
|---|---|---|---|
| Research analyst | Reproducible comparison notebook plus source ledger | One transparent worked comparison | Claims trace to sources; another analyst reproduces it |
| Creator/educator | Production workflow, templates and a completed sample | Finish one usable content asset | Fresh user achieves the promised output with clear rights |
| Software founder | Small working tool or evaluated agent capability | Interactive task-specific demo | Core path, failure behavior and cost/latency meet scope |
| Agency/operator | Productized delivery service with client-owned accounts | Audit showing a concrete missed workflow | Customer accepts a completed job with bounded support |

Sequence those as templates over one engine. Do not launch four marketplaces or four separate products at once.

## Product research and engineering process

1. **Observe the job.** Collect actual workflows, spending, repeated questions, abandoned attempts, alternatives and buyer vocabulary. Public reviews generate hypotheses; interviews and paid use test them.
2. **Define the useful result.** Write the input/output, baseline, acceptance method, failure cost, owner and maintenance load.
3. **Build the smallest real artifact.** Use software when interaction matters, a notebook when reproducibility matters, a template when repetition is stable, and a skill when agent decisions recur.
4. **Test with fresh users.** Observe where they get stuck; distinguish liking the demo from completing the task.
5. **Package the offer.** Include scope, evidence, availability, delivery, support, licensing and a price hypothesis.
6. **Build the journey.** Match diagnostic/demo/workshop/direct checkout to the buyer's uncertainty.
7. **Verify delivery.** Purchase event, entitlement, first useful result, support and recovery.
8. **Measure and improve.** Activation, acceptance, refunds, maintenance and contribution feed the next product version.

Research quality needs provenance, date, uncertainty and rights. Customer value needs a counterfactual: what is better than their present method? A beautiful report without a useful decision, or a prompt collection without successful task completion, fails the product gate.

## Concrete first offer and funnel

Consolidate before adding catalog complexity.

- Keep the free skills and a useful product-readiness diagnostic public.
- Build a **Product-to-Funnel module** into the existing Agent Team Pro offer at its current $129 catalog anchor, subject to price approval and actual delivery. Avoid opening another SKU before this product is complete.
- The paid package must add implemented examples, working page templates, delivery configuration instructions, acceptance checks and a recorded build. Free skills alone are insufficient differentiation.
- Validate with ten design partners using asynchronous review and one group build lab. This creates proof while respecting a scalable delivery model.
- Consider $49/month hosted operations only after users need ongoing monitoring, project history or recurring research. A $149/month team offer is later, conditional on collaboration and tenant administration demand.

These are commercial proposals. Existing USD catalog prices remain unchanged by this memo.

The first funnel:

| Stage | Asset/message | Action/event |
|---|---|---|
| Discover | FrankX article and short demo: “Turn one useful workflow into a product people can use.” | qualified_intent |
| Try | Product-readiness diagnostic with one worked example | diagnostic_completed |
| Evaluate | Exact pack contents, scope, sample output and availability | offer_viewed |
| Buy | Tested provider checkout for the existing approved product | payment_confirmed |
| Activate | Open the pack and complete the first product task | first_value |
| Verify | Submit the output against the acceptance rubric | outcome_accepted |
| Continue | Offer maintained operations only when there is recurring need | retained_use |

Nurture drafts: deliver the sample, show a worked build, diagnose one common failure, explain the full pack, and invite a voluntary purchase. Sending or scheduling is a separate authorized action. No messages were sent in this work.

## Available integration inventory

“Exposed” means callable tool definitions are present; it does not establish account health or a completed integration.

| Capability | Session evidence | Use now / remaining verification |
|---|---|---|
| GitHub | Repository reads and writes exercised | Contracts, implementation branches, review and CI |
| Vercel | Team/project reads exercised | Existing Git-backed previews; production deployment separate |
| Notion and Google Drive | Tools exposed | Research evidence and editorial records; scoped read/write test needed |
| Canva and Figma | Tools exposed | Product visuals and reusable design components |
| Supabase | Tools exposed | Later tenant data and event store; project/auth/RLS need audit |
| Resend | Tools exposed | Delivery/nurture drafts; domains, consent and suppression unverified |
| n8n Starlight workflows | Search exercised; “funnel” returned zero workflows | Build or reuse a verified workflow; do not claim one exists |
| Railway | Tools exposed | Candidate for durable MCP service/jobs; no service selected |
| Webflow | Tools exposed | Optional customer-owned builder, not the default internal stack |
| Descript, Higgsfield, Cloudinary | Tools exposed | Recorded demos, media, asset handling |
| ClickFunnels | Official remote MCP verified in docs; absent from current tools | Optional customer authorization and capability test |
| Polar/Stripe, PostHog, Kit, Zapier, MCP research tools | No directly exposed matching connector verified here | API/connector work or installation only when needed |

ChatGPT tools can compose a workflow inside the user's session. Their credentials and permissions do not transfer into our SaaS. A hosted system needs its own authorized OAuth/API connections, tenancy and billing.

OpenAI's current plugin architecture combines skills, MCP services and optional UI. Use that packaging instead of assuming a historical plugin format. [Official plugin architecture](https://developers.openai.com/plugins/concepts/plugins).

## Technical architecture and build/buy

The canonical chain is evidence → product → acceptance → offer → funnel → delivery → outcome. This is a data relationship; it should survive switching model, agent host, website builder or payment provider.

Build the contracts, adapters, evidence checks, domain workflows, product templates and outcome reporting. Reuse hosting, checkout, email, CRM, media generation and commodity page editing.

MVP: four portable skills + local MCP planner + existing GitHub/Vercel workflow + one product/delivery template.

Next: authenticated Streamable HTTP MCP, server-side artifact/version storage, job state and one payment adapter. Use the existing Supabase/Postgres footprint after auditing tenant ownership. Use one durable job runner rather than stacking n8n, Trigger and custom queues for the same job.

Later: Product, Evidence, Offer, Journey, Delivery and Outcomes workspace views. Ship the UI when customers return to operate projects, not merely because a dashboard looks like a SaaS business.

The server currently implements five advisory operations:
- validate_product_contract;
- compile_funnel_blueprint;
- review_launch_readiness;
- model_unit_economics;
- evaluate_activation_experiment.

It does not search the web, render pages, manage customers, bill users, send emails, or authorize production. Existing agent tools carry out research and building under the skills. This boundary makes the first version inspectable and useful without pretending that full automation is complete.

Proposed production writes need server-side authority bound to principal, tenant, action, artifact digest, environment, expiry and budget. Webhooks need signature checks, deduplication, ordering/reconciliation and entitlement recovery. These are concrete implementation requirements, not a generic compliance certification.

## Economics and funding discipline

Illustrative $129 sale, net of indirect tax:
- refund reserve 5%: $6.45;
- assumed transaction fee 5% + $0.50: $6.95;
- variable model/tool delivery: $8;
- support/owner time: 20 minutes at $60/hour = $20;
- contribution before acquisition: $87.60;
- allocated acquisition cost: $25;
- contribution after acquisition: $62.60 per order;
- twenty orders and $200 fixed monthly overhead: $1,052 contribution before development investment and income tax.

These are assumptions, not provider quotes or demand forecasts. At sixty minutes of support per buyer, after-acquisition contribution falls to $22.60. Support burden is the critical design variable.

Proposed caps: 24 founder/engineering hours and $150 incremental external spend for the first 72-hour/14-day test. Additional infrastructure budget should replace existing subscriptions where possible. No purchases or spend commitments were made.

Keep development investment, cash collected and earned revenue distinct. Do not annualize ten pilot purchases into recurring revenue.

## Execution commitments and gates

| Window | Owner role | Deliverable | Evidence that unlocks next phase | Stop/repair condition |
|---|---|---|---|---|
| Next 72 hours | Frank product owner + coding agent | Inspect PR; run missing gates; complete one real pack artifact and checkout/delivery plan | Fresh user completes one useful task | Scope cannot be delivered within the time cap |
| Days 4–14 | Frank distribution owner | Ten paid design-partner places offered after release gates; one group build lab; observed task sessions | Ten purchases, eight activations, seven useful-result ratings are target gates | Fewer than three purchases from thirty qualified, consented offers triggers buyer/offer revision |
| Days 15–30 | Product/engineering owner | Fix largest failure, produce three consented case records, complete one payment/entitlement adapter | Repeated acceptance and measured support cost | Median support over thirty minutes/project after fixes pauses expansion |
| Days 31–90 | Engineering/operations owner | Remote MCP and limited hosted workspace | At least ten users returning weekly for four weeks and five willing to pay for ongoing operations | Weak retention or nonpositive contribution parks platform build |

The numeric gates are proposed decision rules; none is an achieved metric.

Avoid A/B winner claims on tiny traffic. First use qualitative task evidence and actual purchase/activation data. Later predeclare the randomization unit, primary metric, sample/time horizon, useful effect and quality guardrails.

## Product quality scoreboard

| Dimension | Measure |
|---|---|
| Customer utility | Accepted useful outcomes / completed submitted deliveries |
| Activation | Time to first result and activated users / eligible starts |
| Research integrity | Material claims with reviewed provenance; unresolved uncertainty visible |
| Product engineering | Acceptance by artifact version; reproducible examples |
| Economics | Contribution after acquisition and attributed human effort |
| Operations | Support minutes, failed entitlements, recovery time |
| Recurring value | Weekly active projects and cohort retention |
| Distribution | Qualified intent and activation by channel |

The social contribution is practical: keep the baseline tools and contracts inspectable, make entry artifacts useful, sell implementation and maintained services, and fund more reusable public examples from paid delivery. No speculative community marketplace is needed.

## Build prompts

**Product engineering**
“Use engineer-value-product on the existing catalog and repositories. Select one buyer workflow, record evidence and counterevidence, build a useful sample, define acceptance, and identify the largest unresolved demand assumption. Preserve product IDs and paid/private boundaries.”

**Funnel**
“Use build-agentic-funnel for this tested product. Produce one diagnostic/demo-to-offer journey, original copy, page specs, events and delivery handoff. Map each material claim to evidence. Create a reviewable branch; preserve actual availability.”

**Delivery**
“Use verify-funnel-delivery on this exact artifact version. Trace sandbox purchase through entitlement and first useful result. Exercise duplicate/out-of-order events and recovery. Produce blockers with evidence and prepare the concrete release action.”

**Improvement**
“Use improve-outcome-loop on the defined cohort. Reconcile accepted outcomes, refunds, costs and owner minutes. Choose the single product or funnel change with the highest information value. Keep insufficient evidence explicit.”

## Implementation and residual work

[Draft source PR #9](https://github.com/frankxai/agentic-income-skills/pull/9) contains four skills, five MCP tools, examples, architecture/method documents and ten checks. It is source preparation, not a marketplace launch or production deployment.

Skill frontmatter validation passed before the local runtime disconnected. One independent task evaluation correctly kept unsupported time-saving claims and untested fulfillment out of a paid launch. GitHub CI passed at commit `863af769863d5d8b64acb1d8dee2049781c91b19`: all ten checks passed, including negotiation, tool discovery and invocation through the official MCP client over stdio. The demo also passed. The repository's existing CI passed on the same head commit. [MCP run](https://github.com/frankxai/agentic-income-skills/actions/runs/34385938559), [existing CI](https://github.com/frankxai/agentic-income-skills/actions/runs/34385938508).

Remaining release work: committed dependency lock, complete manifest and target-host checks, remote HTTP/OAuth implementation when needed, buyer validation, completed paid artifacts, payment/entitlement integration and exact production authorization under the repository's existing rules.

The immediate commercial action is to finish and test one deliverable through the existing catalog. That gives the funnel builder a real product to demonstrate and creates the first credible case for selling the system itself.
