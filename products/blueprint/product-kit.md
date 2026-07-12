# Product Kit — Model 2: Packaged Judgment

> **Personal license — purchased copies are for the buyer's own business. Not for resale or redistribution.**

Part of the Income Architecture Blueprint v2 · 2026-07-11 · [agenticincome.ai](https://agenticincome.ai)

---

## Who this kit is for

You have delivered something at least twice — for clients, for an employer, or for yourself — and you can name the decisions that made it work. A product is those decisions, packaged so a buyer can install them without you in the room. If you have never delivered the underlying work, do the [Service Kit](service-kit.md) first: products without proof are guesses with a checkout page.

**The 2026 edge, stated plainly:** *agent-native products* — packs, skills, and workflows the buyer's own agent runtime installs and runs — retain better than PDFs and courses, because they do work instead of assigning it. If your judgment can be expressed as commands + agents + templates, express it that way.

**The price band that clears self-serve:** $19–$149. Above that, buyers expect humans (calls, onboarding, support SLAs). Inside it, a good page and honest proof can sell alone. (Doctrine from `knowledge/02-income-models.md` in the free knowledge base — [agenticincome.ai/pack](https://agenticincome.ai/pack).)

---

## Part 1 — The business-plan template

### 1.1 The judgment being packaged

```
What you decided repeatedly:      (the 5–10 decisions your deliveries kept making)
Who faces those decisions:        (buyer role — must be reachable, not "everyone building X")
The 15-minute test:               (what does the buyer HAVE within 15 min of purchase?)
Format:                           (agent pack / template system / kit / dataset / micro-tool)
Why an agent-native format fits:  (or honestly doesn't — a PDF checklist is fine if it's true)
What exists already:              (name 3 competing products; what they get wrong or miss)
```

### 1.2 The product spec

```
Name:                       (says what it does; no mystique)
Price:                      ($19–149 band; anchor to buyer's alternative cost, not your effort)
Contents (file map):        (every file/command/agent the buyer receives — list them)
First win:                  (the artifact the buyer produces on day one)
License:                    (personal-use default; state resale/redistribution rules plainly)
Maintenance promise:        (what gets updated, on what cycle — a product is a promise of maintenance)
Support boundary:           (template-level support ≠ consulting; write the line now)
Refund policy:              (30-day no-questions is the trust-compounding default)
```

### 1.3 The commerce stack

```
Merchant of record:     (Polar.sh default for digital/agent products — MoR handles VAT/sales tax;
                         see the fee comparison in knowledge/07 §3 before choosing)
Delivery:               (Polar file delivery / license key + private repo access / on-site page)
Checkout → delivery:    (map the redirect: checkout success → delivery page → install steps)
The unwired rule:       (until payment works end-to-end, the page says "request access" —
                         never fake a live checkout)
```

### 1.4 Distribution (the actual hard part)

```
Owned:      (your list — the only channel you control; capture from day one)
Earned:     (the knowledge-base play: deep, dated pages that answer buyer queries)
Open core:  (the free tier that IS the marketing: a real, useful subset — MIT it)
Borrowed:   (communities/marketplaces where buyers already are; disclose you're the author)
What you will NOT do: (undisclosed self-promotion; fake reviews — illegal and fatal;
                       paid ads before organic proof)
```

### 1.5 The refresh loop

```
What goes stale:         (prices, tool names, APIs, screenshots — list your product's decay surface)
Re-verification cadence: (quarterly minimum; monthly for fast-moving tool facts)
Who runs it:             (an agent Loop with a human gate — same discipline you sell)
Stale-product remedy:    (updates pushed to buyers; changelog public)
```

---

## Part 2 — Worked example (fictional, complete)

> **This example is fictional.** "Deno" does not exist; every number is invented to show realistic *shape*, not to predict results. No part of this example is an earnings claim.

**Deno — "Client Onboarding Pack" for freelance web studios.**
Background: solo Next.js freelancer, 11 client projects delivered, same onboarding chaos every time — scattered briefs, missing assets, scope disputes. He built himself an agent-driven onboarding system; now he packages it.

**1.1 Judgment packaged:** the 8 decisions of clean onboarding — intake questions that actually get answered, asset-collection sequencing, scope-freeze language, kickoff-brief generation, red-flag client screening. Buyer: freelance web/app studios of 1–3 people. 15-minute test: buyer runs `/onboard new` and gets a client-ready intake link + kickoff brief template in their repo. Format: agent pack (Claude Code plugin + portable markdown) with templates. Competitors: two Notion-template packs (static, no agents) and one $400 course (over-band, assigns homework instead of doing work).

**1.2 Spec:** *Client Onboarding Pack* — $49. Contents: 4 commands (`/onboard new`, `/onboard assets`, `/onboard scope`, `/onboard kickoff`), 2 agents (intake-interviewer, scope-guard), 9 templates (intake form, scope-freeze letter, kickoff brief, red-flag checklist…), install guide, worked sample project. First win: a real client intake link live on day one. License: personal — for the buyer's own studio; not for resale. Maintenance: quarterly refresh of runtime-specific install steps; changelog public. Support: email for broken assets and unclear docs; no custom implementation. Refunds: 30 days, no questions.

**1.3 Commerce:** Polar.sh as merchant of record (handles VAT — Deno is EU-based, this is load-bearing). Delivery: Polar file download (the pack zip) + license key that also grants access to a private updates repo. Checkout success URL → `/delivery/onboarding-pack` with install steps. Until the test purchase clears end-to-end, the page shows "request access."

**1.4 Distribution:** Owned: email capture on the free tier from day one. Earned: three deep, dated articles — "The onboarding brief that prevents scope disputes," "Red-flag client screening, systematized," "Agent-driven client intake, dissected" — each answering a query his buyer actually searches. Open core: `/onboard new` command + intake template free on GitHub (MIT); the paid pack is the full crew. Borrowed: two freelance communities where he already participates, author-disclosed.

**1.5 Refresh loop:** decay surface = runtime install steps, template legal language, competitor landscape. Quarterly agent Loop diffs the docs against current runtime versions and files a PR; Deno gates the merge. Buyers get updates via the private repo; changelog is public.

### Deno's build ledger (honest cost of creating the product)

| Phase | Deno-hours | Agent spend | Notes |
|---|---|---|---|
| Extract + structure the judgment | 6 | ~$5 | Mining his own 11 projects |
| Build pack (commands/agents/templates) | 10 | ~$15 | Agents draft; Deno curates ruthlessly |
| Sample project + install testing | 4 | ~$5 | Tested on 3 runtimes |
| Landing page + delivery wiring | 5 | ~$5 | Checkout tested with a real card |
| Free tier + 3 articles | 8 | ~$10 | The marketing IS the product subset |
| **Total to launch** | **~33** | **~$40** | Plus ongoing: ~2 h/quarter refresh |

---

## Part 3 — Scenario economics

> **These are scenarios, not forecasts or promises.** Each column is arithmetic under the named assumptions. Sales volume is the assumption you have least control over and the one most people overestimate. No scenario is typical, guaranteed, or a claim about what you will earn.

**Named assumptions (all scenarios):** price $49 one-time (your input); merchant-of-record fee **5% + $0.50 per transaction** (Polar.sh Starter pricing for orgs created on/after May 27, 2026, per the July 2026 field dossier — verify current fees at signup; non-US cards +1.5%); ~2 support minutes per sale averaged; refund rate 5% (30-day no-questions policy); build cost already sunk (see ledger above); taxes and overhead excluded; **distribution exists** — sales assume real traffic from the free tier + articles, which took the worked example ~8 hours to seed and takes months to compound.

| | Scenario A — "Quiet launch" | Scenario B — "Free tier working" | Scenario C — "Distribution compounding" |
|---|---|---|---|
| Sales / month | 5 | 25 | 80 |
| Gross | $245 | $1,225 | $3,920 |
| MoR fees (5% + $0.50/txn) | −$14.75 | −$73.75 | −$236.00 |
| Refunds (5%) | −$12.25 | −$61.25 | −$196.00 |
| Net before overhead/tax | ~$218 | ~$1,090 | ~$3,488 |
| Operator hours / month | ~3 | ~5 | ~8 |
| What must be true | A few readers convert | Free tier installs convert at low-single-digit % | Articles rank; pack gets shared; list grows |
| Failure modes to expect | Silence (most common) | Plateau — installs without upgrades | Staleness; a runtime change breaks installs |

**Read this table as a mechanism, not a menu.** You do not choose Scenario C; you choose the *work* in the "what must be true" row and the market grades it. The margin structure (~90%+ after fees) is the real story: products are how service operators stop reselling their hours.

---

## Part 4 — Fulfillment runbook (agent roles)

Products are fulfilled by machinery, not effort. The crew below runs the *business*, not just the build.

| Role | Agent or human | Responsibility | Quality gate |
|---|---|---|---|
| Director | **You** | Product decisions, pricing, every public artifact | Human gate before anything ships |
| Builder | agent | Pack contents, templates, install scripts | Sample project passes on 2+ runtimes |
| Reviewer | agent (adversarial) | Attack install steps, template edge cases, claim accuracy | Written defect list per release |
| Proof-writer | agent | Landing copy, articles, changelog | Zero outcome-marketing; every claim traces to the product |
| Refresh sentinel | agent (Loop, quarterly) | Diff docs vs. current runtimes/tools; file PR | Idempotent, capped, observable; human merges |
| Support triage | agent (optional) | Draft replies to support email | Human sends; boundary enforced kindly |

---

## Part 5 — Launch checklist

- [ ] Judgment inventory written: the decisions, listed, from real deliveries
- [ ] 15-minute test defined and honest (what does the buyer HAVE, fast?)
- [ ] Full file map drafted; every promised file exists
- [ ] Sample/worked project included and tested clean on a fresh machine
- [ ] Price set inside the $19–149 band, anchored to buyer's alternative
- [ ] License text in the product header (personal use; no resale)
- [ ] Merchant of record live; **one real test purchase completed and refunded**
- [ ] Checkout → delivery → install path walked end-to-end by someone who isn't you
- [ ] Refund policy (30-day) published on the product page, not buried
- [ ] Free tier / open core published with capture in place
- [ ] Three deep answer-the-query articles drafted (dated, sourced)
- [ ] Refresh loop scheduled with a human gate; changelog page exists
- [ ] Ledger open: sales, fees, refunds, support minutes per week
- [ ] Kill criterion written and dated (Part 6)

## Part 6 — Kill-criterion worksheet

```
METRIC:        (e.g., paid sales — not installs, not stars, not praise)
THRESHOLD:     (e.g., 10 sales)
BY DATE:       (e.g., launch + 90 days)
IF MISSED →    (choose in advance:)
   [ ] Kill: archive, publish the post-mortem (post-mortems build more trust than launches)
   [ ] Reposition: same product, different buyer/query (one repositioning, then re-date)
   [ ] Fold into free tier: grow the audience asset even if this product dies
REVIEWED BY:   (weekly /ai operate loop + one human who will say "stop")
WHAT I WILL NOT DO: add features to escape a distribution problem.
```

**Graduation criterion:** when the product sells steadily and the refresh loop runs without drama, the compounding constraint becomes distribution — an owned audience and evergreen surfaces. That is the [System Kit](system-kit.md).

---

© Frank Riemer · agenticincome.ai · Personal license — not for resale or redistribution.
