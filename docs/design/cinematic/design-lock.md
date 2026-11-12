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
