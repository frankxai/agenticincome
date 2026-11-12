# Depth layer critique

Date: 2026-11-12. Author: Claude (Anthropic). Checked against `docs/design/cinematic/design-lock.md`, "Depth layer, 2026-11-12".

Each frame is judged on three questions: does the effect do its stated job, is any text harder to read than in wave 1, and would a design director call this generic AI gradient work.

## How the frames were made, and what that limits

- Playwright Chromium against the production build (`next build`, `next start`), with the `Content-Security-Policy` value from `vercel.json` added to the document response. No CSP violation was logged in any run. The only console errors are the two 404s for `/_vercel/` scripts that exist only on the hosting platform, the same as wave 1.
- This machine has no GPU. Chromium gives WebGL2 through SwiftShader (software) with default flags, with `--use-angle=swiftshader`, and with `--enable-unsafe-swiftshader`; the renderer string is `ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero) (0x0000C0DE)), SwiftShader driver)` in all three. Default flags were used.
- The shipped layer refuses a software renderer and keeps the poster. To see the layer at all, the capture harness hides the renderer string from the capability probe (one `getParameter` override in the test script). Nothing in the shipped code is switched. So every WebGL frame below is the real code drawn by a software rasteriser: the pixels were seen, the speed was not representative.
- Not seen: any hardware GPU, Safari, Firefox, any phone or tablet, any screen reader. The quarter turn, the fan, the pulse and the pointer highlight were seen only as still frames at rest or mid-scroll, never in motion.
- Every committed image in `docs/design/cinematic/screens/depth/` was opened. The four full-page captures were viewed scaled down to fit, so they confirm structure and completeness, not fine detail.

## Round 1

Rendered: opening at rest and mid-scroll, five build path steps, route deck, inspector, close, 390 top, reduced motion, no JavaScript, WebGL disabled.

| # | Defect seen | Question it fails | Fix | Result on re-render |
| --- | --- | --- | --- | --- |
| 1 | The canvas rendered (its pixels could be read back) but nothing showed on the page. The site paints an opaque fill on both `html` and `body`, and a body fill covers anything at a negative z-index. | Job | While the layer is live the body fill steps aside; `html` paints the same obsidian. | Field and slabs visible. |
| 2 | Field and slabs were nearly black. Light intensities were set as if three still multiplied by pi; the slab face came out around 12 of 255. | Job | Key light became a point light with physical falloff, so a flat face carries a gradient; albedo and intensities reset. | Slabs read as lit graphite with an emerald rim on the bevels. |
| 3 | First lit slabs were a flat periwinkle grey. Next to the emerald it read as a cool purple. | Generic, and the purple reject | Darker, neutral albedo `#1f2630`. | No purple cast in `opening-1440-rest.png`. |
| 4 | The fan rotated each slab about its own centre and tilted it; mid-scroll the stack looked like tall panels sliding off to the right and the file names slid under the slab above. | Job | Slabs swing about the terminal's lower left corner like a hand of cards, with a small lift, so the name strips widen as they open. | `opening-1440-fanned.png`: two names fully legible, the third leaving the top of the viewport. |
| 5 | Emerald light sat behind the hero paragraph mid-scroll. | Text | The quiet side of the field was widened to cover the whole text column. | Hero paragraph worst case 6.01:1 (below). |
| 6 | Route deck: the filed card's text smeared through the glass card on top as dark blotches behind the heading. | Text | A filed card's contents fade as it is covered. Wave 1 hid them behind an opaque card, so nothing readable is lost. | `routes-1440-deck.png`: clean card, top edge of the filed card still visible. |
| 7 | Route deck: the field was feathered outside the deck and read as a green drop shadow around the card. | Generic | Field confined to the deck's footprint. | Glow gone. |
| 8 | Inspector: wave 1 dims rows with row opacity, which made every row see-through over the field. | Text | In the live state the dimming moves to the row's contents; the row keeps a solid fill. Only the row in focus is glass. | `inspector-1440-focus.png`. |
| 9 | Close: gold mixed with emerald into a murky olive patch on the left. | Generic | Gold only where emerald is low, at half weight. | `close-1440.png`: emerald and cyan, gold not separately identifiable in this frame (see below). |
| 10 | Compass hinge was an oversized green blob. | Generic | Smaller hinge. | `build-path-1440-02-compass.png`. |

