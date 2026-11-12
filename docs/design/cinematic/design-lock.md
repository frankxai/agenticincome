# Cinematic homepage design lock

Date: 2026-11-12. Surface: `app/page.tsx` plus the motion layer in `components/motion/`.
Source: coordinator design lock written from live Refero research, committed here as the contract the build is checked against.
Founder direction (Frank, 2026-11-12): complete cinematic overhaul, better tech, actual depth in thinking, modern feel, GSAP effects, cards, excellence, images, characters, cinematic scroll, intelligent data built from true things. This outranks the older "one purposeful motion sequence" line in `TASTE.md`. Every honesty rule in `AGENTS.md`, `DESIGN.md`, `TASTE.md` and `STRATEGY.md` still binds in full.

## Foundation, unchanged

The existing `DESIGN.md` lock: Linear changelog obsidian canvas, layered charcoal, weight 500 to 600 headings, pill actions against 8 to 16px containers, mono metadata. Supabase emerald only for verified states, proof, primary actions and active steps. Convex rule: syntax color stays inside terminal and inspector panes.

All existing tokens stay: bg `#05060a`, surface `#0a0c14`, surface-2 `#101522`, border `#1a1f2e`, ink `#f1f3f9`, muted `#8a90a8`, accent `#10b981`, accent-2 `#06b6d4`, gold `#f59e0b`. Geist Sans and Geist Mono.

## Borrowed, cinematic structure

Sui (sui.io, Refero style `ee433c07-9a31-4556-bbe2-f400586f92a9`). Carried as principles:

- The opening is one edge-to-edge dark stage built around a single spatial metaphor with a readable centre.
- A technical spine chapter isolates one concept at a time along a vertical dotted spine with numbered mono captions and outlined mini panels.
- Dotted rules and 12px mono markings recur as structure.
- Chapters get 128 to 210px breathing room.
- Fills establish hierarchy, never soft drop shadows.

Not copied: Sui's blue, its typeface, its square buttons, its tunnel artwork.

## Borrowed, characters

Tapbots (tapbots.com, Refero style `889337e0-2d2c-4980-a9b5-2bca2cb5394d`). Principle only: a small cast of crafted figures on a dark stage gives a tool a personality. Rebuilt in this brand's own language.

## Rejects

Indigo or violet gradients, decorative node clouds, fake dashboards, filler card grids, 3D paperback mockups, stock photos, emoji bullets, ALL CAPS banners, gradient-filled headlines, glass stacks, count-up numbers that hide the real value, any chart or metric that is not read from a repo data file.

## Scenes

1. Opening stage. Full-viewport obsidian stage. The existing h1, sub and two actions stay. The MCP terminal is the staged object: lit, layered, with depth from fills and borders. It settles on load; over the first 60 percent of a viewport of scroll the `fit_check` command types and the real JSON answer resolves line by line. The final text is in the DOM from first paint.
2. The build path, a pinned technical spine (desktop only). Audit, Architect, Implement, Verify, then the human approval gate. Each step holds the viewport briefly with its character plate and one real artifact from this repository, path cited in mono.
3. Three delivery routes as a stacking card deck driven by `data/income-models.json`. Each card shows summary, execution, timeframe and risk boundary. The risk boundary gets the gold signal.
4. Partner economics board. A real semantic table. Rows reveal in order; the commission cell gets a short emerald underline sweep only when the row carries a verification date. Source and verification date come from `lib/affiliate.ts`.
5. Catalog and MCP tools, staged as inspectors: one item in focus at a time on desktop, plain list on mobile. Availability states exactly as honest as before.
6. Close. One calm frame with the existing next-step actions.

## Characters

Five code-native SVG plates in the language of `public/images/products/plate-*.svg` (framed plate, 32px grid, 1.5px strokes, mono marking): Auditor (lens), Architect (compass), Implementer (wrench), Verifier (check seal), Human gate (key). Inline SVG, `currentColor` strokes, one emerald detail each, `aria-hidden`, step name carried by real text. One idle state each, played once on entry, never looped. Five raster slots are declared in `design/asset-manifest.json` with the SVG plate as fallback; no raster image is generated or shipped in this change.

## Motion rules

