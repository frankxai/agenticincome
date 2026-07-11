---
title: "Run the trinity with Codex CLI (and Cursor, Gemini CLI, OpenCode)"
last_verified: 2026-07-11
review_cycle: quarterly
---

# Codex CLI & the portable runtimes

The packs' intelligence is markdown, not magic — any competent agent runtime executes them. Codex CLI is the strongest alternative home (open-source, Apache-2.0, included in every ChatGPT plan since the April 2026 token-credit change).

## Codex CLI setup

```bash
npm install -g @openai/codex        # or: curl -fsSL https://chatgpt.com/codex/install.sh | sh
codex                                # sign in with your ChatGPT account

# Get the packs as a reference workspace
git clone https://github.com/frankxai/agenticincome ~/packs/agenticincome
git clone https://github.com/frankxai/agenticpassiveincome ~/packs/agenticpassiveincome
```

## Two ways to run a stage

**1. Point at the command file (works today, zero setup):**

> "Read `~/packs/agenticincome/commands/ai-assess.md` and execute it for me. My surfaces: <your links>. Write the artifact into ./income/."

**2. Install as custom prompts (feels native):** Codex reads custom prompts from `~/.codex/prompts/` — copy each command body in once and get `/ai-assess`-style invocation:

```bash
mkdir -p ~/.codex/prompts
for f in ~/packs/agenticincome/commands/*.md; do cp "$f" ~/.codex/prompts/; done
```

`AGENTS.md` in each repo is the contract Codex honors natively — work inside the clone (or copy the doctrine block into your project's AGENTS.md) and the no-income-promises, artifacts-always rules ride along automatically.

## Cursor / Windsurf

Same pattern as method 1: add the pack repo to the workspace, reference the command file in chat, paste an `agents/*.md` body as the role prompt when a stage calls for a specialist. Cursor's rules file can carry the doctrine block.

## Gemini CLI (with a caveat) & OpenCode

- **Gemini CLI:** still excellent — but since June 18, 2026 the free hosted tier is gone; you need a paid Gemini API key or Vertex auth. Budget accordingly.
- **OpenCode:** the sovereignty pick (75+ providers incl. local models). Load the command file per stage; keep `knowledge/` in the workspace so facts resolve locally. Note Anthropic subscription login was removed (API keys work); ChatGPT subscriptions connect natively.

## What stays true everywhere

The artifact contract (files in your repo, always) · scenario-only economics · kill criteria · the two-question copy gate. Runtimes churn quarterly — the January runtime debates already look quaint — **your income architecture ports because it's markdown + git, not vendor state.** That's deliberate, and it's rule VIII of the [manifesto](../../MANIFESTO.md).
