# Running Agentic Income across agent runtimes

The public operating skill is plain Markdown. Its scaffold and validator are
Node.js scripts. No private app repository or Claude marketplace listing is
required.

## Install the public source

Requires Node.js 20 or newer:

```bash
git clone https://github.com/frankxai/agentic-income-skills.git
cd agentic-income-skills
npm install
npm test
npm run income:init -- --output=../my-income-system
npm run income:validate -- ../my-income-system/income-system.json
```

## Claude Code, Codex, Cursor, Gemini CLI, and OpenCode

Point the runtime at
[`skills/agentic-income/SKILL.md`](https://github.com/frankxai/agentic-income-skills/blob/main/skills/agentic-income/SKILL.md)
and state a mode and goal:

```text
/agentic-income build a request-to-quote desk for Amsterdam renovation
businesses, with human approval before pricing or outbound commitments.
```

If the runtime does not support slash-style skill invocation, use the same text
as a direct instruction:

```text
Read skills/agentic-income/SKILL.md. Use build mode for this goal: ...
```

## What the scripts prove

- `npm run income:init` creates an owned copy of the reference Outcome Pack.
- `npm run income:validate` checks the published schema and non-negotiable
  authority policies.
- `npm test` runs the public repository test suite.

These checks do not prove demand, production security, delivery quality,
customer acceptance, or economic performance. Those require separate evidence
and human review.

## What never changes

The human or legal entity remains principal. Customer-owned accounts and
credentials stay customer-owned. Prices, contracts, transfers, permission
increases, destructive actions, and public income claims require explicit human
approval.
