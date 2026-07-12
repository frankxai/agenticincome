---
description: "The knowledge-refresh loop — re-verify dated facts across the knowledge base (or the user's published streams) and file the diffs. Quarterly, or on demand."
argument-hint: "[optional: path to verify, e.g. knowledge/ or content/]"
---

# /ai-refresh — Freshness Loop

"Updated regularly" is machinery here, not a promise. This command is the machinery. Target: `$ARGUMENTS` (default: `knowledge/`).

## Process

1. **Inventory.** Glob the target for markdown carrying `last_verified` frontmatter. Build the staleness table: file · last_verified · age · review_cycle status. (The monthly `knowledge-freshness` Action produces the same table in CI; this command is the fix, not just the alarm.)
2. **Extract claims.** For each stale (or explicitly requested) file, list its dated/factual claims: versions, prices, fees, program terms, star counts, statistics, regulatory dates. Ignore doctrine — mechanisms don't rot; numbers do.
3. **Re-verify with sources.** Web-search each claim against primary sources (official pricing pages, GitHub repos, regulator sites). Three outcomes per claim: **confirmed** (re-stamp), **drifted** (correct with new source URL), **unverifiable** (mark honestly: "could not re-verify YYYY-MM-DD — treat as historical").
4. **Apply.** Edit files: corrected facts inline, `last_verified` bumped ONLY where verification actually happened, source URLs updated. Never bump a date without doing the work — a false freshness stamp is worse than a stale one.
5. **File the diff.** Write `knowledge/CHANGELOG.md` entry (date, file, what changed, source) — this feeds the weekly Brief's "what changed" section. If running in a repo with PRs: branch + PR, never direct to main (Pipeline rules, knowledge/03).

## Doctrine

- Primary sources only for money facts (fees, commissions, prices) — roundup blogs are leads, not proof.
- Program-term drift is a lesson, not just a fix: when a term changes (a commission cut, a program closing, a free tier dying), add it to the object-lesson list in the relevant file. The drift record IS teaching material.
- Cadence: quarterly for the full base; monthly for `data/programs.json` and anything carrying money terms; immediately when the Action flags red.
- This command works on the user's own published streams too (`/ai-refresh content/`) — the freshness contract they inherit is the one we run.
