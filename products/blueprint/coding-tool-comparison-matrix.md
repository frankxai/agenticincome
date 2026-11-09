# Model and coding-tool comparison matrix and publishable page template

> **Part of the Agentic Income Operating Desk Blueprint v3.0 · Personal commercial license.**

AI coding tools are one of the highest-intent comparison categories for technical builders, and they also expose the biggest trap in affiliate publishing: **the four leading tools have zero public cash affiliate programs**. Listicles that rank inferior wrappers first just to collect a bounty lose technical readers immediately.

This file gives you two working assets:
1. A **primary-sourced benchmark matrix** across **Claude Code, OpenAI Codex, Google Gemini CLI, and Cursor** (plus **OpenCode** as the open-source multi-provider benchmark), verified as of September 2026.
2. A **copy-pasteable Markdown/MDX comparison page template** with weighted scoring, inline FTC and EU disclosures, and a workflow-specific upgrade bridge.

---

## 1. Sourced AI coding-tool matrix (verified as of September 2026)

*Verification note: Prices, licenses, install paths, and partner terms below were checked against official vendor documentation as of September 28, 2026. Re-verify each vendor URL before publishing your own dated comparison.*

| Criterion | Claude Code (Anthropic) | Codex CLI & App (OpenAI) | Gemini CLI (Google) | Cursor (Anysphere) | OpenCode (Anomaly · OSS slot) |
|---|---|---|---|---|---|
| **Primary surface** | Terminal-first agent + IDE bridges | Local Rust CLI + IDE extension + cloud/desktop | Terminal CLI (`@google/gemini-cli`) | Full AI-native code editor (VS Code fork) | Terminal TUI/CLI (`anomalyco/opencode`) |
| **Source license** | Proprietary client; plugin spec public | Open source (`Apache-2.0`, `openai/codex`) | Open source (`Apache-2.0`, `google-gemini/gemini-cli`) | Proprietary editor | Open source (`opencode.ai`) |
| **Entry pricing (as of Sept 2026)** | Included in Claude Pro (`$20/mo`), Max (from `$100/mo`), or API pay-as-you-go | Included in ChatGPT Free, Go (`$8/mo`), Plus (`$20/mo`), Pro (from `$100/mo`), or API | Paid Gemini API key or Vertex AI auth (hosted free/Pro backend retired June 18, 2026 in favor of Antigravity CLI) | Pro / Pro+ / Ultra subscription tiers + metered usage | Free CLI with BYOK across 75+ providers; optional OpenCode Go (`$10/mo`) / Go Plus (`$40/mo`) |
| **Flagship API rates (Sept 2026)** | Opus 5.5: `$4/M` in, `$20/M` out; Sonnet 5: `$2/M` in, `$10/M` out | `gpt-5.3-codex`: `$1.75/M` in (`$0.175/M` cached), `$14.00/M` out | Metered per Gemini API / Vertex AI model table | Bundled plan allowance + model overage | Direct pass-through BYOK or Go plan |
| **Project instruction contract** | `CLAUDE.md` + `.claude/skills/` + hooks | `AGENTS.md` + `config.toml` sandbox policies | `GEMINI.md` + workspace context | `.cursor/rules` + `AGENTS.md` support | `AGENTS.md` + `opencode.json` |
| **MCP support** | Native HTTP & stdio MCP client + plugin bundling | Native MCP client support | Official MCP client + Google-managed remote servers | Native MCP client in editor settings | Native MCP client support |
| **Public cash affiliate program?** | **None.** Enterprise Partner Network only (`claude.com/pricing`) | **None.** Enterprise Partner Network only (`github.com/openai/codex`) | **None.** Cloud partner track only (`geminicli.com`) | **None (cash).** Referral gives `$25` usage credit, max 10/cycle (`forum.cursor.com`) | **None.** Open-source project (`opencode.ai`) |
| **Best fit for** | Deep multi-file repo refactors, git worktrees, and deterministic hook gates | Auditable Rust sandbox execution and ChatGPT Plus/Pro subscribers | Teams already standardized on Vertex AI or paid Gemini API keys | Visual diff review, tab autocomplete, and inline multi-file editing | Strict BYOK or local-model builders avoiding single-vendor lock-in |
| **Primary weakness** | Terminal-only curve for GUI-first users; high token burn on un-scoped tasks | Token-credit burn on heavy loops requires explicit task scoping | Hosted consumer tier transition on June 18, 2026 confuses outdated tutorials | Editor lock-in if your team splits across Neovim, JetBrains, and CLI | Claude Pro/Max OAuth login removed early 2026 (requires Anthropic API key) |
| **Primary source URLs** | `https://code.claude.com/docs/en/setup` · `https://claude.com/pricing` | `https://github.com/openai/codex` · `https://learn.chatgpt.com/docs/pricing` | `https://github.com/google-gemini/gemini-cli` · `https://geminicli.com/docs/resources/quota-and-pricing/` | `https://forum.cursor.com/t/cursor-referral-program/40555` | `https://github.com/anomalyco/opencode` · `https://opencode.ai/go` |

