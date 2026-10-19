'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    // Log the error to an error reporting service
    if (error.digest) {
      console.error(error.digest)
    }

    // Move focus to heading when component mounts
    headingRef.current?.focus()
  }, [error])

  return (
    <div className="grid min-h-[62svh] place-items-center py-16">
      <section className="max-w-2xl text-center">
        <div className="kicker">Runtime Error</div>
        <h1
          className="mt-3 text-5xl font-semibold text-ink outline-none"
          tabIndex={-1}
          ref={headingRef}
        >
          Something went wrong.
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted">
          The application encountered an unexpected condition. You can try loading this segment again or return to the main overview.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button onClick={() => reset()} className="cta">
            Try again
          </button>
          <Link href="/" className="cta-secondary">
            Return home
          </Link>
        </div>
      </section>
    </div>
  )
}
