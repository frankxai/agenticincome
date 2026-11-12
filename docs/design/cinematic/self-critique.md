# Cinematic homepage self-critique

Date: 2026-11-12. Author: Claude (Anthropic). Checked against `docs/design/cinematic/design-lock.md` and against one question: would a stranger call this generic AI design?

Every statement about a render below refers to a screenshot taken with Playwright Chromium against the production build (`next build`, `next start`) and opened by the author. Final captures are in `docs/design/cinematic/screens/`. Round 1 and round 2 working captures were scratch files and are not committed; what they showed is described in words.

## Direction

Chosen: a scroll film on the existing obsidian system. The page keeps its sections and gains scenes.

Two alternatives were considered and set aside:

- Full-page canvas or WebGL scene behind the content. Set aside: `TASTE.md` cuts 3D without a product metaphor and budget, it would need a new dependency or a large hand-written renderer, and it puts decoration in front of proof.
- Horizontal scroll chapters. Set aside: it takes over the scroll direction, which the motion rules forbid, and it hides the partner table and catalog behind a gesture.

## Round 1

Rendered at 390, 768, 1440, reduced motion, no JavaScript, and seven mid-scroll frames.

| # | Defect seen | Lock line | Fix | Result on re-render |
| --- | --- | --- | --- | --- |
| 1 | Pinned scenes left an empty 58px band at the top. The pin offset used the header height, but the site header does not stick (its `.glass` class sets `position: relative`, which wins over `sticky`). | Readable centre | `navOffset()` returns the header height only when the header's computed position is sticky or fixed. | Band gone. |
| 2 | Character plates were small full-body robots. At 88px on mobile they were unreadable; at desktop they looked like clip art. A stranger would call them generic. | "If a plate looks crude, simplify it to a strong geometric emblem" | Redrew all five as busts: one large head and one large instrument per plate. Agents get a square head and visor; the human gets a round head, no visor. | Readable at 104px on mobile; each plate is told apart by its instrument at a glance. |
| 3 | Artifact panel used a fixed 11.5rem label column, so `downloads/agentic-income-starter-kit.md` broke into five lines. | Outlined mini panels | Label column sized to its content; rows share one grid. | Path fits on one or two lines. |
| 4 | The first terminal line wrapped after "agentic-" at 1440 because the type size had been raised. | Staged object, readable | Terminal type back to 0.77rem at 640px and up, 0.7rem below. | Both commands sit on one line at 1440 and 768. |
| 5 | Inspector rows off the reading line were at 46 percent opacity. Availability states and the word "Free" were too faint. | Availability states exactly as honest as today | Raised to 62 percent. Hover and keyboard focus restore a row. | States legible while dimmed. |
| 6 | The left column heading ran to six lines beside the spine. | Weight 500 to 600 headings, calm density | Smaller clamp for that heading. | Four lines. |

## Round 2

Re-rendered everything after round 1.

| # | Defect seen | Lock line | Fix | Result on re-render |
| --- | --- | --- | --- | --- |
| 7 | Pinned build path sat in the top half of the viewport with the bottom 40 percent empty. Cause: ScrollTrigger wraps the pinned element in a `.pin-spacer`, so the child selector `[data-pinned] > .cine-pin` stopped matching and the stage lost its height and centring. | One concept at a time, readable centre | Descendant selector. | Step is centred in the viewport (`scene-build-path-1440-mid.png`). |
| 8 | Ghost text in the terminal at 26 percent was close to invisible on the 390 render. | Final text in the DOM from first paint; nothing hidden | Raised to 34 percent. | Legible as ghost text at 390 and 1440. |
| 9 | In the reduced-motion and no-JavaScript renders the heading column was empty for most of the 1700px step list. | Chapters, calm density | Heading and spine are `position: sticky` at desktop when the scene is not pinned. | Measured in Chromium with reduced motion: scrolled 900px into the list, the heading column sits 40px from the top of the viewport. A full-page capture cannot show this, because it renders sticky elements at their static position. |
| 10 | Audit finding: new headings had no `text-wrap: balance`; code tokens could be machine-translated. | Web Interface Guidelines | `text-wrap: balance` on new headings; `translate="no"` on artifact panels, tool names and source lines. | Mechanical lint 0 errors, 0 warnings. |
| 11 | Audit finding: one idle transform targeted a bare `<path>`. | Web Interface Guidelines, SVG transforms on a `<g>` | Wrapped in a `<g>`. | No visual change. |

## Line by line against the lock