### Strategic lesson from this matrix

Because none of the top coding tools pays a cash affiliate commission, thin affiliate sites skip them or push low-grade browser wrappers instead. When you publish an accurate, dated comparison of Claude Code, Codex, Gemini CLI, Cursor, and OpenCode, you earn high-trust technical readers and convert that trust through **your own workflow packs** (`CLAUDE.md` / `AGENTS.md` templates, pre-publish verification skills, and operating blueprints).

---

## 2. Weighted evaluation rubric (reusable across any AI tool category)

Score every tool from `1` (weak) to `5` (strong) on the exact same real-world task before writing prose. Publish the rubric weights alongside the table so readers can re-weight for their own constraints.

| Dimension | Default weight | What `5 / 5` requires in hands-on testing | What `1 / 5` looks like |
|---|---|---|---|
| **Task completion accuracy** | `30%` | Passes repo type-check, unit tests, and build on a real multi-file task without manual rescue | Hallucinates APIs, breaks unrelated files, or loops without progress |
| **Cost transparency & caps** | `20%` | Published per-token or flat-tier pricing, spend ceilings, and zero surprise overages | Hidden credit multipliers, opaque auto-top-ups, or unstated rate limits |
| **Portability & lock-in** | `20%` | Reads standard plain-text files (`AGENTS.md`, `CLAUDE.md`, MCP JSON) inside git | Traps prompts and workflows inside a proprietary cloud database with no export |
| **Verification & safety boundaries** | `15%` | Enforces read-only/sandbox modes, command allowlists, and git diff review before writes | Executes destructive shell or network mutations without confirmation |
| **Setup & recovery speed** | `15%` | Clean CLI/editor install under 10 minutes and deterministic session resume after disconnect | Fragile global dependencies or lost work when a stream drops |

### Deterministic weighted score formula

```text
Weighted Score (out of 5.00) =
  (Accuracy * 0.30) +
  (Cost_Transparency * 0.20) +
  (Portability * 0.20) +
  (Safety_Boundaries * 0.15) +
  (Setup_Recovery * 0.15)
```

---

## 3. Copy-pasteable comparison page template (MDX / Markdown)

Copy this template into `content/comparisons/<slug>.mdx` for every new comparison route. Keep every section in order so readers see the answer, the disclosure, and the criteria above the fold.

