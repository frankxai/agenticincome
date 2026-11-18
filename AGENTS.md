# AgenticIncome Agent Contract

## Scope

- Public commercial site for `agenticincome.ai`.
- Primary model: scoped Agent-as-a-Service implementation.
- Supporting models: digital products, open-source distribution, and disclosed editorial/affiliate research.
- Production promotion, domain changes, checkout activation, and customer promises remain human-gated.

## Frontier Experience Constitution

Before work on interfaces, editorial experiences, or brand and media assets, read the [Frontier Experience Constitution](https://github.com/Starlight-Intelligence/starlight-design-intelligence/blob/e25fab4c5a0dac2ea8c7b91e9397972f5af4b454/portfolio/frontier-experience-constitution.md) and record the revision in the handoff. Resolve the owning product, Figma, brand pack, and VIS authorities for the change. Hold generation and release of owned identity when its source or approval is unresolved. Apply the repository's existing checks and attach the workflow, responsive, provenance, and independent review evidence the constitution requires.

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
