# Homepage waitlist and glass nav (WEB-01b)

Tracker: frankxai/product-plans#66. Standard: `plans/web-factory/WEB-FACTORY.md` (branch `agent/claude/web-factory-standard`).

## A. Capture (shipped)

- `lib/demand-capture/` is the shared package source, copied unchanged. `PROVENANCE.md` names repo, path, commit and checksums.
  The package is not on starlight-command `main` yet; the copy comes from commit `a3d35b97` on `agent/claude/workers-ai-harness`.
- `data/waitlist-products.json` is the single `agentic-income` row from the estate registry (`graph/products.graph.json`). No product was invented.
- `app/api/waitlist/route.ts`: `GET ?productId=` reports state, `POST` joins. Same-origin, JSON-only, bounded body and rate-limited like `/api/subscribe`.
  Unknown product 404. No KV env: state answers `open:false`, join answers 503. Store failure: 503, address never echoed or logged.
  The raw count and founding-seat arithmetic that the shared handler returns never leave the server; only the threshold-gated `publicCount` does.
- `components/HomeWaitlist.tsx`, placed after `<AgentWorkflowProof />` on the homepage. It asks the server whether the list is open
  and treats any failure to answer as closed. Success is an inline confirmation with one next step (the fit check at `/start`).
- Not done on purpose: no founding benefit is passed to the form (terms are Frank's call), no analytics event, no change to `/api/subscribe`
  or `EmailCapture`.

Follow-up, not in this PR: migrate `/offers/*` and `/start` from `EmailCapture` + `/api/subscribe` to the shared waitlist, then delete both.

## B. Glass nav (CSS only, no new dependency)

`liquid-gl@3.0.0` (MIT) was evaluated and not added.

| Check | Result |
| --- | --- |
| Lazy chunk budget, 150 KB minified | `liquidGL.js` is 297,144 bytes raw; esbuild 0.25.0 `--minify` gives 167,480 bytes (47,073 gzip). Over budget. |
| CSP in `vercel.json` | The library always builds a `blob:` module `Worker` when `OffscreenCanvas` exists. The CSP has no `worker-src`, so `script-src 'self' 'unsafe-inline'` applies. Chromium: `Creating a worker from 'blob:…' violates … "script-src 'self' 'unsafe-inline'" … The action has been blocked.` Allowing it means editing the CSP. |

Both gates fail, so the brief says to ship the CSS fallback only. The homepage nav already carries that treatment
(`components/motion/depth/depth.css`: tint, `backdrop-filter` blur and saturation, specular rim, SVG refraction where supported, static
under reduced motion), over the real hero film, which satisfies "only where there is real imagery". Other pages have no imagery under the nav and keep the plain `.glass` bar.
No nav code changed in this PR.

## Screens

`screens/` at 390x844 and 1440x900. Headless Chromium through Playwright against `pnpm start` with no KV env.

- `capture-closed-*`: real, no mocking (server answers `open:false`).
- `capture-idle-*`, `capture-error-*`, `capture-confirmed-*`: the state request and the join request are intercepted by Playwright
  (idle: open; error: join returns 503; confirmed: join returns a position, then "Skip"). No store was involved.
- `nav-default-*`, `nav-no-webgl-*`: default Chromium and Chromium with `--disable-webgl --disable-webgl2 --disable-3d-apis`.
  This container has no GPU, so the default launch is a software renderer and the page's own gate (`canRunDepth`) already
  withholds the live WebGL depth layer there. The GPU-backed WebGL nav state could not be captured and is unverified.
