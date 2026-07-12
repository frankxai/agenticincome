---
description: "Stage 5 — the weekly operator loop: review the numbers, QA delivery, pick the next experiment. Repeatable."
argument-hint: "[optional: anything notable since last week]"
---

# /ai-operate — Weekly Operator Loop

The recurring command — run weekly (manually, or wire it as a scheduled loop per `knowledge/03` Loop-pattern discipline: capped, observable, writing artifacts a human audits). Input: `$ARGUMENTS`.

## Process (30 minutes, agent-driven)

1. **Numbers.** Pull/request the week's: visits, checkout starts, sales, refunds, email subs, and (for services) pipeline state. Compare to last week's artifact. No vanity metrics.
2. **Delivery QA.** Any fulfillment this week? Sample one delivery against the runbook's quality gates. Log drift honestly — quality erosion is silent and compounding.
3. **Freshness.** Check the landing page + any published content for stale claims (dates, prices, tool facts vs `knowledge/` — the knowledge base's `last_verified` discipline applies to THEIR surfaces too).
4. **Kill-criteria check.** Against the architecture's kill date/threshold: on track, at risk, or triggered? Say it plainly — the doctrine exists to prevent zombie projects.
5. **One experiment.** Exactly one improvement for next week, smallest-real version: a copy change, a new distribution cut, a price test, an offer tweak. One. Log the hypothesis so next week's loop can judge it.
6. **Graduation check.** If the offer has ≥4 weeks of consistent delivery: is it time to package (service→product, knowledge/02) or to automate a stream (`/api` pack)? If a stream is live and stable: route portfolio tracking to `/dpi`.

## Artifact

Append `income/weekly/<YYYY-WW>.md`: numbers table (with last week's for delta), QA note, freshness fixes made, kill-criteria verdict, the one experiment + hypothesis, graduation note. Provenance line.

Doctrine: the loop is sacred — a skipped week is a data gap you can't backfill; honesty in the log beats optimism in the log; one experiment per week, compounding beats thrashing.