## Round 2

Re-rendered everything, then measured contrast and timing.

| # | Defect seen | Question it fails | Fix | Result on re-render |
| --- | --- | --- | --- | --- |
| 11 | Initial JavaScript grew by 583 bytes gzip. Same code: importing gsap in the WebGL chunk made the bundler split an existing shared chunk in two. | Budget (zero bytes before first paint) | The stage takes GSAP's ticker as an argument instead of importing gsap. | Initial scripts 188,704 to 188,703 bytes gzip. |
| 12 | Under software WebGL every frame took 80 to 100 ms, and every frame was a long task. The layer's own script time was 0.7 ms a frame; the rest was the rasteriser. | Budget (long tasks) | The capability gate now refuses a software renderer, by `failIfMajorPerformanceCaveat` and by renderer name (headless Chromium does not flag SwiftShader as a caveat). | On this machine with default settings the layer does not start and the page keeps its poster. |
| 13 | A refracted and a frosted capture of the terminal were identical. The filter works (checked on a standalone grid page), but everything behind the terminal was a featureless slab face, and the body tint let almost nothing through. | Job (glass) | Slab faces print values read from their file. The terminal bar became the clear part of the pane; the body kept a dense tint. Refraction blur on the terminal dropped to 3px. | `glass-terminal-refract.png` against `glass-terminal-frosted.png`: bent, smeared lines behind the body and a distorted slab edge at the left of the bar. It is subtle. |
| 14 | First version of the slab text printed the raw head of each JSON file. Those files open with internal notes, and `data/programs.json` carries link fields. | Honesty rules | The page builds the lines from fields it already publishes (ids, names, commission, verification date, updated date). | Verified in the rendered HTML attribute. |
| 15 | Terminal bar label measured 4.17:1 once the bar was made clearer. | Text | Bar tint raised from 36 to 58 percent. | 4.77:1 worst case. |
| 16 | Full-page captures at 390 and with WebGL disabled showed empty sections: the in-view reveals had not fired. | Proof | The harness scrolls the page once before a full-page capture. | Both complete. |

## Frame by frame

| Frame | Does the effect do its job | Text against wave 1 | Generic AI gradient work? |
| --- | --- | --- | --- |
| `opening-1440-rest.png` | Slabs yes: three lit objects with real names. Field: present on the right, quiet at rest; a reader may not notice it until they scroll. | Hero copy unchanged in practice (6.33:1 against 6.29:1 on the poster). Terminal output 5.86:1. | The slabs argue against it. The field alone, as a still, is a dark green smoke texture and could be from many sites. |
| `opening-1440-fanned.png` | Fan and stronger field both visible. Slab text fragments at the right edge (`even`, `vice"`, `Kits"`) are truncated by the slab in front and read as clutter. | Same. | As above. |
| `build-path-1440-01` to `05` | Yes. Each instrument reads at a glance and sits on the plate's grid. The wrench jaw is the weakest shape. The turn itself was not seen. | Unchanged: the text panel keeps its fill. | No. These are objects, not gradients. They are also plain primitives, which a director may call toy-like. |
| `routes-1440-first.png`, `routes-1440-deck.png` | Field shows through the first card clearly, through the second faintly. Refraction is not identifiable in either frame: smoke has no edges to bend. | Lower than wave 1 but passing: 4.77:1 against 6.25:1. | Borderline. A dark card with a green glow behind it is a common look. |
| `inspector-1440-focus.png` | Weak. A faint green trace in the focused row. Without being told, a reader would not see glass here. | 4.96:1. | Not generic, because it is barely there. |
| `close-1440.png` | Field yes. The trace of gold is not visible as gold in this frame. | Kicker 5.89:1, chapter mark 5.51:1. | The most generic frame: text and buttons on a green smoke band. |
| `glass-terminal-refract.png`, `-frosted.png` | Difference is real and small. | Bar label 4.77:1. | Not applicable. |
| `home-390.png`, `home-390-top.png` | Poster only, by design. | Unchanged. | No. |
| `home-1440-reduced-motion.png`, `home-1440-no-js.png` | Poster, sheets, busts. Same 11,095px document as wave 1. | Unchanged. | No. |
| `home-1440-no-webgl.png`, `-top.png` | Poster and CSS sheets with wave 1 motion. The pinned scenes show one step and overlapping cards because a full-page capture cannot scroll a pin. | Unchanged. | No. |

