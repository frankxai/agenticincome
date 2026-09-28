---
title: "The Agent Landscape — September 2026"
last_verified: 2026-09-28
review_cycle: quarterly
---

# The Agent Landscape — what exists right now

The single most important shift of 2025–2026: **coding agents became general-purpose operators.** The same runtime that writes software can research a market, draft an offer, build a site, wire a checkout, and run a weekly content loop. That is why "agentic income" is now a practical discipline instead of a thought experiment: the tooling below is what this entire business runs on, and everything we teach assumes you have at least one of these installed.

## Tier 1 — the daily drivers

### Claude Code (Anthropic)
- CLI + desktop app + web + IDE extensions; included in Claude Pro/Max plans or API pay-as-you-go. The most mature **plugin system**: commands, subagents, skills (`SKILL.md`), hooks, and MCP servers, distributed through git-based marketplaces (the official marketplace lists 300+ plugins as of September 2026) — which is exactly how the `/ai`, `/api`, and `/dpi` packs install.
- Model family as of September 2026: Fable 5.1 (the Mythos-class tier above Opus; Fable 5 launched June 9, 2026), Opus 5.5 (released Sept 22, 2026), Sonnet 5, Haiku 4.5 ([models overview](https://platform.claude.com/docs/en/about-claude/models/overview)). Long-horizon autonomous sessions, background tasks, scheduled runs.
- Why it matters for income work: skills + plugins turn one-off prompting into **owned, versioned capability** — your business logic lives in your repo, not in a chat history.
- Get it: `curl -fsSL https://claude.ai/install.sh | bash` (Windows: `irm https://claude.ai/install.ps1 | iex`) · [docs](https://code.claude.com/docs/en/setup)

### OpenAI Codex / Codex CLI
- Open-source (Apache-2.0, Rust, ~127k stars) CLI plus IDE/cloud/desktop surfaces; included in every ChatGPT plan since the April 2026 move to token-based credits; deep GitHub integration; `AGENTS.md` as its repo contract format (now a cross-vendor convention we follow in every repo here).
- Our packs ship a portable layer (plain markdown skills + `AGENTS.md`) precisely so Codex users get the full system without Claude-specific features.
- Get it: `npm install -g @openai/codex` · [docs](https://developers.openai.com/codex)

### Gemini CLI (Google)
- Open-source (Apache-2.0) terminal agent — but the story changed on **June 18, 2026**: Google stopped serving the hosted backend for free and consumer-tier users, steering them to the new Antigravity CLI. Gemini CLI still works fine **with a paid Gemini API key or Vertex auth**; it is no longer the free on-ramp it was in 2025. Plan accordingly.

### OpenCode (Anomaly)
- Open-source, provider-agnostic TUI agent (~210k stars, 75+ providers including local models). Matters because it decouples the workflow from any one vendor — the sovereignty pick, and the reason our packs keep a portable core. Paid "Go" tier $10/mo for curated open-model access; note Anthropic subscription login was removed (API keys work), while ChatGPT subscriptions connect natively.

## Tier 2 — the operators

### OpenClaw (the always-on personal agent)
- The open-source personal AI assistant (Clawdbot → Moltbot → OpenClaw after a trademark dispute) — now the **most-starred AI agent project on GitHub (~391k stars, September 2026)** with ~3.2M users, stewarded by the OpenClaw Foundation.
- What it does: runs **on your machine or VPS**, connects to WhatsApp / Telegram / Slack / Discord / Signal / iMessage and a dozen more channels, executes skills on a schedule (ClawHub registry), remembers context. Think: a chief-of-staff process that never sleeps.
- Income relevance: OpenClaw is the *operations* layer for streams built with the `/api` pack — daily content checks, inbox triage, publication pings — while Claude Code / Codex do the heavy build work. Ecosystem note: ChatGPT subscription auth works with it; Anthropic blocked Claude subscription access (API keys are the route).
- ⚠️ **The security reality (do not skip):** 40,000+ internet-exposed instances were found in Feb 2026, a one-click RCE (CVE-2026-25253) was patched, and 800+ malicious skills have been pulled from ClawHub. Microsoft's guidance: don't run it on a standard personal or corporate machine. Our doctrine: **isolated VPS or dedicated hardware only**, dedicated accounts, scoped tokens, no payment credentials, allowlisted actions, patched weekly. Run it like a new employee with a company card: small limits, full logs.

### Hermes (the self-improving operator + the sovereign orchestrator)
- Two things share the name; both matter here. **Nous Research's Hermes Agent** (~250k stars, MIT, "runs on a $5 VPS") — its differentiator is a built-in learning loop that extracts reusable skills from completed tasks, so repeat work can reuse what earlier runs learned. Telegram/Discord/Slack/WhatsApp/Signal/Email/CLI channels, 300+ models, cron + subagents.
- And **FrankX Hermes** (`frankxai/hermes`, currently a private repo) — the governed orchestration layer this business itself runs on: workflows in version control, approval gates, ledger attestation.
- Income relevance: when a stream graduates from "I run it manually each Monday" to "it runs on cron with an approval gate," a Hermes-style workflow is the difference between automation and chaos — and the skill-extraction loop is designed so repeat work gets cheaper as your streams age.

## The connective tissue — MCP
- The **Model Context Protocol** (Anthropic, late 2024; donated in Dec 2025 to the Linux Foundation's Agentic AI Foundation) became the cross-vendor standard: OpenAI, Google, Microsoft all adopted it through 2025–26. Scale check: close to half a billion SDK downloads a month by July 2026 and ~37k entries in the official registry (September 2026).
- Income relevance: MCP is how your agent reaches your actual business — your analytics, your checkout provider, your CMS, your email list. Each of our packs is planned to expose an MCP server (dpi's `@frankxai/dpi-mcp` is not yet published to npm; the hub's is Phase-3).

## What this means for you

1. **You need exactly one Tier-1 runtime to start.** Claude Code if you want the richest pack experience, Codex or Gemini CLI if you're already in those ecosystems, OpenCode if sovereignty is non-negotiable.
2. **Add a Tier-2 operator only when a stream is live.** Always-on agents managing nothing is cosplay; the sequence is build → verify → then automate.
3. **The stack churns; the architecture doesn't.** Runtimes will leapfrog each other quarterly. Skills, offers, and streams — the things the packs help you build — port across all of them. That is deliberate.

*Next: [02 — Income Models](02-income-models.md), where capability meets cash flow.*
