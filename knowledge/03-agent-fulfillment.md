---
title: "Agent Fulfillment — how agents deliver the work"
last_verified: 2026-07-11
review_cycle: quarterly
---

# Agent fulfillment: the delivery machine

"Agents lead product development and delivery" is the operating doctrine of this entire trinity — and the thing most people get wrong. The failure mode is not weak models; it is **unstructured delegation**. This file is the structure.

## The five patterns (in escalating autonomy)

### 1. The Session — human-in-the-loop build
One agent, one sitting, you watching. Right for: anything client-facing the first time, anything irreversible.
**Discipline:** start from a written brief (the pack commands generate these), end with a written artifact in the repo. If it lives only in a chat, it doesn't exist.

### 2. The Team — parallel specialists
Subagents with distinct roles (researcher, builder, reviewer) fanned out under one director. Right for: deliveries with independent workstreams — site + copy + data at once. Claude Code subagents, Codex cloud tasks, or a Hermes swarm all express this.
**Discipline:** every specialist returns artifacts, and one adversarial reviewer role tries to break the others' work *before* you see it. Quality floors are set by the reviewer prompt, not the builder prompt.

### 3. The Loop — recurring bounded jobs
A scheduled run with a fixed contract: same job, fresh inputs, every interval. Right for: content refresh, link checking, stat re-verification, weekly briefs. Claude Code scheduled runs / cron, OpenClaw schedules, Hermes cron workflows.
**Discipline:** loops must be **idempotent, capped, and observable** — a loop that can spend unbounded money or post unreviewed output is not automation, it is a liability. Every loop writes a run log a human can audit in 60 seconds.

### 4. The Pipeline — multi-stage with gates
Generate → verify → stage → human approve → publish. This is how our own content ships (registry read → draft → integrity checks → PR → merge). Right for: anything public-facing on a schedule.
**Discipline:** the human gate sits **before publish**, always. Approval-gate-after-the-fact is how brands die. The PR is the natural gate primitive — use git even for pure content businesses.

### 5. The Operator — always-on assistant
OpenClaw-class: persistent, messaging-native, reactive + scheduled. Right for: the glue — notifications, triage, quick lookups, kicking off the other four patterns from your phone.
**Discipline:** minimal blast radius. Dedicated accounts, scoped tokens, allowlisted actions, no payment credentials, VPS isolation if it touches anything real. Treat it like a new employee with a company card: it gets one, small, monitored.

## The delivery quality floor (non-negotiables)

1. **Brief before build.** Every delivery starts from a written spec the client/buyer can read. `/ai offer` produces this.
2. **Artifacts, not vibes.** Every engagement ends with repo-committed deliverables + a handover doc. Git-backed delivery is the differentiator clients remember.
3. **Verification is a stage, not a hope.** Typecheck/build/link-check for code; source-check for research; render-check for content. Agents verify agents; you audit the verification.
4. **Provenance on everything.** Date + method + reviewer on every artifact (the SIP attestation pattern from [dpi](https://github.com/frankxai/dpi)). This is what "inspectable" means commercially: your buyer can see how it was made.
5. **Cost telemetry.** Track token/tool spend per delivery. Agent margin only exists if you measure it — put the number in your ledger next to the revenue.

## Worked example — the two-day implementation sprint

```
Day 0  /ai assess on client's business (60 min call → written brief, approved)
Day 1  Team pattern: researcher maps their stack · builder scaffolds the workflow
       · reviewer red-teams edge cases → artifacts land in a private repo
Day 2  Pipeline pattern: end-to-end run with the client's real data behind a
       feature flag → verification report → handover doc + Loom + 30-day loop
       installed (Loop pattern) → invoice
```

One person, ~12 focused hours, delivery that a 2022 agency would have staffed with four people for three weeks. That compression — priced on outcome — is the entire economic basis of Model 1, and the case format in [06](06-cases.md) shows real instances with provenance.

*Next: [04 — The Tool Stack](04-tool-stack.md): the minimum machine around the agents.*
