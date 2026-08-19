# AgenticIncome — Property Strategy

> Date: 2026-08-16. This section is the current contract; history preserved below the marker.

## The two-site doctrine

- **agenticincome.ai — earn WITH agents.** The operator system for humans building income with AI agent teams: playbooks, partner economics, working code, human judgment at the gate. Services → products → systems, walked in order.
- **agenticpassiveincome.com — systems that run without you.** Automation-first, streams-on-loops discipline. Its own MCP server at `/api/mcp`. The two sites cross-link and do not overlap: judgment-in-the-loop lives here, automation lives there.

## The MCP-first thesis

The site IS an MCP server (`/api/mcp`, streamable HTTP; docs at `/mcp`; discovery at `/.well-known/mcp.json`). Agents are the new front door: an operator's agent can query income models, verified partner economics, the honest product catalog, a deterministic `fit_check`, and the playbooks without scraping. Reading about agentic income is research; querying it is leverage. Free tools stay free; any paid capability gets announced on the catalog, never enabled silently.

## Revenue layers (ranked)

1. **Partner recurring commissions** via go.agenticincome.ai — the registry publishes commission, cookie window, source URL, and verification date (batch verified 2026-08-16); disclosure travels with every surface, including MCP tool responses.
2. **Polar catalog** — Blueprint $67, Private Intel $19/mo, pack editions. Gated fail-closed in `lib/polar.ts` + `products/catalog.json`; goes live only when Frank flips the env vars and catalog status.
3. **Future paid MCP capabilities** — only if they earn their keep, announced on the catalog first.

## Non-negotiables

Zero income promises (stricter than FTC). Every economic claim dated and sourced. Recommendation survives the incentive; alternatives named. Agents build, humans hold the gate.

---

# History — Property Strategy (condensed, 2026-07-11)

> Full trinity plan: `_strategy/TRINITY-MASTER-PLAN.md` in the operator workspace. This file is the repo-local contract. Date: 2026-07-11.

## Role in the trinity

**THE HUB — Earn.** Where a creator converts capability into cash flow with agent teams: services → products → systems. Canonical commercial surface (the only property with an apex service). Siblings: agenticpassiveincome.com (`/api`, automate) · disruptivepassiveincome.com (`/dpi`, compound). All three cross-link; this one owns "start from zero."

## ICP

**The Builder:** technical or semi-technical creator/dev/consultant with a Tier-1 runtime installed, income still hour-coupled. Self-service journey: read knowledge base → install `/ai` → assess → architect → ship within 2 weeks → graduate to `/api` when a stream is worth automating.

## Business model (five layers)

1. Open core: knowledge base + `/ai` pack (MIT) — distribution and trust.
2. The Brief: weekly email; free flagship = Starter Kit v2.
3. Self-serve (MoR — Lemon Squeezy/Polar): Blueprint $67 · Agent Team Pro $129 · Private Intel $19/mo.
4. Disclosed affiliate via go.agenticincome.ai — recommendation survives the incentive; alternative always named.
5. Implementation Sprint, 2/mo cap, scope-first — funds the compounding layers; becomes attested cases.

## Voice

Cathedral-builder energy, engineer's honesty. Bold capability claims → exact mechanism → honest costs → one action. Zero income promises (stricter than FTC). Kill list / power list per `knowledge/05`.

## Operating doctrine

- Agents lead product development and delivery; humans gate publication.
- Knowledge freshness contract: `last_verified` + quarterly refresh loop; drift is a bug.
- Every pack session ends in a written artifact; every public claim traces to machinery.
- TASTE.md survives: no invented certainty, no fake dashboards, access states honest.
- dpi CANON respected across the trinity: no funnel mechanics on doctrine surfaces.

## KPIs (monthly agent report)

Pack installs (clones/stars) · email subs · MoR revenue by product · affiliate revenue by program · KB freshness % · GSC clicks · sprint pipeline.