- Document layer: complete, readable and correctly ordered with JavaScript disabled and under `prefers-reduced-motion: reduce`. Nothing starts hidden in CSS. Pre-animation states are applied by JS inside `gsap.matchMedia`.
- `gsap.matchMedia` with cleanup on unmount. Pinning and stacking only at `min-width: 1024px` and `prefers-reduced-motion: no-preference`; below that, in-view reveals only.
- No scroll hijacking: no smooth-scroll library, no wheel listeners, native scroll speed. Total pinned distance at most about 3.5 viewports. Transform and opacity only. Motion layer lazy-loaded after first paint.
- Every interactive element reachable in DOM order while pinned; `:focus-visible` 2px `#10b981`; 44px touch targets; no focus trap.
- Each motion has a named job in `design/MOTION.md`.

## True data rules

Every number, rate, price, date and status is read from repository data files at build time. Nothing invented, estimated or illustrative. A figure in a new card shows its source or verification date beside it in mono when the data carries one. A missing field renders nothing.

## How the build maps to the lock

| Lock item | Where it lives |
| --- | --- |
| Opening stage, staged terminal | `app/page.tsx` scene 1, `.cine-opening`, `.cine-object` |
| Spatial metaphor | The terminal sits on three sheets named for the files `app/api/mcp/[transport]/route.ts` imports: `data/income-models.json`, `data/programs.json`, `products/catalog.json` |
| Technical spine | `.cine-rail`, `.cine-steps`, pinned by `components/motion/scenes.ts` |
| Character plates | `components/motion/CharacterPlate.tsx` |
| Stacking deck | `.cine-deck`, `.cine-route` |
| Board sweep | `.cine-rate i[data-cine="sweep"]`, rendered only when `commissionVerifiedAt` exists |
| Inspectors | `.cine-inspector`, `.cine-rows[data-cine="inspector"]` |
| Pin budget | `SPINE_PIN = 1.6` plus `DECK_PIN = 1.2` viewports, 2.8 total |

## Depth layer, 2026-11-12

Founder direction (Frank, 2026-11-12, after seeing wave 1): do more and better, improve all layers and fundamentals, use shader gradients, liquid glass, three.js. This outranks two older lines for the homepage only: "glass stacks" in the rejects above, and the `TASTE.md` cut on 3D (which already allowed 3D with a product metaphor, fallback, provenance and performance budget; all four are below). Every honesty rule still binds. Dependency approved by that direction: `three` (runtime) and `@types/three` (dev). Nothing else was added.

Every effect has a job. An effect with no job is cut.

### 1. Signal field (shader gradient)

A fragment shader behind scene 1 (opening) and scene 6 (close). Slow domain-warped noise in the brand palette only: obsidian `#05060a` base, emerald `#10b981` and cyan `#06b6d4` as light inside the dark, and a trace of gold `#f59e0b` in the close, where the human gate is. It reads as light moving through smoke. No purple, no rainbow, no mesh gradient.

Job: it is the signal the page keeps talking about. Flow speed and brightness follow scroll progress, and it brightens once, the first time the `fit_check` answer resolves. It flows only while the reader scrolls or moves the mouse, and settles to a still frame about 3.5 seconds after the last input, so nothing plays on its own for longer than five seconds. The light is held back on the text side of the opening so copy keeps its contrast.

Field presence, 2026-11-12 (coordinator review of the first frames: the field read as a rendering artifact, not as light). The field now has two layers: a far layer of broad, soft cyan masses and a near layer of long emerald ribbons with bright folds. They drift at different speeds (the near layer about three times as fast) and take scroll and the pointer at different rates, which is the depth. It fills the stage behind and around the terminal. It is strongest away from anything that is read and falls to near black under text: the stage holds the light back under the hero copy, the opening foot, the nav and the terminal, and in the close under the kicker, the chapter mark and the second action. Palette is unchanged: obsidian, emerald, cyan, gold only in the close.

The one-shot signal: the first time the `fit_check` answer resolves, the field lifts for about 2.6 seconds and a ring of light leaves the terminal. It leaves as the first line of the answer reaches full strength, because at 1440 by 900 the last line lands with the terminal already mostly off the top of the screen; the last-line event from `scenes.ts` remains as the fallback trigger. Once per page load.

