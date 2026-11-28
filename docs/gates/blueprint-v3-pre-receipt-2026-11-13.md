# Blueprint v3 — gate pre-receipt (2026-11-13)

Branch `agent/claude/blueprint-v3-gate`, cut from `origin/main` at `66da7d3`.
This is a **pre-receipt**: it records what an agent could verify from a cloud
session. It is not a release approval. G3 and G5 need people; G2 could not be
reached from here.

## Gate table

| Gate | What it checks | Status | Evidence |
|---|---|---|---|
| G0 | Build and tests green | **Pass** | `pnpm install --frozen-lockfile` exit 0; `pnpm run merge:gate` exit 0 on this branch (lint, 244/244 tests, type-check, static link check, `verify:public`, `next build`). After the wording commit: `pnpm test` 244/244, `pnpm lint` 0, `pnpm type-check` 0, `pnpm verify:public` passed. |
| G1 | Package integrity against `MANIFEST.json` | **Pass, with open items** | 6/6 manifest files match MANIFEST.json v3.0.0 by sha256, bytes and line count. No zip/archive build script exists (`archiveName` `agentic-income-operating-desk-v3` is not produced by any script). Outside the manifest in `products/blueprint/`: `AGENTIC_INCOME_BLUEPRINT.md`, `product-kit.md`, `service-kit.md`, `system-kit.md`, plus the `previews/` directory. |
| G2 | Live site serves the offer correctly | **Unverified** | `curl https://www.agenticincome.ai` from this session: the egress proxy refused the tunnel (403, HTTP 000). Needs a check from a machine with normal network access. |
| G3 | Independent review by a different-provider model | **Not run** | Requires a reviewer from a different model provider. Nothing in this receipt counts as G3. |
| G4 | Claims and delivery honesty | **Pass, with one fix and one dependency** | No unsourced income or scarcity claims found in `products/blueprint`. The unbacked promise `lib/offers.ts:176` "Install … in 60 minutes" was reworded to "step by step" (separate commit, wording only). `app/delivery/blueprint` serves no files; it links to `/offers/blueprint` and `/trust`. **Delivery therefore depends entirely on the file attachment on the Polar product.** |
| G5 | Owner decisions (Frank) | **Open** | See list below. |

## G5 — decisions only Frank can make

1. **Price.** Repo states USD 67 (`MANIFEST.json` `priceCents: 6700`, `lib/offers.ts` `price: '$67'`). Open alternatives: EUR 59, or EUR 99–299. No price was changed here.
2. **Polar merchant and org name** buyers will see on the receipt.
3. **`POLAR_*` env in production**: at least `POLAR_ACCESS_TOKEN`, `POLAR_SERVER`, `POLAR_SUCCESS_URL`, `POLAR_PRODUCT_ID_BLUEPRINT` (names from `lib/`; values not inspected and not needed here).
4. **Decision 1** — still open. This session found no definition of it in the repo, so its content is not restated here.
5. **Do the 4 non-manifest files ship?** (`AGENTIC_INCOME_BLUEPRINT.md`, `product-kit.md`, `service-kit.md`, `system-kit.md`; also `previews/`.) If yes, add them to `MANIFEST.json` with digests. If no, keep them out of the Polar attachment.

## Notes

- `lib/offers.ts:181`, `lib/pack-manifests.ts` and `products/blueprint/00-README.md` still say "60-minute install sequence". That describes the README's own timed plan (Minutes 00–60), not a promised result, and changing it would change a manifest-hashed file. Left as is; flag it if you want it reworded too.
- `lib/offers.ts` and `MANIFEST.json` describe the package as "7-file" / "6 peer deliverables" (6 files plus the manifest). They agree; no change.

## Commands run (this session)

```
pnpm install --frozen-lockfile                       # exit 0
pnpm run merge:gate                                  # exit 0, tests 244 / pass 244 / fail 0
python3 sha256/bytes/lines check vs MANIFEST.json    # 6/6 match, version 3.0.0
curl https://www.agenticincome.ai                    # proxy 403, unverified
pnpm test / lint / type-check / verify:public        # after the wording change: 244/244, 0, 0, passed
node .claude/ci/estate-guard-scan.mjs --root .       # 0 critical, 0 high, 8 medium, 7 low
```
