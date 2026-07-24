# The First Week — a runbook

> From an observed buyer problem to one reviewable Outcome Pack in seven honest
> days. No income promised; each day ends with an artifact or decision.

## Day 0 — clone and verify the public system (45 min)

Requires Node.js 20 or newer.

```bash
git clone https://github.com/frankxai/agentic-income-skills.git
cd agentic-income-skills
npm install
npm test
npm run income:init -- --output=../my-income-system
```

Open the [public Agentic Income skill](https://github.com/frankxai/agentic-income-skills/blob/main/skills/agentic-income/SKILL.md). It is plain Markdown, so Claude Code, Codex, Gemini CLI, Cursor, OpenCode, and other capable agents can read it without a marketplace plugin.

## Day 1 — observe the buyer (60–90 min)

Ask your agent to use `/agentic-income discover`. Name one buyer, the repeated
workflow, current cost, urgency, budget evidence, acceptance signal, and support
burden. Write the evidence into your owned Outcome Pack. Do not rank an idea
high because the technology is interesting.

## Day 2 — validate one service (60–90 min)

Use `/agentic-income validate`. Choose one fixed outcome, one price test, one
acceptance contract, and one kill criterion. Record what would make the service
unsafe, too bespoke, or too expensive to support.

## Day 3 — complete the system contract (90 min)

Fill in `income-system.json`: legal principal, agent identity, buyer, offer,
interfaces, authority, budgets, evals, economics, operations, and evidence. The
agent may draft. A person or legal entity remains responsible for commitments,
accounts, credentials, and money.

## Day 4 — build the smallest real path (half day)

Use `/agentic-income build`. Implement the smallest repeatable input-to-output
path. Keep production credentials and customer data out of the manifest and
model context. Use the Request-to-Quote example as a reference, not as proof
that another market will buy.

## Day 5 — validate and inspect (half day)

From the public repository:

```bash
npm run income:validate -- ../my-income-system/income-system.json
npm test
```

A passing validator proves only that the document satisfies the published
schema and policy checks. It does not prove demand, delivery quality, security,
or customer acceptance.

## Day 6 — prepare the public explanation

Use `/agentic-income sell`. Write the buyer, accepted outcome, scope, process,
authority boundary, evidence, limitations, price state, and next action. No
income promise. No customer claim without consent and accepted delivery evidence.

## Day 7 — decide (30 min)

Review the buyer evidence, validation result, implementation cost, authority
risk, and support burden. Choose one: implement, revise, or stop. Record the
reason and the next evidence required.

---

## After week one

- A paid, accepted service with repeatable inputs → improve its evals and runbook.
- A stable service decision that repeats → package the reusable judgment.
- An owned asset that sells on a bounded loop → move it to Agentic Passive Income.
- Capital, crypto, lending, staking, trading, or yield work → move it to DPI.

## When you get stuck

Stuck on the buyer → interview someone who owns the workflow.
Stuck on scope → define the smallest accepted output and everything excluded.
Stuck on authority → deny by default and add a named human approval.
Stuck on proof → distinguish system evidence, accepted delivery, and settled economics.
Stuck on complexity → reduce integrations before adding agents.

Public source: [frankxai/agentic-income-skills](https://github.com/frankxai/agentic-income-skills).
