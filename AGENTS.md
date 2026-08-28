# AgenticIncome Agent Contract

## Scope

- Public commercial site for `agenticincome.ai`.
- Primary model: scoped Agent-as-a-Service implementation.
- Supporting models: digital products, open-source distribution, and disclosed editorial/affiliate research.
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

<!-- STARLIGHT-EDITORIAL:START -->
## Editorial contract

Brand: **Agentic Income** (`agentic-income`)

- Read `CREATOR.md` before changing public or customer-facing copy.
- Apply the registered brand voice and the shared editorial gate.
- Reject generated prestige language, rhetorical contrast formulas, invented claims, and abstract labels that hide simple facts.
- Keep public labels in sentence case.
- Run the changed-copy editorial audit before release.

Pinned source: https://github.com/frankxai/starlight-design-intelligence/blob/50ae34c7ac06e6c083f277ca96c3bde8f0a39b43/brand-packs/agentic-income/COPY.md
<!-- STARLIGHT-EDITORIAL:END -->
