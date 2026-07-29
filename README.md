<div align="center">

# Agentic Income

## Own the outcome.

### Turn one valuable workflow into a governed income system you own.

**[Start with the free Field Guide](https://agenticincome.ai/start)** ·
**[inspect the public method](https://github.com/frankxai/agentic-income-skills)**

</div>

---

Agentic Income is the open Field Guide and implementation studio for
principal-owned **Outcome Packs**: governed agent services built around one
buyer, one accepted outcome, and assets the principal keeps.

Agents can research, structure, draft, build, test, document, and monitor. A
person or legal entity remains accountable for pricing, contracts, credentials,
customer sends, production, movement of money, and acceptance. There are no
income promises.

The reusable method is public in
[frankxai/agentic-income-skills](https://github.com/frankxai/agentic-income-skills):
inspectable contracts, an IncomeSystem schema, executable scaffold and
validator, tests, and a governed Request-to-Quote reference pack under MIT.

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
2. **Free Field Guide:** buyer map, path decision, Outcome Pack anatomy, verified commands, and evidence rules with no email gate.
3. **Outcome Pack Lab:** a selective, coming-soon founding cohort for accountable operators who bring one real workflow they can judge.
4. **Outcome Pack Build Sprint:** scope-first implementation of one accepted outcome in principal-owned accounts and source, with verification and handoff.
5. **Disclosed research:** dated recommendations and affiliate routes that survive without the incentive and remain secondary to the product.

Self-serve paid experiments remain out of the primary funnel until checkout,
delivery, support, and refund evidence are all live. No earnings claims anywhere.

## The trinity

| Property | Job |
|---|---|
| **[agenticincome.ai](https://agenticincome.ai)** | EARN — accepted paid work and principal-owned agent services |
| **[agenticpassiveincome.com](https://agenticpassiveincome.com)** | AUTOMATE — owned assets that run on bounded loops |
| **[disruptivepassiveincome.com](https://disruptivepassiveincome.com)** | COMPOUND — simulation-first portfolio and wealth-system research |

Public machinery: [agentic-income-skills](https://github.com/frankxai/agentic-income-skills) · [affiliate-agent-skills](https://github.com/frankxai/affiliate-agent-skills) · [agentic-income-template](https://github.com/frankxai/agentic-income-template) · [awesome-agentic-income](https://github.com/frankxai/awesome-agentic-income).

## Site development

Next.js 16 · React 19 · Tailwind 4.

```bash
pnpm install --frozen-lockfile
pnpm run merge:gate
```

## License and disclaimers

Public skills, schemas, scripts, and reference systems are MIT licensed in their public repository. Curated registries may use CC-BY-4.0. Paid products use separate terms when checkout is live. Educational content is not financial, legal, or tax advice. Affiliate relationships are disclosed before compensated routes.

<div align="center">

**Map one buyer. Define one accepted outcome. Own the system that delivers it.**

</div>

---

[![Built on SIP](https://img.shields.io/badge/Built%20on-SIP-blue.svg)](https://github.com/frankxai/Starlight-Intelligence-System)

**Built on SIP** — this repository composes the
[Starlight Intelligence Protocol](https://github.com/frankxai/Starlight-Intelligence-System)
for memory, attestation, governance, and sovereignty.
