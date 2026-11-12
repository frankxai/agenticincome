import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { mountDepth, mountGlass } from './depth/mount'
import { depthState } from './depth/state'

/**
 * The homepage motion layer. Loaded lazily by CinematicMotion after first paint.
 *
 * Rules this file keeps (design/MOTION.md, docs/design/cinematic/design-lock.md):
 * - Every pre-animation state is set here, inside gsap.matchMedia. Nothing is
 *   hidden in CSS, so no-JS and reduced-motion readers get the page at rest.
 * - Pinning and stacking only at min-width 1024px with motion allowed. Below
 *   that, in-view reveals only.
 * - Native scroll: no smooth-scroll library, no wheel listeners, no snapping.
 * - Only transform and opacity are animated.
 * - Total pinned distance: SPINE_PIN + DECK_PIN viewports.
 * - The depth layer (components/motion/depth/) has no scroll listener. The ScrollTriggers here write scroll
 *   progress into depthState, and the WebGL stage reads it on GSAP's ticker.
 */

const SPINE_PIN = 1.6
const DECK_PIN = 1.2
const GHOST = 0.34

type Cleanup = () => void

/** Space a pinned stage must leave at the top: the header's height, but only if the header actually sticks. */
function navOffset(): number {
  const header = document.querySelector('header')
  if (!header) return 0
  const position = getComputedStyle(header).position
  return position === 'sticky' || position === 'fixed' ? Math.round(header.getBoundingClientRect().height) : 0
}

/**
 * Tweens started later from scroll callbacks (step focus, idle states) are created outside the
 * gsap.matchMedia recording scope, so mm.revert() does not undo them. This stops any still in
 * flight and removes every inline style they left, returning the elements to the document layer.
 */
function release(targets: Element[], props = 'opacity,transform,translate,rotate,scale,transformOrigin') {
  if (!targets.length) return
  gsap.killTweensOf(targets)
  gsap.set(targets, { clearProps: props })
}

/** One-shot idle state for a character plate. Never loops. */
function playIdle(plate: Element | null | undefined) {
  if (!plate) return
  const eyes = plate.querySelectorAll('[data-idle="eye"]')
  if (eyes.length) {
    gsap.fromTo(
      eyes,
      { scaleY: 1 },
      { scaleY: 0.1, duration: 0.09, delay: 0.5, repeat: 1, yoyo: true, transformOrigin: '50% 50%', ease: 'power1.inOut' },
    )
  }
  const tool = plate.querySelector<SVGElement>('[data-idle="tool"]')
  if (!tool) return
  const base = { duration: 0.7, ease: 'power3.out', overwrite: true }
  switch (tool.dataset.idleKind) {
    case 'glint':
      gsap.fromTo(tool, { opacity: 0.15, x: -5, y: 5 }, { opacity: 1, x: 0, y: 0, ...base, delay: 0.15 })
      break
    case 'swing':
      gsap.fromTo(tool, { rotation: -14, svgOrigin: '188 64' }, { rotation: 0, svgOrigin: '188 64', ...base, delay: 0.1 })
      break
    case 'turn':
      gsap.fromTo(tool, { rotation: -28, svgOrigin: '188 120' }, { rotation: 0, svgOrigin: '188 120', ...base, delay: 0.1 })
      break
    case 'press':
      gsap.fromTo(tool, { scale: 1.22, transformOrigin: '50% 50%' }, { scale: 1, transformOrigin: '50% 50%', ...base, ease: 'back.out(2.2)', delay: 0.1 })
      break
    case 'key':
      gsap.fromTo(tool, { x: -12 }, { x: 0, ...base, delay: 0.1 })
      break
  }
}

