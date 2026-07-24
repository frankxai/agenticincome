<div align="center">

# Agentic Income

## The hours are over. The machines are yours.

### Build income systems with AI agents — machinery you can inspect, public contracts you can run.

**[agenticincome.ai](https://agenticincome.ai)** · the hub of the trinity:
[**EARN**](https://agenticincome.ai) → [**AUTOMATE**](https://agenticpassiveincome.com) → [**COMPOUND**](https://disruptivepassiveincome.com)

</div>

---

Something structural changed in 2025–2026: the same agent runtimes that write software now research markets, draft offers, build sites, wire checkouts, and run weekly operating loops. One person directing an agent team can deliver work that once required a small firm.

That changes the oldest constraint on solo income: your hours.

Agentic Income publishes the machinery, honest costs, and operating discipline without promising a result. The reusable system is public in [frankxai/agentic-income-skills](https://github.com/frankxai/agentic-income-skills): inspectable contracts, executable scripts, and a governed reference implementation under MIT.

## Run the public system

The public repository works with any capable coding agent that can read a Markdown skill. Its scaffold and validator require Node.js 20 or newer.

```bash
git clone https://github.com/frankxai/agentic-income-skills.git
cd agentic-income-skills
npm install
npm test
npm run income:init -- --output=../my-income-system
npm run income:validate -- ../my-income-system/income-system.json
```

Then ask an agent to use the public skill:

```text
/agentic-income build a request-to-quote desk for Amsterdam renovation
businesses, with human approval before pricing or outbound commitments.
```

The public repository ships:

| Surface | What it does |
|---|---|
| `skills/agentic-income/SKILL.md` | Discover, validate, build, sell, deliver, operate, publish, prove, and improve a principal-owned agent service |
| `schemas/income-system.v1.schema.json` | Defines the system, authority, evaluation, economics, operations, and evidence contract |
| `scripts/scaffold-income-system.mjs` | Creates an owned copy of the reference Outcome Pack |
| `scripts/validate-income-system.mjs` | Runs schema and non-negotiable policy checks |
| `examples/request-to-quote-desk` | Provides the first governed reference system |

No Claude marketplace or private-repository plugin is required or advertised.

## The knowledge base — factual, dated, re-verified on a loop

The site research library carries dated sources and a quarterly review cycle:

| | |
|---|---|
| [01 · The Agent Landscape](knowledge/01-landscape.md) | Claude Code, Codex, Gemini CLI, OpenCode, OpenClaw, Hermes, MCP — what to use for what, right now |
| [02 · Income Models](knowledge/02-income-models.md) | Services → products → systems: the three mechanisms, real economics, the path through them |
| [03 · Agent Fulfillment](knowledge/03-agent-fulfillment.md) | The five delivery patterns, quality floors, and the two-day sprint anatomy |
| [04 · The Tool Stack](knowledge/04-tool-stack.md) | The five-slot minimum machine — merchant of record, email, web, analytics, agents |
| [05 · Honest Marketing](knowledge/05-honest-marketing.md) | Selling without income claims: the FTC/EU floor and evidence-led language |
| [06 · Attested Cases](knowledge/06-cases.md) | Proof with provenance — the case format and standing library |
| [07 · Field Dossier](knowledge/07-field-dossier.md) | The raw verified research — every claim sourced, conflicts flagged |

The reusable, public operating contract remains [agentic-income-skills](https://github.com/frankxai/agentic-income-skills).

## The business model

1. **Open core (MIT):** the public skill, schema, scaffold, validator, and reference system.
2. **The Brief:** weekly landscape diffs, one stream teardown, and system updates.
3. **Self-serve products:** Starter Kit (free), Income Architecture Blueprint ($67), Agent Team Pro ($129), and Private Intel ($19/mo). Paid access remains visibly unavailable until checkout is connected.
4. **Disclosed affiliate research:** recommendations that survive without the incentive. Compensated destinations are labeled before the click, with a non-affiliate alternative named when one exists.
5. **Implementation Sprint:** scope-first agent-system delivery documented with acceptance and evidence.

No earnings claims anywhere. We sell machinery and education, never outcomes.

## The trinity

| Property | Job |
|---|---|
| **[agenticincome.ai](https://agenticincome.ai)** | EARN — accepted paid work and principal-owned agent services |
| **[agenticpassiveincome.com](https://agenticpassiveincome.com)** | AUTOMATE — owned assets that run on bounded loops |
| **[disruptivepassiveincome.com](https://disruptivepassiveincome.com)** | COMPOUND — simulation-first portfolio and wealth-system research |

Public machinery: [agentic-income-skills](https://github.com/frankxai/agentic-income-skills) · [affiliate-agent-skills](https://github.com/frankxai/affiliate-agent-skills) · [agentic-income-template](https://github.com/frankxai/agentic-income-template) · [awesome-agentic-income](https://github.com/frankxai/awesome-agentic-income).

## Site development

Next.js 16 · React 19 · Tailwind 4 · GSAP.

```bash
pnpm install --frozen-lockfile
pnpm run merge:gate
```

## License and disclaimers

Public skills, schemas, scripts, and reference systems are MIT licensed in their public repository. Curated registries may use CC-BY-4.0. Paid products use separate terms when checkout is live. Educational content is not financial, legal, or tax advice. Affiliate relationships are disclosed before compensated routes.

<div align="center">

**Clone the public system. Create one Outcome Pack. Validate it before implementation.**

</div>
