'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function MotionRuntime() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.motion-reveal').forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0.94, y: 10 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.62,
            ease: 'power3.out',
            clearProps: 'transform,opacity,visibility',
            scrollTrigger: {
              trigger: element,
              start: 'top 92%',
              once: true,
            },
          },
        )
      })

      gsap.fromTo(
        '[data-hero-panel]',
        { autoAlpha: 0.94, y: 12, scale: 0.992 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.82,
          delay: 0.18,
          ease: 'power3.out',
          clearProps: 'transform,opacity,visibility',
        },
      )

      gsap.fromTo(
        '[data-engine-stage]',
        { autoAlpha: 0.72, x: 10 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.5,
          delay: 0.35,
          stagger: 0.1,
          ease: 'power3.out',
          clearProps: 'transform,opacity,visibility',
        },
      )

      gsap.utils.toArray<SVGPathElement>('[data-flow-line], [data-hero-trace], [data-signal-wave]').forEach((path) => {
        const length = path.getTotalLength()
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length * 0.08 })
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: path,
            start: 'top 78%',
            once: true,
          },
        })
      })

      gsap.utils.toArray<SVGElement>('[data-hero-node], [data-signal-node]').forEach((node) => {
        gsap.fromTo(
          node,
          { autoAlpha: 0, scale: 0.45, transformOrigin: 'center center' },
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.42,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: node.closest('section') ?? node,
              start: 'top 78%',
              once: true,
            },
          },
        )
      })

      gsap.fromTo(
        '.signal-route',
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.52,
          stagger: 0.06,
          ease: 'power3.out',
          clearProps: 'transform,opacity,visibility',
          scrollTrigger: {
            trigger: '.signal-board',
            start: 'top 78%',
            once: true,
          },
        },
      )

      gsap.utils.toArray<HTMLElement>('[data-transform-media]').forEach((media) => {
        const image = media.querySelector('.transformation-image')
        if (!image) return

        gsap.fromTo(
          image,
          { scale: 1.055, autoAlpha: 0.74 },
          {
            scale: 1,
            autoAlpha: 1,
            duration: 1.05,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: media,
              start: 'top 76%',
              once: true,
            },
          },
        )
      })

      gsap.utils.toArray<HTMLElement>('[data-meter-fill]').forEach((bar) => {
        gsap.fromTo(
          bar,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.8,
            transformOrigin: 'left center',
            ease: 'power3.out',
            scrollTrigger: {
              trigger: bar,
              start: 'top 86%',
              once: true,
            },
          },
        )
      })
    })

    return () => ctx.revert()
  }, [])

  return null
}
