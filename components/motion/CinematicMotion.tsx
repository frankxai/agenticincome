'use client'

import { useEffect, useRef } from 'react'

/**
 * Wraps the homepage scenes and loads the motion layer after first paint.
 *
 * The document layer (children) is complete without this component doing
 * anything: with JavaScript off, or under prefers-reduced-motion: reduce, the
 * page is the same content at rest. The scenes module is imported lazily so it
 * never sits in the path of the first paint.
 */
export function CinematicMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = root.current
    if (!element) return
    let cancelled = false
    let dispose: (() => void) | undefined

    const start = () => {
      import('./scenes')
        .then(({ mountScenes }) => {
          if (cancelled) return
          dispose = mountScenes(element)
        })
        .catch(() => {
          // The motion layer is optional. If it fails to load the page stays at rest.
        })
    }

    // Two frames: let the browser paint the document layer first.
    let second = 0
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(start)
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(first)
      cancelAnimationFrame(second)
      dispose?.()
    }
  }, [])

  return (
    <div ref={root} data-cine-root>
      {children}
    </div>
  )
}
