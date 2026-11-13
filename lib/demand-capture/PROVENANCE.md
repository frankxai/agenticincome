# Provenance

`WaitlistForm.tsx`, `handler.ts`, `questions.ts`, `store.ts` and `types.ts` in this folder are copied byte for byte from
the shared demand-capture package. Do not edit them here; change them upstream and copy again.

| | |
| --- | --- |
| Repo | `frankxai/starlight-command` |
| Path | `packages/demand-capture/src/` |
| Commit | `a3d35b97b160693979b2523042897c82e79dba4b` (2026-10-26, "fix(demand-capture): env pair, Redis error envelopes, atomic position claim, merge on re-join (#72)") |
| Branch it was read from | `agent/claude/workers-ai-harness` (the package is not on `main` of starlight-command yet; `main` is `a82575575f26f9c80df02a8b6ca3a6419a376aab`) |
| Why a copy | The package is not published to npm and this repo has no workspace that contains starlight-command, so it cannot be a dependency. |

## Checksums (SHA-256)

```
38a266bf89beb097e1263994c927edb3f9bd1558d7783ef06865192c36c58a95  WaitlistForm.tsx
2287eaaa4c53554de07d53c0fce8b3b47a94bf6cd895c84bdcacc2208bafbc7b  handler.ts
36fd916be0ab39f3486c1fa3d817eae776dc398fd16b9f5619355514518ce20f  questions.ts
34c2ef83f6910be35f83bb032ff917419c248c3a584191a0b3a84df090252bb9  store.ts
0a43bd519ec8d1acb542c3291f280ce2aed892651a04d9f4a5518fb9bc2aacb8  types.ts
```

## Product row

`data/waitlist-products.json` holds the single `agentic-income` row of `graph/products.graph.json` (starlight-command
`main` at `a82575575f26f9c80df02a8b6ca3a6419a376aab`), trimmed to the fields the handler reads. The estate registry is
the source of truth for the product id, its stage and its waitlist settings.

## Known upstream behaviour this repo handles in its route

`handleJoin` and `handleState` return the raw `count` and the founding-seat arithmetic in their body, although
`publicCount` is the threshold-gated number. `app/api/waitlist/route.ts` strips both before answering the browser.
Worth fixing upstream.