| Lock line | Verdict | Evidence or gap |
| --- | --- | --- |
| Tokens unchanged, Geist Sans and Mono | Kept | No token added. Three near-token fills for the sheets (`#0c0f19`, `#080a11`, `#06080d`) are steps between bg and surface. Headings use the display face the page already used. |
| Emerald only for verified, proof, primary, active | Kept | Emerald appears on: primary action, active spine node and progress, artifact paths, verification sweeps, the focused inspector index, one detail per plate. The tool names lost their emerald, which was decorative. |
| Syntax color inside panes | Kept | Cyan prompt only inside the terminal. |
| Edge-to-edge opening stage, one metaphor, readable centre | Kept | Full-bleed fill; terminal on three named source sheets. |
| Technical spine, one concept at a time, mono captions, outlined panels | Kept at desktop | `scene-build-path-1440-mid.png`. |
| Dotted rules and 12px mono markings | Kept | Chapter marks 01 to 07, dotted row rules. |
| 128 to 210px chapter room | Kept at desktop | `clamp(8rem, 17vh, 13rem)`. Below 1024px chapters use 88px, under the range, to keep the mobile page from growing further. |
| Fills, never soft drop shadows | Partly | New panels use fills and borders, and the terminal's drop shadow is removed. The primary action keeps its existing emerald glow from `app/globals.css`, which is outside this change. |
| No Sui blue, type, square buttons, tunnel | Kept | |
| Characters in the plate language, one emerald detail, once-only idle | Kept | Five plates. Idle states were not captured in a still; they are verified by reading the code, not by screenshot. |
| Rejects | Kept, one caveat | The site-wide `body::before` background has a faint blue-tinted corner gradient that pre-dates this change and shows on mobile around the opening. Not touched: `app/globals.css` is out of scope. |
| Scene 1: terminal settles, types over 60 percent of a viewport | Kept | `scene-opening-1440-mid.png` shows the command mid-typing and the answer still ghosted. |
| Scene 2: real artifacts, paths in mono | Kept | All five paths exist; every value is read at build time. |
| Scene 2: reuse AgentWorkflowProof | Partly | Its four stages (input, execution, output, human gate) are one run, not the five build steps, so it could not be the spine. It is staged directly after the spine as the worked example, unedited. |
| Scene 3: stacking deck, gold risk boundary | Kept | `scene-routes-1440-mid.png`. |
| Scene 4: semantic table, ordered rows, conditional sweep, source and date | Kept | `scene-partners-1440-mid.png`. Every row in this table has a date, because `verifiedEconomicsPrograms()` filters on it, so every row shows a sweep. |
| Scene 5: inspector on desktop, plain list on mobile | Kept, by a different mechanism | No pin: focus follows the reading line. It costs no pin distance and never covers a link. |
| Scene 6: one calm frame | Kept | `scene-close-1440-mid.png`. |
| Document layer complete without JS or motion | Kept | `home-1440-no-js.png`, `home-1440-reduced-motion.png`: same 11095px document. |
| matchMedia, cleanup, desktop-only pinning | Kept | Also requires 700px of viewport height, so short laptop windows fall back to the list. |
| No hijack, at most 3.5 viewports pinned, transform and opacity | Kept | 2.8 viewports. Inspector focus also transitions background-color over 180ms. |
| Lazy motion layer | Kept | Dynamic import two frames after mount. |
| Keyboard and focus | Kept | Tab reached all 32 homepage links and the table region in DOM order, each with a 2px solid outline and at least 44px of height. A second pass with pinning active checked 30 links: each was fully inside the viewport when focused, and a dimmed inspector row returned to full opacity on focus (five were read mid-transition at 95 to 97 percent). Chromium only. |
| True data | Kept | No literal number, price, rate or date in the new markup. |

## Would a stranger call this generic AI design?

What argues against it: the opening object is this product's own tool answering a real call, resting on the files it reads. The spine cites real paths and real values. The gold boundary, the verification column and the catalog states are honest in ways a template is not. There is no gradient headline, node cloud or fake dashboard.

What still could read as generic, stated plainly:

- A dark page with an emerald accent and a mono terminal is a common look. The differences are in content, not palette.
- The agent busts are friendly robots. They are consistent and legible, but a robot with a visor is not a distinctive mark. The raster slots in `design/asset-manifest.json` exist so a stronger cast can replace them.
- The mobile page is long: 15733px at 390 wide against 12033px on main. Most of the growth is the five build steps and the new verification column's wider table.

## Measurements

- Homepage script transfer, load plus full scroll, gzip level 9: 221603 bytes on main, 224068 on this branch, +2465 bytes (about 1.1 percent). The scenes module is a separate chunk loaded after first paint.
- Cumulative layout shift, load plus full scroll at 1440: 0.0000 on main and on this branch.
- Document height at 1440: 7491px on main; 11095px at rest on this branch; 12857px with pinning active (the extra is pin distance).
- Console: the same two 404 responses appear on main and on this branch when run locally (requests under `/_vercel/`, which exist only on the hosting platform). No page errors.

## Not verified

- Safari, Firefox, any real phone or tablet, any screen reader.
- The idle animations and the load settle in motion; only their resting and mid-scroll states were captured.
- Largest contentful paint and interaction timings. No lab or field number is claimed.
- The 390 capture is 477px wide on main and on this branch. The cause was not traced; the document's scroll width is 390 in both.