## Honest summary

- The artifact stage and the instruments are the part of this wave that does its job plainly.
- The signal field is correct to its brief (low contrast, brand palette, driven by scroll) and for that reason is easy to miss at rest. Raising it is limited by the contrast floor on the text that sits over it.
- Liquid glass is the weakest of the three. The refraction is implemented and verified to work, but with AA contrast held on the text, the only place it is clearly visible is the terminal bar and edge. The brief asks that the field and slabs "visibly bend" through all four surfaces. That is met on the terminal, and not met in any frame for the nav, the route cards or the inspector row. Making it obvious there needs either brighter content behind the glass or a lower contrast floor, and both are founder calls.
- The gold trace exists in the shader and is not distinguishable in the close frame.

## Measurements

All on the production build, Chromium, 1440 by 900, one run each unless stated.

JavaScript, gzip level 9, homepage load plus a full scroll:

| | Wave 1 | This branch, layer declined (this machine) | This branch, layer running (forced) |
| --- | --- | --- | --- |
| Scripts in the HTML (before first paint) | 188,704 | 188,703 | 188,703 |
| Lazy scripts | 35,524 | 36,771 | 180,213 |
| Of which the three chunk | none | not requested | 144,465 |

Added before first paint: 0 bytes of script. Added lazily: 1,247 bytes where the layer does not start, 144,689 bytes where it does (budget 190 KB). Also added to the first response: 861 bytes of HTML (22,678 against 21,817) and 883 bytes of CSS (21,940 against 21,057), both gzip.

Layout shift, load plus full scroll: 0 in wave 1, 0 with the layer declined, 0 with the layer running.

Long tasks over 50 ms after the load event:

- Wave 1: 1 (62 ms).
- This branch, default settings on this machine (layer declined): 1 (69 ms). The same single task appears with WebGL disabled entirely (61 ms), so it is not the depth layer; the difference from wave 1 was not repeated enough to call it noise or real.
- This branch, layer forced onto the software rasteriser: 209, one per frame, longest 385 ms (the first frame, which includes shader compilation). Script time inside the layer's frame callback: 0.7 to 1.3 ms (development build). This is why software renderers are refused.

Frame time over a 5 second full-page scroll:

- Layer declined: 300 frames, mean 16.7 ms, none over 50 ms.
- Layer forced on software: 43 frames, mean 117 ms. Not representative of a GPU.
- On a hardware GPU: not measured. No number is claimed.

Mobile choice, 390 by 844 with 4x CPU throttle: the full layer forced on averaged 34.6 ms a frame while scrolling with 5 long tasks; the poster averaged 16.7 ms with none. Below 1024px the page uses the static poster. This was measured on a software rasteriser, so it shows the direction, not what a phone GPU would do.

Contrast (WCAG ratio, text colour against the brightest pixel anywhere behind that text, text hidden for the capture; 6 samples over time at rest, more while scrolling through the pulse):

| Text | Layer running | Poster |
| --- | --- | --- |
| Headline | 17.12 | 17.52 |
| Hero paragraph | 6.01 | 6.29 |
| Hero kicker | 7.54 | 7.98 |
| Opening foot | 6.19 | 5.99 |
| Nav link | 4.73 | 6.29 |
| Terminal output line | 5.86 | 6.28 |
| Terminal bar label | 4.77 | 5.95 |
| Route card summary | 4.77 | 6.25 |
| Route card field | 4.81 | 6.25 |
| Route card source line | 4.80 | 6.25 |
| Inspector row in focus | 4.96 | not glass |
| Close kicker | 5.89 | 7.60 |
| Close chapter mark | 5.51 | 6.34 |

Lowest measured: 4.73:1 (nav link over the field). Every sampled value is at or above AA for normal text. Text on glass is measurably lower than in wave 1, and the margin above 4.5 is thin on five rows. The field moves, so a small number of samples cannot prove the floor for every frame. The terminal's ghost text (34 percent opacity until typed) is wave 1 behaviour and was not measured.

