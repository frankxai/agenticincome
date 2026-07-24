---
title: "Run Agentic Income with Claude Code"
last_verified: 2026-07-24
review_cycle: quarterly
---

# Claude Code — use the public operating skill

Agentic Income does not require a private marketplace. Claude Code can read the
public Markdown skill directly; Node.js runs the public scaffold and validator.

## Setup

Install Claude Code using Anthropic's current official instructions, then clone
and verify the public Agentic Income repository:

```bash
git clone https://github.com/frankxai/agentic-income-skills.git
cd agentic-income-skills
npm install
npm test
npm run income:init -- --output=../my-income-system
```

The repository requires Node.js 20 or newer.

## Your first session

Start Claude Code in the cloned public repository or a workspace that can read it:

```bash
claude
```

Then ask:

```text
Read skills/agentic-income/SKILL.md. Use validate mode for ../my-income-system.
Name missing buyer evidence, acceptance criteria, authority gates, evals,
economics, and stop conditions. Update only reviewable artifacts.
```

The skill's portable invocation form is:

```text
/agentic-income MODE GOAL
```

Supported modes are discover, validate, build, sell, deliver, operate, publish,
prove, and improve.

## Validate the owned system

```bash
npm run income:validate -- ../my-income-system/income-system.json
npm test
```

The validator checks the public schema and non-negotiable policy rules. It does
not grant production authority or prove demand, security, customer acceptance,
or economic performance.

## Authority boundary

Agents may research, classify, draft, run tests, and propose reversible changes.
A human or legal entity must approve prices, contracts, customer-facing sends,
production credentials, wider permissions, destructive actions, transfers, and
public income claims.

Public source: [frankxai/agentic-income-skills](https://github.com/frankxai/agentic-income-skills).