The close is the last frame: as it arrives the field draws in around the two actions, and one thin gold edge runs under that row. Stated plainly: the close's copy does not name the human gate (the page names it in the headline and in the doctrine line "Humans hold the gate."), and copy is out of scope, so the gold edge sits under the row where the reader makes their own decision.

Deviation, stated plainly: the field is also drawn, confined to their own footprint, under the route deck and under the inspector lists. Glass with nothing behind it has nothing to bend, so those two surfaces needed it. It never sits behind body copy there: the deck is covered by its cards, and every inspector row except the one in focus is opaque.

### 2. Artifact stage (three.js)

The three flat CSS sheets behind the hero terminal become geometry: three thin slabs with bevelled edges, lit by one key light and one emerald rim (plus a low fill so unlit faces are not pure black). Each carries its real file name, read from the DOM label it replaces, and prints values read from that file (only fields this page already publishes; internal notes and link fields never reach the page). Scrolling through scene 1 fans the stack about the terminal's lower left corner and drifts the camera a few degrees; a mouse pointer parallaxes it slightly. The terminal stays real HTML on top.

In scene 2 each of the five steps gets one lit instrument built from primitive geometry and two shared materials: lens, compass, wrench, check seal, key. It turns a quarter turn as its step takes focus.

Founder decision needed: in the WebGL state the lit instrument stands inside the plate frame and the SVG character bust steps aside. The busts remain in every other state (no JavaScript, reduced motion, no WebGL, below 1024px). If the busts should stay beside the instruments, that is a layout change to the plate, not done here.

### 3. Liquid glass

Four surfaces only: the site nav, the terminal chrome, the route cards, and the inspector row in focus. Layered: tint, `backdrop-filter` blur and saturation as the base; an SVG `feDisplacementMap` refraction where the browser applies SVG filters inside `backdrop-filter` (Chromium, desktop width); a 1px specular rim; an inner highlight that follows a mouse pointer. Anywhere refraction is not supported the glass is frosted. No glass on body copy panels or tables. The terminal's bar is the clear part of the pane; its body is a dense tint so the tool call reads as before. Over the live field a route card is built the same way: a clear bevel about 15px wide with a bright specular rim, where the field behind bends and stays vivid, around a dense plate that carries every word. Without the live field the route card keeps its even frosted tint.

### Fallbacks

| State | What the reader gets |
| --- | --- |
| No JavaScript | Static CSS poster in the same palette, CSS sheets, SVG plates, frosted glass |
| `prefers-reduced-motion: reduce` | Same as no JavaScript |
| Below 1024px | Same, by measurement (see `depth-critique.md`) |
| No WebGL2, software renderer, `saveData`, fewer than 4 logical cores | Same, with wave 1 motion |
| Context lost | Poster and plates return; the layer resumes if the context is restored |

### Engineering contract

- One canvas, one WebGL context, one frame callback on GSAP's ticker (no second requestAnimationFrame loop). Paused by IntersectionObserver when no scene is on screen and on `visibilitychange`. Device pixel ratio capped at 1.5. Geometries, materials, textures, the render target and the renderer are disposed on unmount.
- GSAP is the only scroll clock. ScrollTrigger callbacks inside `gsap.matchMedia` write progress into `components/motion/depth/state.ts`; the stage reads it. There is no scroll listener in the depth layer.
- three is imported by named imports in `depth/stage.ts` only, which is its own lazy chunk, requested after first paint and only on a device that passes the gate.
- The CSP in `vercel.json` is unchanged. No CDN, no external texture, no eval, no worker.

### Rejects

Purple or indigo, rainbow mesh, particle node clouds, floating orbs, fake dashboards, bloom that washes out text, anything that hides or delays content.

### How the build maps to this addendum

| Item | Where it lives |
| --- | --- |
| Capability gate, canvas creation, glass detection | `components/motion/depth/mount.ts` |
| Renderer, field, slabs, instruments, lifecycle | `components/motion/depth/stage.ts` |
| GLSL | `components/motion/depth/shaders.ts` |
| Instrument geometry | `components/motion/depth/instruments.ts` |
| Poster, glass, hand-off rules | `components/motion/depth/depth.css` |
| Refraction filter | `components/motion/depth/GlassDefs.tsx` |
| Scroll state | `components/motion/depth/state.ts`, written by `components/motion/scenes.ts` |