Context loss: forcing `WEBGL_lose_context` returned the page to the poster and the CSS sheets; restoring it brought the layer back, confirmed by screenshot. Switching to reduced motion removed the canvas; switching back created it again.

## Known limits

- No runtime frame-rate governor. A real but slow GPU keeps the layer; only software renderers, small core counts, `saveData`, narrow screens and reduced motion fall back.
- The capability probe opens a throwaway WebGL2 context and releases it before the real one is created, so two contexts exist briefly in sequence, never at once.
- The canvas is fixed to the viewport and repositions its views each frame from element rectangles. If the main thread falls behind during a fast scroll, slabs and instruments can trail the DOM by a frame. Not observed in stills; not testable here in motion.
- Refraction is detected by `navigator.userAgentData` (Chromium only). Safari and Firefox get frosted glass. Neither was run.
- `design/PAGE_SPEC.md`, `design/SCENE_BRIEF.md` and `design/design-loop-evidence.json` (named in `AGENTS.md`) were not updated; this file and the design lock addendum carry the evidence for this change.
- The `review-animations` skill was not run. The mechanical lint was: 5 UI files, 0 errors, 0 warnings.

## Round 3, Web Interface Guidelines audit

The live rules were fetched from `vercel-labs/web-interface-guidelines` (`command.md`) on 2026-11-12 and read against `app/page.tsx`, `components/motion/scenes.ts`, `components/motion/CharacterPlate.tsx` and everything in `components/motion/depth/`. Three findings.

| # | Finding | Rule | Outcome |
| --- | --- | --- | --- |
| 1 | `components/motion/depth/stage.ts`: the field flowed for as long as a scene was on screen, with no way to pause it short of the system reduced-motion setting. | Autoplay motion over 5 seconds alongside other content needs pause, stop or hide controls | Fixed. The flow now follows input: scrolling or moving the mouse keeps it going, and it eases to a still frame about 3.5 seconds after the last input. The one-shot pulse (1.8 seconds) is unchanged. Verified by type-check, lint, tests and build only; this machine declines the layer, so the settle was not seen in a frame. |
| 2 | `components/motion/depth/mount.ts`: the pointer highlight read an element rectangle and wrote its style inside the same loop. | Batch DOM reads and writes | Fixed. All rectangles are read first, then styles are written. |
| 3 | `components/motion/depth/stage.ts`: slabs and instrument views are sized from element rectangles each frame. | Flex or grid over JS measurement for layout | Waived. Nothing in the document is laid out by script; the measurements only place drawing inside the canvas, which has no layout of its own. |

Everything else passed: the canvas, the filter definitions and both bleed layers are `aria-hidden`; no interactive element, focus style, form, image or copy was added; every new transition names its property and sits inside a `prefers-reduced-motion: no-preference` query; only opacity and transform are animated in the document; truncated excerpt lines end in a real ellipsis character.

Captures added in this round, layer declined (the state this machine and any device without a suitable GPU gets): `home-375.png`, `home-768.png` in `docs/design/cinematic/screens/depth/`. Wave 1 captures at the same widths are `docs/design/cinematic/screens/home-375.png` and `home-768.png`.

## Round 3, field presence

Date: 2026-11-12. Coordinator review of the committed frames found three shortfalls: the signal field read as a rendering artifact, the close was generic with no visible gold, and the route card glass could not be told from the wave 1 flat card. Scope of this round: `components/motion/depth/**` and the design docs. No copy, dependency, CSP, offer, checkout, catalog or data change.

### Method

Same as rounds 1 and 2. Playwright Chromium against the production build (`next build`, `next start`), 1440 by 900, with the `Content-Security-Policy` value from `vercel.json` added to the document response. No CSP violation was logged; the only console errors are the two `/_vercel/` 404s. The machine has no GPU, so the harness hides the software renderer's name from the capability probe (one `getParameter` override in the test script) and the shipped code is drawn by SwiftShader. The pixels were seen. Motion was not: every frame took over 100 ms, so flow speed, the two layers moving against each other, the ring travelling and the gather were judged from stills only. Live frames are at device scale factor 2; the two full-page fallback frames are at 1 so they can be compared pixel for pixel with the earlier ones. The harness scrolls in steps with `window.scrollTo` and moves the mouse, so the field counts the reader as active. Every `field-` image was opened.

