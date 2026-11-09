# Operating desk architecture and daily-to-weekly cadence

> **Part of the Agentic Income Operating Desk Blueprint v3.0 · Personal commercial license.**

A publishing and product business fails in one of two predictable ways: either it ships unverified listicles that erode reader trust, or it builds checkout infrastructure for months before testing whether anyone wants the underlying artifact. The operating desk prevents both failure modes by keeping research, comparison pages, partner verification, email capture, and product specifications in one version-controlled repository.

---

## 1. Repository workspace layout

Keep every commercial claim, partner rate, comparison rubric, and product file in plain text inside git. Do not split your source of truth across untraceable spreadsheets and chat threads.

```text
your-property-repo/
├── content/
│   └── comparisons/               # Dated MDX/Markdown comparison pages
│       └── claude-code-vs-codex.mdx
├── data/
│   ├── programs.json              # Verified partner ledger (derived from recurring-payer-catalog.csv)
│   └── offers.json                # Offer ladder state (status, price_cents, deliverables)
├── products/
│   ├── catalog.json               # Fail-closed Polar checkout gate ("status" field)
│   ├── starter-kit/               # Free on-site workflow checklist ($0)
│   └── flagship-pack/             # Paid pack files + PRODUCT.md + MANIFEST.json
├── ops/
│   ├── cadence-log.md             # Weekly 60-minute Friday review receipts
│   └── kill-criteria.md           # Signed 30-day and 90-day stop rules
└── tests/
    ├── claims-and-dates.test.mjs  # Rejects undated prices, dead links, and hype multiples
    └── catalog-contract.test.mjs  # Verifies every promised deliverable exists on disk
```

### Core architecture invariants

1. **Recommendation precedes monetization:** Every comparison page is scored before checking whether an affiliate link exists. If the best tool for a workflow has no partner program (for example, Claude Code, OpenAI Codex, or an MIT CLI), it still wins the recommendation.
2. **Dated primary sources only:** Every vendor price, commission rate, and cookie window carries an explicit `verifiedAt` date (`YYYY-MM-DD`) and a link to the vendor's official pricing or partner terms page.
3. **Workflow-specific capture:** Email capture finishes the reader's immediate task (a downloadable checklist, comparison rubric, or starter config) rather than asking them to subscribe to a generic newsletter.
4. **Fail-closed commerce:** Unfinished paid packs expose their real `PRODUCT.md` specification and collect `#request-access` waitlist signups. Checkout opens only when files pass checksum verification and a live test purchase succeeds.

---

## 2. The five-stage operating loop

Every comparison page on the desk connects five concrete stages:

| Stage | Input | Artifact produced | Quality gate |
|---|---|---|---|
| `01 · Buyer intent` | Real workflow switching friction you have tested firsthand | Plain-language query brief (`X vs Y`, `best X for [specific job]`) | You must have run every shortlisted tool on the same task |
| `02 · Honest comparison` | Hands-on benchmark runs, official pricing docs, failure notes | Dated comparison page with scored table and failure boundaries | Names a credible non-affiliate or open-source alternative first-class |
| `03 · Payer routing` | `recurring-payer-catalog.csv` verified rows | Disclosed partner link (when best-fit matches) or plain direct link | Inline FTC/EU disclosure placed immediately above the first compensated link |
| `04 · Owned capture` | The checklist or config file you used during testing | Free on-site download + optional release-updates signup | Delivers immediate utility even if the reader never enters an email |
| `05 · Product bridge` | Repeated reader bottlenecks across 3+ comparison pages | Scoped `$24-$99` digital pack or blueprint on `/offers` | Inspectable file tree and 30-day refund policy visible before checkout |

### Decision tree when partner incentives conflict with tool quality

```text
Does Tool A win the hands-on benchmark for this reader profile?
├── YES: Does Tool A have an active, verified partner program?
│   ├── YES -> Recommend Tool A first, disclose commission inline, and name the best
│   │          non-affiliate/open-source alternative right beside it.
│   └── NO  -> Recommend Tool A first with a plain direct link. Monetize the page
│              through your own workflow capture ($0) and digital pack ladder ($24-$99).
└── NO:  Never elevate Tool A to #1 for its payout. List Tool A honestly in the
         table only if it fits a narrower secondary use case, with clear caveats.
```

---

## 3. Daily and weekly operating cadence

Consistency comes from capping scope to your actual calendar. Pick one track below and hold it for 12 weeks before expanding surface area.

### Track selector by weekly calendar budget

| Weekly budget | Weekly output target | Monthly maintenance floor | Primary focus |
|---|---|---|---|
| **Under 5 hrs/wk** | 1 refreshed or newly drafted comparison every 2 weeks | 3 hours/month | One tight category (5 to 8 cornerstone pages) + 1 free checklist + 1 `$39-$67` pack |
| **5 to 10 hrs/wk** | 1 cornerstone comparison + 1 catalog audit per week | 5 hours/month | 10 to 15 comparison routes + waitlist-validated pack + monthly brief |
| **10+ hrs/wk** | 2 comparison routes or pack iterations per week | 8 hours/month | Full comparison directory + 2 self-serve packs + optional scoped sprint |

### Daily 45-minute desk block (Monday to Thursday)

- **Monday (45 min · Benchmark & source lock):** Pick one buyer query. Run the same concrete task across 2 to 4 tools. Record exact version numbers, pricing URLs, failure modes, and setup minutes in a scratch note.
- **Tuesday (45 min · Table & verdict draft):** Fill the scored comparison matrix (`coding-tool-comparison-matrix.md` template). Write the 80-word direct answer, the winner's real weaknesses, and the non-affiliate alternative.
- **Wednesday (45 min · Disclosure, capture & checks):** Check `recurring-payer-catalog.csv` for verified links, place inline disclosure text, attach the workflow checklist link, and run link/claim tests locally.
- **Thursday (45 min · Publish & distribution cut):** Merge to production after preview check. Extract one factual benchmark table or setup lesson into an owned email note or technical community post linking back to the canonical page.

