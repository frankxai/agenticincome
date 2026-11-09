# Evidence health and private review dashboard

The health compiler consumes the same authorized snapshot as the existing catalog. It always runs through `projectCatalog` before computing anything. It performs no database reads, publication, tenant authorization, credentials handling or outbound requests.

```sh
node scripts/query-observatory.mjs data/observatory/seed-2026-11-01.json --format health --audit-at 2026-11-02T12:00:00Z
node scripts/query-observatory.mjs data/observatory/seed-2026-11-01.json --format html --audit-at 2026-11-02T12:00:00Z > observatory-review.html
node scripts/query-observatory.mjs /authorized/snapshot.json --format health --freshness-days 14 --audit-at 2026-11-02T12:00:00Z --layer 'API and MCP'
node --test tests/observatory*.test.mjs
```

The default audit time is the snapshot time, making output deterministic. Pass `--audit-at` explicitly to assess later freshness; it cannot precede the snapshot. Audit flags with JSON/CSV formats fail rather than being silently ignored. Input remains capped at two MiB, errors are generic and filters apply to both metrics and products.

## Interpretation

- Sources and observations are deduplicated within the filtered, non-archived, allowlisted product population. The historical seed has 15 stored sources but only 14 linked to projected products. Counts here measure linked evidence, not total database rows.
- Source freshness is retrieval age, not publication age or truth verification. The default policy is 30 days and the threshold is strict (`age > threshold`).
- Weighted coverage is averaged per product; empty populations return null. Editorial and tested coverage remain separate.
- Ranking eligibility requires at least 70% scored coverage, tested outcome reliability, unit economics and retention, linked sources, no stale sources and no flagged comparable conflicts. This is an editorial gate, not verification or a published overall ranking. Tested annotations still require upstream adjudication; this compiler cannot authenticate experiment execution.
- Conflicts compare numeric observations only within the same product, signal, basis, unit, currency and explicit period. Different periods remain distinct. Detection is deliberately conservative: no semantic contradiction inference, causal inference or revenue estimation.
- Financial signals with missing periods are flagged. ARR/MRR remain run-rate claims. Partial, reversed, impossible and future periods fail. No money is summed across claims, currencies or providers.
- The research queue prioritizes contradictions, then stale evidence, then name; it is a deterministic review order, not commercial value or product quality.

## Dashboard boundary

The HTML is a standalone private-review artifact, not a public route or customer release. It has search, native disclosure controls, readable responsive layout, escaped content and a hash-pinned script under a restrictive CSP. It has no tracking, external assets, API calls or embedded private input. Dashboard generation accepts raw snapshots and re-applies the allowlist; it does not trust caller-provided prebuilt reports.

No database mutation, schedule, checkout, public endpoint or production promotion is part of this change. The intended continuous runner can consume this health JSON after its existing authorized snapshot step; it must preserve source permissions, record the snapshot revision and audit time, and follow the owning scheduler's budget and review policy.

## Seed baseline

As of the repository's 1 November seed, audited at 2 November 12:00 UTC: 12 products, 14 linked sources, 25 observations, 10% mean scored coverage, 0% mean tested coverage, 0 ranking-eligible products, 0 stale linked sources under the 30-day policy. Verified revenue remains unknown. These are reproducible historical-data results, not a fresh production-database audit.