### What changed

| # | Before | Change | After |
| --- | --- | --- | --- |
| 1 | One noise layer, low level, held back across the whole left half. In `opening-1440-fanned.png` a faint smudge at the right edge. | Two layers in the shader: far, broad, soft, cyan, slow; near, long emerald ribbons with bright folds, about three times as fast, taking more of the scroll (0.62 against 0.25) and of the pointer. Level raised. The single left-side hold became up to four boxes read from the DOM each frame (hero copy, opening foot, nav, terminal), each with its own strength and falloff, so the light fills the stage behind and around the terminal and stops short of what is read. | `field-opening-1440-rest.png`, `field-opening-1440-fanned.png` |
| 2 | Pulse: level plus 0.5 for 1.8 seconds, fired when the last answer line landed. At 1440 by 900 that is about 600px of scroll, with the terminal two thirds off the top of the screen. | The stage runs its own 2.6 second envelope: the field lifts (level plus 0.75, fast attack) and a ring of light leaves the terminal's centre. It fires when the first line of the answer reaches full strength (about 405px of scroll, terminal body still on screen), read from that line's inline opacity; the last-line event from `scenes.ts` stays as the fallback. Once per page load. | `field-opening-1440-resolve.png` |
| 3 | Close: even field at low level; gold mixed into the noise at half weight and not visible. | The field gathers: a pool centred on the two actions (the rest of the region falls to a fifth), and the field's structure is sampled further out while the scene arrives, so it draws inward. Gold left the noise and became one line: 1.5px, warm, under the actions row, fading at both ends, with a faint glow beneath. Holds under the kicker, the chapter mark's words and the second action (a clear pill with white text). | `field-close-1440.png` |
| 4 | Route card: even 72 percent tint, 1px rim at 13 percent white. | Live state only: the card is a clear pane (14 percent tint, 7px blur under the refraction filter) with a rim at 42 percent white on top and a soft inner highlight, around a dense plate (94 percent) inset 15px that carries all the text. Field under the deck raised from 1.25 to 1.7. | `field-routes-1440-deck.png` |
| 5 | Inspector row in focus: 46 percent tint, pointer highlight 8.5 percent white. | Not asked for, forced by the brighter field: with the mouse over the focused row the description measured 3.84:1. Field under the inspectors lowered (1.5 to 0.2 of a brighter field), row tint raised to 56 percent, pointer highlight on that row lowered to 4.5 percent. | 4.93:1 worst case. No new frame; the inspector glass is no stronger than before. |

Defects found and fixed inside this round, each seen in a render: the first pass was teal, not emerald (cyan weight cut, emerald raised); the close's holds showed as hard-edged black rectangles, one of them the full width of the page because the chapter mark's box includes its dotted rule (holds now take the words only, and the button hold is pill-shaped with a soft edge); the close's second action measured 2.23:1 with the pool directly under it (hold added, pool peak lowered).

### Frame by frame