### Friday 60-minute governance & ledger ritual

Copy this block into `ops/cadence-log.md` every Friday:

```markdown
## Weekly desk receipt · YYYY-MM-DD

1. **Shipped or refreshed URL:** [path + git commit SHA]
2. **Pricing & link freshness check (spot-check 3 live pages):**
   - Page 1: [URL] · vendor prices match live site as of YYYY-MM-DD? [yes/updated]
   - Page 2: [URL] · partner redirect resolves 200 OK? [yes/updated]
   - Page 3: [URL] · inline disclosure visible above first monetized link? [yes/updated]
3. **Funnel & waitlist signals (actual exported counts, never estimates):**
   - Qualified page visits (7d): [count]
   - Free starter downloads (7d): [count]
   - Offer `#request-access` or paid checkouts (7d): [count]
   - Refunds or broken-asset emails (7d): [count]
4. **Kill-criterion check:** Days remaining until next gate review: [N days]
5. **Single priority for Monday:** [one verifiable deliverable]
```

---

## 4. Illustrative scenario arithmetic and maintenance floor

> **Scenario notice:** The columns below are arithmetic worked examples under explicit assumptions so you can model fee drag, refund reserves, and operator hours. None of these numbers is a forecast, typical result, or income promise. Search indexing and trust compound slowly; months 1 to 3 commonly produce zero or near-zero revenue.

### Named assumptions used in the arithmetic table

- **Surface:** 10 maintained comparison pages in one technical category, paired with one free starter download and one `$67` self-serve digital product sold via Polar.sh.
- **Merchant-of-record fee:** `5% + $0.50` per transaction (Polar.sh Starter tier for organizations created on or after May 27, 2026, verified September 2026 at `polar.sh/docs/merchant-of-record/fees`; add `+1.5%` for non-US cards where applicable).
- **Refund reserve:** `5%` set aside against the 30-day no-questions refund policy.
- **Tooling overhead:** `$20 to $40/month` (one coding-agent subscription plus domain/hosting; taxes and business insurance excluded).

| Line item | Scenario A: Early indexing (Months 1 to 3) | Scenario B: Initial search & list traction | Scenario C: Established niche reference |
|---|---|---|---|
| Assumed monthly qualified visits | `400` | `3,500` | `12,000` |
| Free starter kit downloads (`3%` of visits) | `12` | `105` | `360` |
| Paid `$67` pack sales (`0.15%` of visits) | `0 to 1` (`$0 to $67`) | `5` (`$335.00`) | `18` (`$1,206.00`) |
| Polar MoR fees (`5% + $0.50/txn`) | `$0 to -$3.85` | `-$19.25` | `-$69.30` |
| 5% refund reserve | `$0 to -$3.35` | `-$16.75` | `-$60.30` |
| Disclosed partner commissions (illustrative range) | `$0` | `$30 to $90` | `$180 to $420` |
| Direct tool & domain spend | `-$25.00` | `-$30.00` | `-$40.00` |
| **Scenario net before tax** | **`-$25.00 to +$34.80`** | **`+$299.00 to +$359.00`** | **`+$1,216.40 to +$1,456.40`** |
| **Required builder hours / month** | **`12 hrs` (build phase)** | **`6 hrs` (1 refresh/wk)** | **`6 to 8 hrs` (floor + support)** |

**How to use this worksheet:** Replace the assumed visit, download, and conversion rows with your actual 30-day numbers on Friday of Week 4. Notice how direct digital-pack sales outperform affiliate clicks at modest traffic volumes while keeping recommendation integrity intact.

---

## 5. 30-day and 90-day kill-criterion worksheets

Write your stop conditions before publishing page one. Without a dated kill rule, weak categories turn into permanent maintenance obligations.

### Gate 1: 30-day execution and demand-signal contract

```text
CATEGORY UNDER TEST:        _________________________________________________
START DATE:                 YYYY-MM-DD
REVIEW DATE (START + 30d):  YYYY-MM-DD

MINIMUM EXECUTION INPUT (must be 100% complete to judge demand fairly):
  [ ] 4 hands-on comparison pages published with dated primary-source tables
  [ ] 1 free workflow checklist live on-site with working download
  [ ] 1 paid pack PRODUCT.md specification live with #request-access capture
  [ ] 4 technical distribution shares linking back to canonical pages

30-DAY SIGNAL THRESHOLD (set before launch, e.g., 25 starter downloads OR 5 waitlist requests):
  Target metric & count:    _________________________________________________
  Actual count on Day 30:   _________________________________________________

PRE-COMMITTED DECISION IF MISSED (check one before starting):
  [ ] Narrow the buyer query to a sharper workflow bottleneck for one final 30-day sprint
  [ ] Archive the category cleanly, publish a short lessons-learned note, and test a new category
```

### Gate 2: 90-day commercial viability contract

```text
REVIEW DATE (START + 90d):  YYYY-MM-DD
MAINTENANCE FLOOR HOURS/MO: ______ hours

CHECK 1: Did combined pack + verified partner net exceed $0 after tool costs?   [yes / no]
CHECK 2: Are at least 1.5% of free starter-kit readers inspecting /offers?      [yes / no]
CHECK 3: Are all vendor prices and partner terms on live pages under 90d old?   [yes / no]
CHECK 4: Would you start this exact category again today with current data?     [yes / no]

RULE: Two or more "no" answers trigger a mandatory scope cut or category archive within 14 days.
Never add a second paid product to rescue a category that failed its first distribution check.
```
