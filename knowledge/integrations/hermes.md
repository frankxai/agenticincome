---
title: "Hermes — self-improving agents and governed workflows"
last_verified: 2026-07-11
review_cycle: quarterly
---

# Hermes: when your machine should get cheaper to run every month

Two systems share the name; use them for different jobs.

## Nous Research Hermes Agent — the self-improving operator

Open-source (MIT, ~213k stars), runs on a $5 VPS, speaks Telegram/Discord/Slack/WhatsApp/CLI, drives 300+ models, ships a cron scheduler and subagents. Install:

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
# Windows: iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

**Why it matters for income machinery:** the five-stage learning loop extracts reusable skills from completed tasks — agents with 20+ self-generated skills run measurably faster on repeat work. Your weekly content refresh, your monthly registry audit, your syndication cuts: these are exactly the repeated, bounded jobs where a self-improving operator compounds. The economic consequence is rare and real: **your cost-per-run falls as your streams age.** Most businesses' ops costs creep up; a skill-learning operator bends the curve the other way.

Where it fits in the stack: same tier as OpenClaw (the operator layer), different personality — Hermes leans headless/cron-first and skill-accumulating; OpenClaw leans messaging-native and integration-rich. Run one, not both, until a stream demands otherwise. **Every safety rule from the [OpenClaw guide](openclaw-safely.md) applies unchanged** — isolation, scoped tokens, spend caps, human gates. Self-improving does not mean self-approving.

## FrankX Hermes — governed workflows (how this business runs)

[frankxai/hermes](https://github.com/frankxai/hermes) is the orchestration layer of the trinity itself: workflows as version-controlled files, approval gates, ledger attestation. It's the answer to a question every stream owner eventually hits: *"the loop works — now who governs it?"*

The pattern to copy (whatever tool you use):

```yaml
# a governed income workflow, in outline
name: affiliate-content-refresh
schedule: weekly
steps:
  - read: registry (which entries are stale?)
  - generate: refreshed comparisons, evidence labels on
  - verify: claims check · links check · disclosure present
  - gate: open PR — a human approves        # non-negotiable
  - publish: merge → deploy
  - attest: write the run to the ledger     # provenance, always
```

Version-controlled, killable, auditable, gated. If your automation can't show this shape, it isn't automation yet — it's a script with ambitions (and per rule VII of the [manifesto](../../MANIFESTO.md), it doesn't touch the public).

## The maturity ladder (honest sequencing)

1. **Manual + pack** — you run `/ai operate` weekly yourself. *Start here.*
2. **Scheduled runtime** — Claude Code/Codex headless on cron, PRs as gates.
3. **Operator layer** — OpenClaw or Hermes Agent relays, watches, and pings.
4. **Governed workflows** — Hermes-style manifests when multiple streams share pipelines.

Climb one rung per month, not four in a weekend. Each rung must be observable before the next one earns trust — the ladder is how "agents run my business" stays a fact and never becomes a confession.
