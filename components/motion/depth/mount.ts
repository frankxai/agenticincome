import gsap from 'gsap'
import { depthState } from './state'

/**
 * Entry points for the depth layer, called by scenes.ts from inside
 * gsap.matchMedia. Nothing here imports three: mountDepth() decides whether the
 * device should get the WebGL layer at all and only then loads depth/stage.ts
 * as its own chunk.
 *
 * Document layer first. With JavaScript off, WebGL missing, reduced motion, a
 * small or data-saving device, or a lost context, the page is the CSS poster,
 * the SVG plates and frosted glass (depth/depth.css). This file only ever adds.
 */

type Cleanup = () => void

type NavigatorHints = Navigator & {
  connection?: { saveData?: boolean }
  userAgentData?: { brands?: Array<{ brand: string }> }
}

/** CPU rasterisers. They draw the layer correctly but far too slowly, so they get the poster. */
const SOFTWARE_RENDERER = /swiftshader|llvmpipe|softpipe|software|basic render/i

/** True only when the device should run the WebGL layer. The caller has already checked width and motion. */
export function canRunDepth(): boolean {
  const hints = navigator as NavigatorHints
  if (hints.connection?.saveData) return false
  if ((navigator.hardwareConcurrency ?? 0) < 4) return false
  if (typeof WebGL2RenderingContext === 'undefined') return false
  // Probe on a throwaway canvas before downloading the WebGL chunk, and release it at once so the page only ever
  // holds one context. failIfMajorPerformanceCaveat: a software rasteriser (no GPU) is treated as no WebGL.
  const probe = document.createElement('canvas').getContext('webgl2', { failIfMajorPerformanceCaveat: true })
  if (!probe) return false
  // Some browsers hand out a software context without calling it a caveat. Its renderer string says so.
  const info = probe.getExtension('WEBGL_debug_renderer_info')
  const renderer = info ? String(probe.getParameter(info.UNMASKED_RENDERER_WEBGL)) : ''
  probe.getExtension('WEBGL_lose_context')?.loseContext()
  return !SOFTWARE_RENDERER.test(renderer)
}

/**
 * WebGL layer: one fixed canvas behind the document, created only here.
 * `data-cine-depth="live"` on <html> is the single switch the stylesheet reads
 * to step the poster, the CSS sheets and the plate figures aside.
 */
export function mountDepth(root: HTMLElement): Cleanup {
  if (!canRunDepth()) return () => {}
  const html = document.documentElement
  let cancelled = false
  let dispose: Cleanup | undefined
  let canvas: HTMLCanvasElement | undefined

  import('./stage')
    .then(({ createStage }) => {
      if (cancelled) return
      canvas = document.createElement('canvas')
      canvas.className = 'cine-depth-canvas'
      canvas.setAttribute('aria-hidden', 'true')
      root.prepend(canvas)
      try {
        dispose = createStage(root, canvas, depthState, gsap.ticker, {
          onLive: () => {
            html.dataset.cineDepth = 'live'
          },
          onLost: () => {
            delete html.dataset.cineDepth
          },
        }).dispose
      } catch {
        // No context after all: the poster stays.
        canvas.remove()
        canvas = undefined
      }
    })
    .catch(() => {
      // The layer is optional. If the chunk fails to load the page stays on its poster.
    })

  return () => {
    cancelled = true
    delete html.dataset.cineDepth
    dispose?.()
    canvas?.remove()
  }
}

/** Chromium is the only engine that applies an SVG filter inside backdrop-filter; everywhere else gets frosted glass. */
function supportsRefraction(): boolean {
  const brands = (navigator as NavigatorHints).userAgentData?.brands
  if (!brands?.some((entry) => entry.brand === 'Chromium')) return false
  return typeof CSS !== 'undefined' && CSS.supports('backdrop-filter', 'url(#cine-refract) blur(1px)')
}

/**
 * Glass: turns on refraction where it is supported (desktop only) and lets the
 * inner highlight follow a mouse pointer. Frosted glass itself is plain CSS and
 * needs none of this.
 */
export function mountGlass(root: HTMLElement, desktop: boolean): Cleanup {
  const html = document.documentElement
  const cleanups: Cleanup[] = []

  if (desktop && supportsRefraction()) {
    html.dataset.cineGlass = 'refract'
    cleanups.push(() => {
      delete html.dataset.cineGlass
    })
  }

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const fixed = [
      document.querySelector<HTMLElement>('header.glass'),
      root.querySelector<HTMLElement>('.cine-object .terminal'),
      ...Array.from(root.querySelectorAll<HTMLElement>('.cine-route')),
    ].filter((element): element is HTMLElement => Boolean(element))
    let x = 0
    let y = 0
    let dirty = false
    const lit = new Set<HTMLElement>()

    const apply = () => {
      if (!dirty) return
      dirty = false
      const targets = [...fixed, ...Array.from(root.querySelectorAll<HTMLElement>('.cine-row.is-focus'))]
      // Read every rect first, then write, so a style write never forces the next read to recompute.
      const rects = targets.map((element) => element.getBoundingClientRect())
      for (const [index, element] of targets.entries()) {
        const rect = rects[index]
        const near = x > rect.left - 160 && x < rect.right + 160 && y > rect.top - 160 && y < rect.bottom + 160
        if (near) {
          element.style.setProperty('--glass-x', `${Math.round(x - rect.left)}px`)
          element.style.setProperty('--glass-y', `${Math.round(y - rect.top)}px`)
          element.style.setProperty('--glass-on', '1')
          lit.add(element)
        } else if (lit.has(element)) {
          element.style.setProperty('--glass-on', '0')
          lit.delete(element)
        }
      }
      lit.forEach((element) => {
        if (!targets.includes(element)) {
          element.style.setProperty('--glass-on', '0')
          lit.delete(element)
        }
      })
    }
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      x = event.clientX
      y = event.clientY
      dirty = true
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    gsap.ticker.add(apply)
    cleanups.push(() => {
      window.removeEventListener('pointermove', onMove)
      gsap.ticker.remove(apply)
      root.querySelectorAll<HTMLElement>('.cine-row').forEach((row) => fixed.push(row))
      fixed.forEach((element) => {
        element.style.removeProperty('--glass-x')
        element.style.removeProperty('--glass-y')
        element.style.removeProperty('--glass-on')
      })
    })
  }

  return () => cleanups.forEach((cleanup) => cleanup())
}