```markdown
---
title: "[Tool A] vs [Tool B] vs [Tool C]: hands-on comparison for [specific workflow]"
description: "Tested on [exact benchmark task] with verified pricing as of [Month Year], failure boundaries, and a non-affiliate open-source baseline."
publishedAt: "YYYY-MM-DD"
lastVerifiedAt: "YYYY-MM-DD"
category: "[coding-tools | voice | video | automation | creator-stack]"
---

# [Tool A] vs [Tool B] vs [Tool C] for [specific workflow]

**Short answer (verified as of [Month Year]):** Pick **[Winner]** if your priority is [concrete job and constraint]. Pick **[Runner-up]** if you need [distinct constraint, e.g., Apache-2.0 sandbox or visual diff UI]. If you want a zero-lock-in open-source option with your own API keys, start with **[Non-affiliate OSS alternative]**.

> **Disclosure:** [Use Snippet A if page has partner links, or Snippet B if zero partner links exist; see Section 4 below.]

## How we tested

- **Benchmark task:** [Describe the exact 20-to-45-minute task run in every tool, e.g., "Added a schema-validated API route and unit test in a 40-file Next.js TypeScript repo."]
- **Environment:** [OS, Node/Python version, model tier used, date tested: YYYY-MM-DD]
- **What we did not test:** [State honest limits, e.g., "Enterprise SSO provisioning and 500k+ line monorepo indexing were not tested in this pass."]

## Side-by-side comparison (prices verified as of [Month Year])

| Tool | Best for | Entry price (as of [Month Year]) | License / portability | Weighted score | Official pricing source |
|---|---|---|---|---|---|
| **[Tool A]** | [Specific buyer job] | [$X/mo] | [MIT / Apache-2.0 / Proprietary] | [4.45 / 5.00] | [Vendor pricing URL] |
| **[Tool B]** | [Specific buyer job] | [$Y/mo] | [MIT / Apache-2.0 / Proprietary] | [4.20 / 5.00] | [Vendor pricing URL] |
| **[OSS Non-Affiliate Slot]** | [BYOK / self-hosted builders] | [Free CLI + API usage] | [MIT / Apache-2.0] | [4.05 / 5.00] | [GitHub / docs URL] |

## Why [Winner] won this specific workflow

1. **[Concrete mechanism 1]:** [Measured observation from the benchmark run, e.g., number of edits, test pass on first run, token spend.]
2. **[Concrete mechanism 2]:** [Specific workflow detail.]

## Where [Winner] falls short (who should skip it)

- **Skip [Winner] if:** [Specific boundary 1, e.g., you need offline local models or strict GUI diff review.]
- **Watch out for:** [Specific cost or setup friction observed during testing.]

## When [Non-affiliate alternative] is the smarter choice

[Explain plainly when the free or open-source route beats every paid subscription on the page.]

## Frequently asked questions

### Does [Tool A] or [Tool B] cost less at [usage volume]?
[Show exact arithmetic using published tier and per-million-token prices as of Month Year.]

### What breaks first when migrating from [Tool A] to [Tool B]?
[List exact config files to port, e.g., moving instructions into `AGENTS.md` and MCP server JSON.]

## Next step: grab the workflow checklist

Download the free **[Workflow Checklist Name]** (`/delivery/starter-kit`) to run this benchmark on your own repository in 30 minutes, or inspect the **[Related Paid Pack Name]** (`/offers/[slug]`) if you want our pre-built configurations and verification tests.
```

---

## 4. Inline disclosure snippets (FTC 16 CFR Part 255 & EU AI Act Art. 50)

Place the matching disclosure **above the first comparison table or outbound tool link** so a reader never clicks before knowing the commercial relationship.

### Snippet A: Page contains one or more affiliate links

```markdown
> **Commercial disclosure:** Some outbound tool links on this page are partner links. If you subscribe through them, we may earn a commission at no extra cost to you. Tools are scored on hands-on workflow criteria before payout routes are checked, and every comparison includes a non-affiliate or open-source alternative. Pricing and terms were verified against official vendor pages on YYYY-MM-DD.
```

### Snippet B: Page contains zero affiliate links (direct product model)

```markdown
> **Editorial note:** None of the external tools compared on this page pays us a referral commission. We fund this research through our own self-serve digital packs and blueprints on `/offers`. Pricing and product facts were verified against official vendor documentation on YYYY-MM-DD.
```

### Snippet C: AI-assisted research & drafting provenance note (EU AI Act Art. 50 readiness)

```markdown
> **Methodology & AI provenance:** Benchmark tasks were executed and verified by [Author Name] on YYYY-MM-DD. AI coding tools assisted with table formatting and link checking; every score, command output, price check, and final recommendation was human-verified before publication.
```
