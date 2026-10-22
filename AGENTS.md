# AgenticIncome Agent Contract

## Scope

- Public commercial site for `agenticincome.ai`.
- Primary model: the open operator system (live MCP server, free starter kit, open-source pack) and digital products.
- No consulting, done-for-you or implementation engagements (starlight `TRUTH.md` §1). Paid products stay on the standard waitlist until they pass PRODUCT-RELEASE-GATE.
- Supporting models: open-source distribution and disclosed editorial/affiliate research.
- Production promotion, domain changes, checkout activation, and customer promises remain human-gated.

## Before Editing

1. Read `DESIGN.md`, `TASTE.md`, `SYSTEM.md`, and `SKILL.md`.
2. For public UI work, read the estate Premium Web OS and run the Agent Visual Warmup Protocol.
3. Create or update `design/PAGE_SPEC.md`, `design/SCENE_BRIEF.md`, and `design/design-loop-evidence.json`.
4. Preserve unrelated work and use an isolated branch/worktree.

## Public Language

- Lead with customer jobs, implementation scope, proof, and ownership.
- Do not expose queue, swarm, harness, operator, internal tier, environment, or coordination language.
- Do not invent revenue, customer, capacity, performance, or outcome claims.
- State honestly when checkout, intake, analytics, or fulfillment is not connected.

## Quality Gates

```powershell
pnpm install --frozen-lockfile
pnpm run type-check
pnpm run links:check:static
pnpm run build
```

For visual work, inspect desktop, mobile, and reduced-motion output and validate the design evidence manifest.

## Deployment

- Use Vercel native Git integration only.
- Push one coherent branch and verify one preview deployment.
- Never promote to production or mutate domains without explicit approval.
