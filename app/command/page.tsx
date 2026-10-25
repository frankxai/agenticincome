import type { Metadata } from 'next'
import { baseOpenGraph } from '@/lib/open-graph'
import Link from 'next/link'
import { IncomeCommandDesk } from '@/components/IncomeCommandDesk'

export const metadata: Metadata = {
  title: 'Income workspace · Illustrative preview',
  description:
    'Public illustrative preview of an income workspace. No authenticated account, live agents, revenue, or approval telemetry is connected.',
  alternates: { canonical: '/command' },
  openGraph: {
    ...baseOpenGraph,
    title: 'Income workspace · Illustrative preview',
    description:
      'Public illustrative preview with example workflows and unconnected activity.',
    url: '/command',
  },
}

export default function CommandPage() {
  return (
    <main className="min-h-screen bg-[#05060A] text-slate-100">
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-semibold uppercase text-emerald-400">
            Illustrative preview
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Income workspace preview
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-300">
            Explore an example income workspace. Account identity, agent activity, revenue, and
            approval records are not connected. This public preview does not provide a private account boundary.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm font-mono">
            <Link
              href="/operate"
              className="inline-flex items-center rounded-xl bg-white/10 px-4 py-2.5 font-semibold text-white transition hover:bg-white/20 min-h-[44px]"
            >
              ← Back to Operating Loop
            </Link>
            <a
              href="https://github.com/frankxai/agentic-income-skills"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-xl border border-white/10 px-4 py-2.5 font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white min-h-[44px]"
            >
              Inspect public reference ↗
            </a>
          </div>
        </div>

        <IncomeCommandDesk />
      </section>
    </main>
  )
}
