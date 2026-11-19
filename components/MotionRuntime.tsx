'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function MotionRuntime() {
  const pathname = usePathname()
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let active = true
    let dispose: (() => void) | undefined
    let frame = 0

    function refresh() {
      cancelAnimationFrame(frame)
      dispose?.()
      dispose = undefined
      if (reduced.matches || !document.querySelector(
        '.motion-reveal, [data-hero-panel], [data-engine-stage], [data-flow-line], [data-hero-trace], [data-signal-wave], [data-hero-node], [data-signal-node], .signal-board, [data-transform-media], [data-meter-fill]',
      )) return
      frame = requestAnimationFrame(() => {
        void import('./motion/page-motion').then(({ mountPageMotion }) => {
          if (active && !reduced.matches && !dispose) dispose = mountPageMotion()
        }).catch(() => {
          // All page content is visible before the optional motion module loads.
        })
      })
    }

    refresh()
    reduced.addEventListener('change', refresh)
    return () => {
      active = false
      cancelAnimationFrame(frame)
      reduced.removeEventListener('change', refresh)
      dispose?.()
    }
  }, [pathname])

  return null
}
