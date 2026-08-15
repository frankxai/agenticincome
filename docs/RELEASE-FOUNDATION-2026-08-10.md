# AgenticIncome release foundation receipt

Date: 2026-08-10

Repository: `frankxai/agenticincome` (private repository, public product)

Branch: `agent/codex/release-foundation-20260810`

## Outcome

The repository now has an evidence-led release contract covering all 15 pull requests merged from 2026-06-14 through 2026-08-07. Each PR appears exactly once in one of seven meaningful groups. Every group carries a limitation and uses status `merged`.

The release workflow accepts only annotated `vMAJOR.MINOR.PATCH` tags whose commits are reachable from `origin/main`. It creates a draft GitHub release and never publishes automatically.

## Safety and cost decisions

- Existing product, checkout, UI, content, analytics, and deployment files are unchanged.
- Checkout and catalog entries retain their fail-closed and manual activation boundaries.
- The heavy CI workflow skips future release-contract-only changes but still runs whenever any product file is present in the change set.
- The lightweight release contract uses the repository's Node 24 convention, installs no dependencies, cancels superseded runs, and has a five-minute cap.
- No duplicate weekly schedule was added; portfolio discovery remains centralized.
- No version, tag, GitHub release, public changelog route, production deployment, external send, or domain mutation was created.
- Local build preflight returned `HOLD` because the machine lacked the required RAM reserve and exceeded the active-task budget. No install or build was started; the existing full cloud merge gate will run once because this change updates `ci.yml`.

## Public changelog gate

The portfolio radar recorded `https://agenticincome.ai/changelog` as a 404. This lane establishes trusted source data and release plumbing only. Implementing the public route requires the repo's web-release gate, current desktop/mobile/reduced-motion evidence, structured-data and sitemap integration, one preview deployment, and an independent release decision.

## Evidence gates

- [x] Ledger validator reports seven records and 15 unique PR receipts.
- [x] Node contract tests pass.
- [x] Workflow YAML parses.
- [x] Patch hygiene, language scan, and staged security scan pass.
- [ ] Draft pull request checks and preview state are inspected remotely.

## Current-practice review

The contract was checked on 2026-08-10 against primary sources from GitHub, Semantic Versioning, and Google Search Central. The resulting decisions are captured in `RELEASING.md`: category-driven generated notes, draft-first review, annotated tags, a declared product contract, visible and machine-readable dates, canonical URLs, current claims, and no promise that structured data guarantees enhanced search display.

## Follow-up sequence

1. Merge this foundation after review.
2. Define and document the initial semantic version against the declared product contract.
3. Create an annotated tag on reviewed `main`; inspect the generated draft release before publication.
4. Implement `/changelog` in a dedicated UI lane when the browser and visual-evidence gates are available.
5. Verify one Vercel preview, then request explicit production promotion approval only if all product and visual gates pass.
