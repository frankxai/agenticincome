# Agentic Income Motion System

## Motion Thesis

Motion should make compounding visible. It should show attention moving through comparison, recurring tools, owned audience, and direct products.

## Personality

- Precise.
- Quiet.
- Directional.
- Causal.
- Trust-building.

## Tokens

```text
duration.micro: 120ms
duration.fast: 180ms
duration.base: 260ms
duration.slow: 420ms
duration.signature: 900ms
stagger.tight: 28ms
stagger.base: 56ms
distance.micro: 3px
distance.base: 12px
distance.large: 32px
easing.standard: power3.out
easing.signature: power2.inOut
```

## Runtime

- CSS for hover, focus, and small state changes.
- GSAP for the signature flow trace and measured reveal choreography.
- No pinning, vortexes, spinning, or long parallax.

## Reduced Motion

When `prefers-reduced-motion` is active:

- Disable the flow trace animation.
- Disable scroll reveal choreography.
- Keep the static diagram, proof, and CTAs visible.
- Preserve all meaning without motion.

## QA

- Motion has a named job.
- Text remains stable and readable.
- No layout shift.
- Desktop and mobile both preserve the first-read hierarchy.

## Cinematic homepage, 2026-11-12

Direction: Frank, 2026-11-12. Contract: `docs/design/cinematic/design-lock.md`. Code: `components/motion/scenes.ts`, loaded lazily by `components/motion/CinematicMotion.tsx` after first paint. This section supersedes "No pinning" in Runtime above for the homepage only; vortexes, spinning, long parallax, smooth-scroll libraries, wheel listeners and scroll snapping stay out.

### Layers

- Document layer: `app/page.tsx` plus `components/motion/cinematic.css`. Complete and correctly ordered with JavaScript off and under `prefers-reduced-motion: reduce`. No CSS rule hides content.
- Motion layer: everything below. Each pre-animation state is set by JavaScript inside `gsap.matchMedia`, and reverted on unmount.
- Conditions: any motion needs `(prefers-reduced-motion: no-preference)`. Pinning, stacking, sheet drift and inspector focus also need `(min-width: 1024px) and (min-height: 700px)`.

### Named jobs

| Motion | Job | Trigger | Properties | Where |
| --- | --- | --- | --- | --- |
| Terminal settle | Arrival: the staged object lands once so the eye finds the centre of the stage | Load, only near the top of the page | y, scale | All widths |
| Tool call typing | Cause and effect: the command is asked, then the real answer resolves line by line. Untyped text stays legible as ghost text at 34 percent opacity | Scroll, first 60 percent of a viewport, scrubbed | opacity, y | All widths |
| Source sheet drift | Depth: the three source files behind the terminal separate slightly as the stage leaves | Scroll through the opening, scrubbed | y | Desktop |
| Build path focus | One concept at a time: the step that owns this part of the scroll takes the stage | Pinned for 1.6 viewports; step changes at fifths of the pin | opacity, y | Desktop |
| Spine progress | Orientation: how far along the path the reader is | Same pin, scrubbed | scaleY | Desktop |
| Character idle | Personality, once: lens glint, compass swing, wrench turn, seal press, key offer, plus one blink | First time a step takes the stage (desktop) or enters view (below desktop). Never loops | opacity, x, y, rotation, scale | All widths |
| Route deck | Comparison in sequence: each route holds the stage, then is filed under the next | Pinned for 1.2 viewports, scrubbed | y, scale | Desktop |
| Board rows | The table is read as a list of checked facts, top to bottom | In view, once | opacity | All widths |
| Verification sweep | Marks a commission cell whose row carries `commissionVerifiedAt`. Rows without a date render no sweep element | With its row, once | scaleX | All widths |
| Inspector focus | One item at a time: the row on the reading line is lit, the rest sit at 62 percent. Hover and keyboard focus always restore a row | Scroll position of the list, no pin | opacity, background-color (CSS, 180ms) | Desktop |
| Chapter reveal | Pacing: a heading or panel arrives as the reader reaches it | In view, once, only for elements below the fold at load | opacity, y | All widths |

### Budget

- Pinned distance: 1.6 (build path) plus 1.2 (route deck) viewports, 2.8 in total, under the 3.5 ceiling.
- Native scroll speed throughout. No snapping.
- Step panels and route cards hold no links or controls, so nothing focusable is ever covered or faded. Faded steps use opacity, not visibility, and stay in the accessibility tree.

