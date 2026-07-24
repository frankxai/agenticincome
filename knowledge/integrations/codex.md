---
title: "Run Agentic Income with Codex and portable agent runtimes"
last_verified: 2026-07-24
review_cycle: quarterly
---

# Codex, Cursor, Gemini CLI, and OpenCode

The public Agentic Income skill is Markdown, not vendor state. Any capable agent
runtime can read it. The scaffold and validator run with Node.js 20 or newer.

## Clone and verify the public source

```bash
git clone https://github.com/frankxai/agentic-income-skills.git
cd agentic-income-skills
npm install
npm test
npm run income:init -- --output=../my-income-system
npm run income:validate -- ../my-income-system/income-system.json
```

## Codex

Open the cloned repository or add it to the workspace, then instruct Codex:

```text
Read skills/agentic-income/SKILL.md. Use build mode for ../my-income-system.
Keep prices, contracts, outbound commitments, credentials, production, and
money movement behind explicit human approval.
```

## Cursor, Windsurf, Gemini CLI, and OpenCode

Use the same pattern: keep the public repository in the workspace, load
`skills/agentic-income/SKILL.md`, and state the mode and goal. If the runtime
supports slash-style skill invocation:

```text
/agentic-income build a request-to-quote system for a named buyer, with
human approval before pricing or outbound commitments.
```

## What stays true everywhere

- The human or legal entity remains principal, supplier, payee, and account owner.
- Customer-owned accounts, credentials, domains, and data remain customer-owned.
- The manifest contains no secrets.
- Schema validation is not demand, security, delivery, or economic proof.
- Public claims require evidence, consent, and human approval.

Public source: [frankxai/agentic-income-skills](https://github.com/frankxai/agentic-income-skills).
