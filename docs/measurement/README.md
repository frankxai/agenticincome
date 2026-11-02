# Private income measurement projection

Tracks #75 (receipts/economics) and #76 (portable output). This is a read-only
aggregate projection, not a new ledger, authentication service, API route,
database or billing authority.

## Run
Requires Node.js 24 for native TypeScript execution:

```sh
node --test tests/measurement.test.mjs
node scripts/measure-income.mjs data/measurement/synthetic-empty.json
```

The included fixture is synthetic and deliberately has no observed business
results. Keep real measurement inputs outside this public repository. Do not add
private inputs or the output to public MCP resources or preview assets.

## Three data layers
1. Evidence source: source ID, exact brand/product/workspace, half-open UTC
   coverage window, observation time, freshness budget, mode, coverage and ref.
2. Metric observation: one pre-aggregated value per metric at the same scope and
   period, exact currency, source IDs, and ratio numerator/denominator when needed.
3. Goal projection: threshold, direction, due date and met/not_met/unmeasured.
   A target is never an observation.

Source aggregate computation remains with its current owner. #75's accepted
provider adapter must deduplicate provider/account/event IDs, reconcile
corrections and preserve collected/earned/refunded distinctions before it emits
an aggregate. This module neither reads raw payment events nor settles money.

## Eligibility
Every source supporting a value must be live, current, complete, cover the
requested period and match the requested scope. Otherwise the displayed value
is null, status unknown, and the goal unmeasured. The output names the reason.
Sandbox and scenario data never earn actual performance credit.

Missing coverage is not zero. A complete measured zero is valid. No observations
are summed across currencies, products, brands or workspaces. Duplicate
observations/source IDs fail rather than selecting a silent winner. Signed
monetary amounts use safe integer minor units. Ratios must reconcile to a
nonzero integer denominator; the fixture quality goal needs at least 20 runs.

Scopes are filtering/consistency checks, not authorization. Source evidence
levels are declarations from the supplied input, not cryptographic or
independent verification. An authenticated upstream writer must establish
tenant identity, read permission, receipt authenticity, freshness and aggregate
completeness. Never accept an arbitrary uploaded JSON file as trusted
customer/payment evidence.

## Definitions and goals
The fixture illustrates three outcome KPIs and two guardrails:
- Independent paid activations: provider payment plus accepted first artifact.
- Repeat customers within 7 days: mature cohorts only.
- Contribution: earned revenue excluding tax/pass-throughs less direct cash
  costs, acquisition allocation and valued owner time.
- Accepted outcome rate: accepted eligible runs/all eligible runs.
- Support minutes per active workspace-month.

Thresholds and dates are provisional operating goals, not approved price,
revenue forecasts, launch admission, independent assurance or customer promises.
Apply them within the existing admitted release pair and its task owners;
this change does not admit the research-kit proposal or another release.

## Validation and release
Local focused tests cover zero/unknown, stale/partial/foreign scope, fixture
modes, currency/precision, ratios/sample sizes, duplicate identity and CLI parity.
The harness contains only the inspected/new files, not the full application.
Full repository install, type-check, link check, build, remote CI, public host
and production acceptance remain separate checks. No browser-facing changes.

Rollback is removal of these additive files. No migration or runtime flag is
changed. A future adapter must use the same pure function rather than fork
its measurement rules across web/MCP/CLI.

