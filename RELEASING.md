# Releasing AgenticIncome

AgenticIncome is a versioned product and public commercial site. Releases communicate a reviewed product-contract boundary; they do not activate checkout, publish customer promises, promote a Vercel deployment, or mutate domains.

## Meaningful-change rule

Create a release candidate only when a coherent capability, public contract, security correction, or material reliability improvement has merged. Do not release quiet weeks, formatting-only edits, generated snapshots without interpretation, or dependency churn with no product impact.

Portfolio discovery may run weekly through [`frankx-domain-command` PR #34](https://github.com/frankxai/frankx-domain-command/pull/34), but this repository does not add a second schedule. The radar proposes work; a maintainer decides whether evidence is meaningful enough to release.

## Versioned product contract

Semantic Versioning requires a declared public API. For AgenticIncome, that contract is documented rather than package-only and includes:

- public routes and their user-visible behavior;
- executable public installation and validation commands;
- product access and checkout gate semantics;
- stable data and workflow formats promised to users;
- documented privacy, authority, and human-approval boundaries.

Choose versions from changes to that contract:

- `PATCH`: compatible correction, reliability, accessibility, or documentation improvement.
- `MINOR`: compatible product route, workflow, pack, or commercial-gate capability.
- `MAJOR`: intentional incompatible change to a documented public contract.

Do not infer the initial version from dates, commits, files, or lines. Document the initial-version rationale in the release pull request before creating a tag.

## Release procedure

1. Update [`docs/releases/release-ledger.json`](docs/releases/release-ledger.json) and `CHANGELOG.md` with merged PR receipts, limitations, and dated metrics.
2. Run `node .github/scripts/validate-release-ledger.mjs` and `node --test .github/scripts/release-ledger.test.mjs`.
3. Open or update a draft pull request and let the path-scoped `Release contract` workflow pass.
4. If product or UI files changed, run the full repository release contract in `SYSTEM.md`, inspect desktop/mobile/reduced-motion exports, and verify one Git-backed Vercel preview.
5. Merge through normal review. Do not tag an unmerged branch.
6. From the reviewed `main` commit, create an annotated semantic-version tag: `git tag -a vX.Y.Z -m "AgenticIncome vX.Y.Z"`.
7. Push the exact tag. The workflow verifies that it is annotated and reachable from `origin/main`, then creates a GitHub release as a draft.
8. Review generated notes so they contain only meaningful, public-safe outcomes and explicit limitations. Publication requires maintainer approval.
9. Treat public changelog publication as a separate reviewed UI change with preview and production evidence.

## Draft-release and cost controls

- Tag pushes never publish automatically.
- GitHub-generated notes use `.github/release.yml` categories and still receive human review.
- Lightweight release validation installs no dependencies and is capped at five minutes.
- Heavy CI ignores release-contract-only changes; mixed product-and-release changes still run full CI.
- Workflows cancel superseded runs.
- Draft PRs stay draft until all required gates are complete.

## Public changelog acceptance

A future index at `https://agenticincome.ai/changelog` and its dated entries must:

- show accurate publication and modification dates in the visible page;
- include matching `datePublished` and `dateModified` structured data with timezone information;
- include index and entry URLs in the sitemap and use one canonical URL per entry;
- describe only externally verifiable outcomes, current access states, and dated metrics;
- avoid revenue, customer, capacity, checkout, or fulfillment claims without evidence;
- pass accessibility, responsive, reduced-motion, link, build, preview, and visual-quality gates.

## Primary-source basis

- [GitHub generated release notes](https://docs.github.com/en/repositories/releasing-projects-on-github/automatically-generated-release-notes) support category configuration and recommend reviewing generated contents before publication.
- [GitHub releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases) are tag-based records; drafts allow review before public publication.
- [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html) requires a declared public API and immutable released contents.
- [Google Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article) recommends ISO 8601 `datePublished` and `dateModified` values with timezone information.
- [Google structured-data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) require accurate, current page information and do not guarantee rich-result display.
