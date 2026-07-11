---
title: "Run the trinity with Claude Code"
last_verified: 2026-07-11
review_cycle: quarterly
---

# Claude Code — the reference runtime

Claude Code is the richest home for the packs: plugins install in one command, specialist agents fan out as subagents, and loops run as scheduled sessions. This guide takes you from zero to a working `/ai` session.

## Setup (10 minutes)

```bash
# 1. Install (Node 18+)
npm install -g @anthropic-ai/claude-code

# 2. Authenticate — a Claude Pro/Max plan includes usage, or use an API key
claude   # follow the login prompt

# 3. Add the trinity marketplaces (inside any Claude Code session)
/plugin marketplace add frankxai/agenticincome
/plugin marketplace add frankxai/agenticpassiveincome

# 4. Install the packs you need
/plugin install ai-pack@agenticincome
/plugin install api-pack@agenticpassiveincome

# dpi is fork-first by doctrine: clone github.com/frankxai/dpi and run /dpi inside it
```

## Your first session (the honest path)

Work inside a git repo — the packs write artifacts and artifacts deserve version control:

```bash
mkdir my-income && cd my-income && git init
claude
> /ai
```

The router interviews you (4 questions max), routes you to a stage, and ends with a file in `income/`. Commit it. That commit is day one of a business with provenance.

## What Claude Code adds over other runtimes

- **Subagent fan-out:** `/ai offer` can run offer-strategist and delivery-engineer as parallel specialists with an adversarial review pass.
- **Scheduled loops:** `/ai operate` weekly without you remembering — set a scheduled run (or a cron job invoking `claude -p "/ai operate"` headless) with output landing as a PR you review Monday morning.
- **Hooks & gates:** wire a pre-publish hook so nothing public ships without the two-question copy gate (engineer respect / FTC yawn).
- **MCP reach:** connect your analytics, checkout (Polar), and repo hosts so `/ai operate` pulls real numbers instead of asking you to paste them.

## Cost honesty

A weekly operator loop plus a build session or two typically fits comfortably inside a Pro/Max plan; heavy build weeks on API pay-as-you-go are a real cost line — **log agent spend in your weekly artifact next to revenue.** Margin only exists if you measure it (knowledge/03, quality floor #5).

## Troubleshooting

- `/ai` not found after install → restart the session; check `/plugin` lists ai-pack as enabled.
- Commands exist but feel generic → you're outside the repo; the pack reads `knowledge/` for facts and doctrine, so run it where the pack (or your clone) is visible.
- Artifacts not appearing → the pack writes relative to your working directory; run from your project root.
