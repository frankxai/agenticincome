<div align="center">

# Agentic Income

### Build income with AI agents — machinery you can inspect, education you can verify, packs you can install.

**[agenticincome.ai](https://agenticincome.ai)** · the hub of the trinity:
[**EARN** /ai](https://agenticincome.ai) → [**AUTOMATE** /api](https://agenticpassiveincome.com) → [**COMPOUND** /dpi](https://disruptivepassiveincome.com)

</div>

---

Something structural changed in 2025–2026: the same agent runtimes that write software now research markets, draft offers, build sites, wire checkouts, and run weekly operating loops. One person directing an agent team can deliver what took a four-person agency three weeks — in two days.

That collapses the oldest constraint on solo income: **your hours**.

This repo is the operating manual and the toolkit for that shift. No income promises, no guru theater — we publish the machinery, the honest costs, and the actual packs this business runs on. **Audit us**: every pipeline, registry, and design decision in this ecosystem is public.

## Install the pack — `/ai`, the Income Architect

Works with **Claude Code** (richest experience), with a portable core for **Codex, Gemini CLI, Cursor, and OpenCode** ([guide](packs/PORTABLE.md)).

```bash
# Claude Code
/plugin marketplace add frankxai/agenticincome
/plugin install ai-pack@agenticincome

# then, inside any project:
/ai
```

`/ai` runs a staged build of your income system — every stage ends with a **written artifact in your repo**, never advice that evaporates:

| Stage | What happens | Artifact |
|---|---|---|
| `/ai assess` | Audits your skills, sites, socials, and assets into a leverage read | `income/00-capability-inventory.md` |
| `/ai architect` | Picks your income model, writes the full business plan — scenario-honest economics, kill criteria included | `income/01-income-architecture.md` |
| `/ai offer` | Designs the offer, pricing, and the agent team that delivers it | `income/02-offer.md` |
| `/ai ship` | Landing page, merchant-of-record checkout, launch runbook — self-service end to end | `income/03-launch-runbook.md` |
| `/ai operate` | The weekly operator loop: numbers, delivery QA, one experiment | `income/weekly/*.md` |

Under the hood: four specialist agents (income-architect, offer-strategist, delivery-engineer, proof-writer) and four skills (capability-audit, pricing-architecture, agent-fulfillment-design, honest-marketing). All readable, all forkable, all MIT.

## The knowledge base — factual, dated, re-verified on a loop

Every file carries `last_verified` frontmatter and a quarterly review cycle. Current pass: **2026-07-11**.

| | |
|---|---|
| [01 · The Agent Landscape](knowledge/01-landscape.md) | Claude Code, Codex, Gemini CLI, OpenCode, OpenClaw, Hermes, MCP — what to use for what, right now |
| [02 · Income Models](knowledge/02-income-models.md) | Services → products → systems: the three mechanisms, real economics, the path through them |
| [03 · Agent Fulfillment](knowledge/03-agent-fulfillment.md) | The five delivery patterns, quality floors, and the two-day sprint anatomy |
| [04 · The Tool Stack](knowledge/04-tool-stack.md) | The five-slot minimum machine — merchant of record, email, web, analytics, agents — legal-light by construction |
| [05 · Honest Marketing](knowledge/05-honest-marketing.md) | Selling without income claims: the FTC/EU floor and the voice that converts by showing machinery |
| [06 · Attested Cases](knowledge/06-cases.md) | Proof with provenance — the case format and the standing library |

## The business model (ours, in the open)

We run the same architecture we teach — five layers, self-service end to end:

1. **Open core (MIT/CC-BY):** this repo — knowledge base, `/ai` pack, templates. Free forever.
2. **The Brief:** weekly email — landscape diffs, one stream teardown, pack updates.
3. **Self-serve products** (merchant of record; no calls, no funnels): **Starter Kit** (free) · **Income Architecture Blueprint** ($67) · **Agent Team Pro** ($129) · **Private Intel** ($19/mo).
4. **Disclosed affiliate research:** recommendations that survive without the incentive, routed through the inspectable [go.agenticincome.ai](https://github.com/frankxai/go-agenticincome) redirector, non-affiliate alternative always named.
5. **Implementation Sprint** (apex, 2/month): scope-first agent-team delivery, documented as attested cases.

No earnings claims anywhere — we sell machinery and education, never outcomes. Full doctrine: [knowledge/05](knowledge/05-honest-marketing.md).

## The trinity

| Property | Job | Pack |
|---|---|---|
| **[agenticincome.ai](https://agenticincome.ai)** (here) | EARN — capability → offers → revenue systems | `/ai` |
| **[agenticpassiveincome.com](https://agenticpassiveincome.com)** | AUTOMATE — streams that run on loops you can inspect | `/api` |
| **[disruptivepassiveincome.com](https://disruptivepassiveincome.com)** | COMPOUND — sovereign wealth architecture, decoupled from hours | `/dpi` |

Related machinery: [go-agenticincome](https://github.com/frankxai/go-agenticincome) (link router) · [agentic-income-template](https://github.com/frankxai/agentic-income-template) (deployable site starter) · [awesome-agentic-income](https://github.com/frankxai/awesome-agentic-income) (curated field) · [hermes](https://github.com/frankxai/hermes) (workflow governance) · [dpi](https://github.com/frankxai/dpi) (the wealth substrate).

## Site development

Next.js 16 · React 19 · Tailwind 4 · GSAP. `pnpm install --frozen-lockfile && pnpm dev`. Release gates: type-check, link-check, build, visual evidence (`AGENTS.md` is the repo contract; `DESIGN.md`/`TASTE.md` the doctrine).

## License & disclaimers

Code and packs MIT · curated registries CC-BY-4.0 · paid products separate personal license. Educational content, not financial advice. Affiliate relationships disclosed inline wherever they exist.

<div align="center">

**Install the pack. Run `/ai assess`. Ship something real this week.**

*Built and operated by the agent teams it ships — that's the proof.*

</div>
