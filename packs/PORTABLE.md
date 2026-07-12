# Running the /ai pack outside Claude Code

The pack's intelligence is plain markdown — commands, agents, and skills are readable prompts, not binaries. Claude Code gives the richest experience (plugin install, subagents, scheduled loops), but the full system runs anywhere an agent can read files.

## Codex CLI / Cursor / Windsurf

1. Clone this repo (or add it as a submodule/reference folder in your workspace):
   ```bash
   git clone https://github.com/frankxai/agenticincome ~/packs/agenticincome
   ```
2. Point your agent at a stage file as the instruction, e.g.:
   > "Read `~/packs/agenticincome/commands/ai-assess.md` and execute it for me. My surfaces: <links>."
3. The repo ships `AGENTS.md` (the cross-vendor repo contract Codex reads natively). Working inside a clone, Codex picks up the doctrine automatically.
4. Specialist roles: paste the relevant `agents/*.md` body as a role prompt when a stage calls for it (e.g. offer-strategist during pricing).

## Gemini CLI / OpenCode

Same pattern — these runtimes follow markdown instructions and honor repo context files. Load the command file for your stage, keep `knowledge/` in the workspace so facts resolve locally.

## Any chat model (minimum viable)

Paste the body of `commands/ai.md` as the system prompt, attach the `knowledge/` files that stage cites, and insist on the artifact contract: every session ends with the markdown file written into your own repo (`income/…`). The artifacts — not the chat — are the product.

## What you lose without Claude Code

- One-command install/updates (`/plugin install ai-pack@agenticincome`)
- Automatic subagent fan-out for the specialist roles
- Scheduled `/ai operate` loops (recreate with cron + your runtime's headless mode)

## What never changes

Artifacts in your repo · honest economics · kill criteria · the two-question copy gate. The doctrine is runtime-independent — that's deliberate: runtimes churn quarterly, your income architecture shouldn't.