export function mountScenes(root: HTMLElement): Cleanup {
  gsap.registerPlugin(ScrollTrigger)
  const mm = gsap.matchMedia(root)
  const find = <T extends Element = HTMLElement>(selector: string) => Array.from(root.querySelectorAll<T>(selector))

  mm.add(
    {
      motion: '(prefers-reduced-motion: no-preference)',
      desktop: '(min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)',
      // The WebGL layer and refraction: wide screens with motion allowed. Below this the page keeps its poster.
      depth: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
    },
    (context) => {
      const { motion, desktop, depth } = context.conditions as { motion: boolean; desktop: boolean; depth: boolean }
      if (!motion) return
      const cleanups: Cleanup[] = []
      let disposed = false
      const viewport = window.innerHeight
      root.style.setProperty('--cine-pin-top', `${navOffset()}px`)
      cleanups.push(() => root.style.removeProperty('--cine-pin-top'))

      /* Depth layer. Glass highlight and refraction at once; the WebGL stage only where the device can carry it. */
      depthState.opening = 0
      depthState.close = 0
      depthState.step = -1
      depthState.pulse = 0
      cleanups.push(mountGlass(root, depth))
      if (depth) cleanups.push(mountDepth(root))
      cleanups.push(() => {
        gsap.killTweensOf(depthState)
        depthState.pulse = 0
        depthState.step = -1
      })

      /* Scene 1. Opening stage: the terminal settles, then scroll types the tool call. */
      const opening = root.querySelector<HTMLElement>('[data-scene="opening"]')
      const object = root.querySelector<HTMLElement>('[data-cine="object"]')
      if (opening && object) {
        if (window.scrollY < 40) {
          // Job: arrival. The staged object lands once so the eye finds the centre of the stage.
          gsap.from(object, { y: 26, scale: 0.985, duration: 0.9, ease: 'power3.out', clearProps: 'transform' })
        }
        const command = opening.querySelector<HTMLElement>('[data-cine="type"]')
        const lines = Array.from(opening.querySelectorAll<HTMLElement>('[data-cine="resolve"]'))
        if (command) {
          // The terminal is role="img" with a full aria-label, so splitting its text into spans changes nothing for assistive tech.
          const text = command.textContent ?? ''
          command.textContent = ''
          const chars = Array.from(text).map((char) => {
            const span = document.createElement('span')
            span.textContent = char
            command.appendChild(span)
            return span
          })
          cleanups.push(() => {
            command.textContent = text
          })
          // Job: cause and effect. The command is asked, then the real answer resolves. Untyped text stays
          // legible as ghost text, so nothing is ever hidden; scroll only brings it to full strength.
          const typing = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: opening, start: 'top top', end: () => `+=${Math.round(window.innerHeight * 0.6)}`, scrub: 0.35 },
          })
          typing.fromTo(chars, { opacity: GHOST }, { opacity: 1, duration: 0.02, stagger: 0.5 / Math.max(chars.length, 1) }, 0)
          typing.fromTo(lines, { opacity: GHOST, y: 6 }, { opacity: 1, y: 0, duration: 0.09, stagger: 0.085 }, 0.52)
          // Job: the answer landing is the signal. The field behind the stage brightens once, the first time it resolves.
          let resolved = false
          typing.call(() => {
            if (resolved || disposed) return
            resolved = true
            gsap.timeline().to(depthState, { pulse: 1, duration: 0.32, ease: 'power2.out' }).to(depthState, { pulse: 0, duration: 1.5, ease: 'power2.inOut' })
          })
        }
        // Job: the signal field's flow and brightness, the slab fan and the camera drift all follow this one progress value.
        ScrollTrigger.create({
          trigger: opening,
          start: 'top top',
          end: 'bottom top',
          onUpdate: (self) => {
            depthState.opening = self.progress
          },
        })
        if (desktop) {
          // Job: depth. The source sheets behind the terminal drift apart slightly as the stage leaves.
          find('[data-cine="sheet"]').forEach((sheet, index) => {
            gsap.to(sheet, {
              y: -14 * (index + 1),
              ease: 'none',
              scrollTrigger: { trigger: opening, start: 'top top', end: 'bottom top', scrub: 0.5 },
            })
          })
        }
      }

      /* Scene 2. The build path: a pinned spine, one step in focus at a time. */
      const spine = root.querySelector<HTMLElement>('[data-scene="build-path"]')
      const spinePin = spine?.querySelector<HTMLElement>('[data-cine="pin"]')
      const steps = spine ? Array.from(spine.querySelectorAll<HTMLElement>('[data-cine="step"]')) : []
      if (spine && spinePin && steps.length) {
        cleanups.push(() => {
          // Idle targets are SVG groups with no authored style or transform, so GSAP's attributes can simply be removed.
          const idle = Array.from(spine.querySelectorAll('[data-idle]'))
          const scrub = () => {
            gsap.killTweensOf(idle)
            idle.forEach((element) => {
              element.removeAttribute('style')
              element.removeAttribute('transform')
              element.removeAttribute('data-svg-origin')
            })
          }
          scrub()
          // Again on the next frame: this cleanup runs before GSAP finishes reverting the context, and that
          // revert can write an interrupted idle tween's start state back onto the element.
          requestAnimationFrame(scrub)
        })
        if (desktop) {
          const nodes = Array.from(spine.querySelectorAll<HTMLElement>('[data-cine="rail-node"]'))
          const progress = spine.querySelector<HTMLElement>('[data-cine="rail-progress"]')
          spine.dataset.pinned = 'true'
          cleanups.push(() => {
            delete spine.dataset.pinned
            nodes.forEach((node) => node.classList.remove('is-active', 'is-done'))
            release(steps)
            if (progress) release([progress])
          })
          // Opacity only (not visibility): every step stays in the accessibility tree while one is in focus.
          gsap.set(steps.slice(1), { opacity: 0, y: 22 })
          if (progress) gsap.set(progress, { scaleY: 0, transformOrigin: 'top center' })
          let active = -1
          const played = new Set<number>()
          const mark = (index: number) => {
            nodes.forEach((node, i) => {
              node.classList.toggle('is-active', i === index)
              node.classList.toggle('is-done', i < index)
            })
          }
          const focus = (index: number) => {
            if (disposed || index === active) return
            if (active >= 0) gsap.to(steps[active], { opacity: 0, y: index > active ? -18 : 18, duration: 0.28, ease: 'power2.in', overwrite: true })
            // Job: one concept at a time. The step that owns this part of the scroll takes the stage.
            gsap.fromTo(
              steps[index],
              { y: index > active ? 22 : -22 },
              { opacity: 1, y: 0, duration: 0.5, delay: active >= 0 ? 0.12 : 0, ease: 'power3.out', overwrite: true },
            )
            if (!played.has(index)) {
              played.add(index)
              playIdle(steps[index].querySelector('[data-cine="plate"]'))
            }
            active = index
            depthState.step = index
            mark(index)
          }
          mark(0)
          active = 0
          depthState.step = 0
          ScrollTrigger.create({
            trigger: spinePin,
            start: () => `top ${navOffset()}px`,
            end: () => `+=${Math.round(window.innerHeight * SPINE_PIN)}`,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onEnter: () => {
              if (!played.has(0)) {
                played.add(0)
                playIdle(steps[0].querySelector('[data-cine="plate"]'))
              }
            },
            onUpdate: (self) => {
              focus(Math.min(steps.length - 1, Math.floor(self.progress * steps.length)))
              // Job: orientation. The emerald line on the spine shows how far along the path the reader is.
              if (progress) gsap.set(progress, { scaleY: self.progress })
            },
          })
        } else {
          steps.forEach((step) => {
            ScrollTrigger.create({
              trigger: step,
              start: 'top 78%',
              once: true,
              onEnter: () => playIdle(step.querySelector('[data-cine="plate"]')),
            })
          })
        }
      }

      /* Scene 3. Delivery routes: a stacking deck. Each card holds, the next slides over it. */
      const deckScene = root.querySelector<HTMLElement>('[data-scene="routes"]')
      const deckPin = deckScene?.querySelector<HTMLElement>('[data-cine="pin"]')
      const cards = deckScene ? Array.from(deckScene.querySelectorAll<HTMLElement>('[data-cine="card"]')) : []
      if (desktop && deckScene && deckPin && cards.length > 1) {
        deckScene.dataset.pinned = 'true'
        cleanups.push(() => {
          delete deckScene.dataset.pinned
          release(cards)
          release(cards.flatMap((card) => Array.from(card.children)), 'opacity')
        })
        gsap.set(cards.slice(1), { y: () => viewport })
        // Job: comparison in sequence. Each route gets the full stage, then is filed under the next.
        const deck = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: deckPin,
            start: () => `top ${navOffset()}px`,
            end: () => `+=${Math.round(window.innerHeight * DECK_PIN)}`,
            pin: true,
            scrub: 0.4,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
        const last = cards.length - 1
        cards.forEach((card, index) => {
          if (index === 0) return
          const at = index - 1
          deck.to(card, { y: 0, duration: 0.8 }, at)
          // Earlier cards step back and up so their top edges stay visible as a stack.
          cards.slice(0, index).forEach((under, depth) => {
            const behind = index - depth
            deck.to(under, { y: -16 * behind, scale: 1 - 0.035 * behind, duration: 0.8, transformOrigin: 'top center' }, at)
          })
          // The cards are glass. A filed card's text would smear through the one on top, so it fades as it is
          // covered; wave 1 hid it behind an opaque card, so nothing readable is lost.
          deck.to(cards[index - 1].children, { opacity: 0, duration: 0.45 }, at + 0.3)
          deck.to({}, { duration: index === last ? 0.25 : 0.2 })
        })
      }

      /* Scene 4. Partner board: rows arrive in order; verified commission cells get one emerald sweep. */
      const board = root.querySelector<HTMLElement>('[data-scene="partners"] tbody')
      if (board) {
        const rows = Array.from(board.querySelectorAll<HTMLElement>('tr'))
        const below = board.getBoundingClientRect().top > viewport * 0.85
        if (below && rows.length) {
          const sweeps = rows.map((row) => row.querySelector<HTMLElement>('[data-cine="sweep"]'))
          gsap.set(rows, { opacity: 0 })
          gsap.set(sweeps.filter(Boolean), { scaleX: 0, transformOrigin: 'left center' })
          const reveal = gsap.timeline({ scrollTrigger: { trigger: board, start: 'top 82%', once: true } })
          rows.forEach((row, index) => {
            // Job: the table is read as a list of checked facts, top to bottom.
            reveal.to(row, { opacity: 1, duration: 0.35, ease: 'power2.out' }, index * 0.06)
            const sweep = sweeps[index]
            // Job: the sweep marks a cell whose rate carries a verification date. Rows without one get none.
            if (sweep) reveal.to(sweep, { scaleX: 1, duration: 0.45, ease: 'power2.out' }, index * 0.06 + 0.18)
          })
        }
      }

      /* Scene 5. Inspectors: on desktop, the row on the reading line is in focus. */
      if (desktop) {
        find('[data-cine="inspector"]').forEach((list) => {
          const items = Array.from(list.children) as HTMLElement[]
          if (!items.length) return
          const set = (index: number | null) => {
            list.classList.toggle('is-inspecting', index !== null)
            items.forEach((item, i) => item.classList.toggle('is-focus', i === index))
          }
          cleanups.push(() => set(null))
          // Job: one item at a time. Focus follows the reading line; hover and keyboard focus always win (CSS).
          ScrollTrigger.create({
            trigger: list,
            start: 'top 58%',
            end: 'bottom 42%',
            onUpdate: (self) => set(Math.min(items.length - 1, Math.floor(self.progress * items.length))),
            onToggle: (self) => {
              if (!self.isActive) set(null)
            },
          })
        })
      }

      /* Scene 6. Close: the signal field returns, with its trace of gold, as the last frame arrives. */
      const closing = root.querySelector<HTMLElement>('[data-scene="close"]')
      if (closing) {
        ScrollTrigger.create({
          trigger: closing,
          start: 'top bottom',
          end: 'bottom bottom',
          onUpdate: (self) => {
            depthState.close = self.progress
          },
        })
      }

      /* Shared: simple in-view reveals for anything still below the fold. */
      find('[data-cine-reveal]').forEach((element) => {
        if (element.getBoundingClientRect().top < viewport * 0.9) return
        // Job: pacing. A chapter's heading and body arrive as the reader reaches them.
        gsap.from(element, {
          opacity: 0,
          y: 18,
          duration: 0.6,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: element, start: 'top 90%', once: true },
        })
      })

      ScrollTrigger.sort()
      ScrollTrigger.refresh()

      // Runs when a condition stops matching and on unmount. Stale scroll callbacks must not start new tweens.
      return () => {
        disposed = true
        cleanups.forEach((cleanup) => cleanup())
      }
    },
  )

  return () => mm.revert()
}
