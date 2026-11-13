# Provenance

`WaitlistForm.tsx`, `handler.ts`, `questions.ts`, `store.ts` and `types.ts` in this folder are copied byte for byte from
the shared demand-capture package. Do not edit them here; change them upstream and copy again.

| | |
| --- | --- |
| Repo | `frankxai/starlight-command` |
| Path | `packages/demand-capture/src/` |
| Commit | `a4e12448165a8f76492c0219cc75d93fba59dc67` ("fix(demand-capture): render a not-open message when initialState is closed"), head of starlight-command PR #13 |
| Branch it was read from | `agent/claude/demand-capture-fixes` (PR #13, **unmerged**; the package is not on `main` of starlight-command, which is `a82575575f26f9c80df02a8b6ca3a6419a376aab`) |
| Re-sync needed | This is an unmerged commit. After #13 lands on starlight-command `main`, re-copy from the merge commit, update this file and re-run the checks. Review and rebase of #13 can change these bytes. |
| Why a copy | The package is not published to npm and this repo has no workspace that contains starlight-command, so it cannot be a dependency. |

## Checksums (SHA-256)

```
b0f239612691db20773ff6ec2e4f14afd32723339b986f36b4bd13ec6b184425  WaitlistForm.tsx
b45c8db3efa4a129cc6be88296d71e7207dea77af268d637717e4ae7ee43f2a9  handler.ts
36fd916be0ab39f3486c1fa3d817eae776dc398fd16b9f5619355514518ce20f  questions.ts
9e86a9532715fc70237d325d4481bf70c7177698f9156c783aad6a4323e185f7  store.ts
57a6922aa9d506e04cd56718817b152d961c8d45e9796f56ce13619e796c332b  types.ts
```

## Product row

`data/waitlist-products.json` holds the single `agentic-income` row of `graph/products.graph.json` (starlight-command
`main` at `a82575575f26f9c80df02a8b6ca3a6419a376aab`), trimmed to the fields the handler reads, plus `waitlist.ownerConfirmed: false`. The route keeps the list closed (GET `open:false`, POST 503) until Frank confirms list ownership and the value is set to `true`. The estate registry is
the source of truth for the product id, its stage and its waitlist settings.

## Known upstream behaviour this repo handles in its route

`handleJoin` and `handleState` return the raw `count` and the founding-seat arithmetic in their body, although
`publicCount` is the threshold-gated number. `app/api/waitlist/route.ts` strips both before answering the browser.
Still present at #13 head `a4e1244` (`handler.ts` `publicState`, lines 104-114), so the route's stripping stays. Requested upstream on PR #13; remove the stripping after the fix lands and is re-synced. `tests/waitlist-route.test.mjs` proves no raw count reaches the browser.