| Frame | Before | Verdict |
| --- | --- | --- |
| `field-opening-1440-rest.png` | `opening-1440-rest.png` | The field is now plainly there: emerald light with diagonal structure across the right half of the stage, above, beside and below the terminal, dark under the copy. It reads as this brand. Weak points: the folds are soft, so as a still it is closer to an aurora than to light with edges; the far cyan layer shows only as a teal cast at the top right, and nobody could tell there are two layers from this frame. Depth depends on motion, which was not seen. |
| `field-opening-1440-fanned.png` | `opening-1440-fanned.png` | Clear improvement on the smudge. The light now frames the fanned slabs. The right edge is a large, fairly even bright area and is the place a director would most likely call a gradient wash. The truncated slab text fragments from round 2 are still there. |
| `field-opening-1440-resolve.png` | none | Noticeably brighter than the fanned frame, with streaks across the stage below the terminal: the moment registers. The ring cannot be picked out as a ring in the still; it reads as a general lift. At this scroll position the terminal's bar is already off the top of the screen, which is the wave 1 scroll mapping and outside this round's scope. |
| `field-routes-1440-deck.png` | `routes-1440-deck.png` | The glass now reads at a glance: a bright bevel around a dark plate, text sharp. Honest limit: it reads as a lit edge more than as refraction. The bend is visible as an uneven, wavering band of light along the left and bottom edges, but there is nothing straight behind the card to compare it with. The top edge has no light in this frame because the field happens to be dark there. The frame is mid-slide, so the heading is partly faded by the wave 1 deck animation. |
| `field-close-1440.png` | `close-1440.png` | Second attempt (the first had the hard rectangles). It is now a composed frame: light collects on the right around the two actions, the left stays dark, and the gold edge is the one warm thing on screen and is easy to see. It no longer looks like an even green band. Still open: the dark halo around the second action is visible as a halo; the left 40 percent of the frame is empty; and the gold edge does not sit beside words that name the human gate, because the close has none (see below). I would not call it generic now, but it is the frame I am least sure of. |
| `field-home-1440-reduced-motion.png` | `home-1440-reduced-motion.png` | Unchanged. Same 11,095px document, no canvas. Pixel comparison with the earlier frame: 483 of 15.98 million pixels differ by more than 2 levels (largest 10), all in rows 352 to 387, the terminal bar. Likely the pointer highlight, since this harness leaves the mouse near the terminal; not verified. |
| `field-home-1440-no-webgl.png`, `-top.png` | `home-1440-no-webgl.png`, `-top.png` | Unchanged. Same 12,857px document, no canvas. 563 pixels differ (rows 352 to 605, largest 58: the same bar pixels plus the blinking caret). |

### Stated plainly

- The brief says the gold enters "where the human gate is named". The close's copy does not name it. The page names it in the headline and in the doctrine line "Humans hold the gate.", neither of which is in the close, and copy is out of scope. The gold edge sits under the row where the reader takes their own decision. If it should sit by words, that needs a line of copy in the close: a founder call.
- The signal now fires on the first answer line, not the last. That is a change of timing made inside `depth/stage.ts` because `scenes.ts` was out of scope. If the last line is the right moment, the scroll mapping in `scenes.ts` needs to keep the terminal on screen until then.
- Refraction on the route cards is readable as glass, not provably as refraction. Making the bend itself obvious needs straight detail behind the card.
- The field costs more per pixel than before: 26 noise lookups per half-resolution pixel against 20, plus a four-box loop in the composite. Not measured on a GPU; no frame-rate number is claimed. The gates are unchanged: one lazy chunk, one context, paused off screen, device pixel ratio capped at 1.5, settles 3.5 seconds after the last input.
- The lazy WebGL chunk is 145,756 bytes gzip against 144,465 before (budget 190 KB). Scripts before first paint were not re-measured; nothing outside the lazy chunk and one stylesheet changed.
- The `review-animations` skill and the live Web Interface Guidelines fetch were not re-run this round. The mechanical lint was: 0 errors, 0 warnings. No interactive element, focus style or copy changed; the new CSS adds no transition.

### Contrast, measured

Text colour against the brightest pixel anywhere behind that text, text hidden for the capture, production build, 1440 by 900. 2,184 text boxes over a series of captures: opening at rest (3), scrolling (3), 16 back to back through the signal, 8 after it, both inspectors every 90px, the route deck at 6 positions, the close at 5. The mouse was moving throughout, so pointer highlights are included.

| Text | Round 2 | Now, worst case |
| --- | --- | --- |
| Headline | 17.12 | 17.82 |
| Hero paragraph | 6.01 | 6.22 (during the signal) |
| Hero kicker | 7.54 | 7.80 |
| Opening foot | 6.19 | 6.29 (during the signal) |
| Nav link | 4.73 | 5.91 |
| Terminal output line | 5.86 | 5.90 |
| Terminal bar label | 4.77 | 4.76 |
| Route card text | 4.77 | 4.90 |
| Inspector row in focus | 4.96 | 4.93 |
| Close kicker | 5.89 | 7.83 |
| Close chapter mark | 5.51 | 6.19 |
| Close second action | not measured | 16.01 |

Worst case overall: 4.76:1, the terminal bar label, the same surface and near enough the same figure as round 2 (the bar's own tint, not the field). Nothing sampled is below 4.5:1. The field moves, so this is a sample, not a proof of the floor for every frame; the terminal's ghost text is wave 1 behaviour and was not measured.
