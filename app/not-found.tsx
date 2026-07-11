import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The requested Agentic Income route does not exist.',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div className="grid min-h-[62svh] place-items-center py-16">
      <section className="max-w-2xl text-center">
        <div className="kicker">404 · route not found</div>
        <h1 className="mt-3 text-5xl font-semibold text-ink">This path has no verified artifact.</h1>
        <p className="mt-5 text-lg leading-8 text-muted">
          Return to the revenue-system overview or inspect the open-source method directly.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="cta">Open Agentic Income</Link>
          <a href="https://github.com/frankxai/agentic-income-skills" target="_blank" rel="noopener noreferrer" className="cta-secondary">
            Inspect open source
          </a>
        </div>
      </section>
    </div>
  )
}
