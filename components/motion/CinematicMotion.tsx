'use client'

import { useEffect, useRef } from 'react'

/** The server renders the complete film at rest. Wider screens can add scroll choreography. */
export function CinematicMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = root.current
    if (!element) return

    const media = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)')
    let active = true
    let frame = 0
    let dispose: (() => void) | undefined

    function refresh() {
      cancelAnimationFrame(frame)
      dispose?.()
      dispose = undefined
      if (!media.matches) return
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          void import('./scenes').then(({ mountScenes }) => {
            if (active && media.matches && !dispose && element) dispose = mountScenes(element)
          }).catch(() => {
            // The static composition remains usable if the optional scene bundle fails.
          })
        })
      })
    }

    refresh()
    media.addEventListener('change', refresh)
    return () => {
      active = false
      cancelAnimationFrame(frame)
      media.removeEventListener('change', refresh)
      dispose?.()
    }
  }, [])

  return <div ref={root} data-cine-root>{children}</div>
}
