import type { Metadata } from 'next'
import { baseOpenGraph } from '@/lib/open-graph'
import { payingPrograms, verifiedEconomicsPrograms, verifiedRangeLabel } from '@/lib/affiliate'
import Link from 'next/link'
import { TrackedLink } from '@/components/TrackedLink'

export const metadata: Metadata = {
  title: 'AI Tools Catalog',
  description: 'Live catalog of AI tools with real affiliate programs, showing whether each payout recurs, pays once, or is not yet confirmed. The exact programs powering the Agentic Income flywheel.',
  alternates: { canonical: '/tools' },
  openGraph: {
    ...baseOpenGraph,
    title: 'AI Tools Catalog',
    description: 'Live catalog of AI tools with real affiliate programs, showing whether each payout recurs, pays once, or is not yet confirmed. The exact programs powering the Agentic Income flywheel.',
    url: '/tools',
  },
}

export default function Tools() {
  const programs = payingPrograms()
  const verified = verifiedEconomicsPrograms()

  return (
    <div className="py-16">
      <div className="max-w-3xl">
        <div className="kicker">Engine</div>
        <h1 className="mt-3 text-5xl font-semibold text-ink">AI tools catalog</h1>
        <p className="mt-4 text-lg leading-8 text-muted">Only tools with real affiliate programs. The Recurring column shows whether each payout recurs, pays once, mixes both, or is not yet confirmed (n/c). The catalog is the shared source of truth for every monetized route in the network.</p>
      </div>

      <section className="mt-12">
        <h2 className="display-h2">Partner economics</h2>
        <p className="mt-3 max-w-prose text-sm leading-6 text-muted">
          Some links on this page are affiliate links; Agentic Income may earn a commission.
          Rates below were verified {verifiedRangeLabel(verified)} against each program&apos;s own terms — everything
          else in the catalog stays labeled unverified until it gets the same pass.
        </p>
        <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-surface/80">
          <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Partner economics comparison">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted">
                  <th className="px-5 py-4 font-medium">Program</th>
                  <th className="px-5 py-4 font-medium">Commission</th>
                  <th className="px-5 py-4 font-medium">Cookie window</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {verified.map((program) => (
                  <tr key={program.tool} className="border-t border-border/70">
                    <td className="px-5 py-4 font-semibold text-ink">{program.tool}</td>
                    <td className="px-5 py-4 text-ink">{program.commission}</td>
                    <td className="px-5 py-4 text-muted">{program.cookieDays ? `${program.cookieDays} days` : 'not published'}</td>
                    <td className="px-5 py-4 text-muted">{program.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-surface/80">
        <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="AI tools affiliate catalog">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="px-5 py-4 font-medium">Rank</th>
                <th className="px-5 py-4 font-medium">Tool</th>
                <th className="px-5 py-4 font-medium">Commission</th>
                <th className="px-5 py-4 font-medium">Recurring</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {programs.map((program, idx) => (
                <tr key={program.tool} className="border-t border-border/70 hover:bg-white/[0.018]">
                  <td className="px-5 py-4 font-mono text-xs text-muted">{idx + 1}</td>
                  <td className="px-5 py-4 font-semibold text-ink">{program.tool}</td>
                  <td className="px-5 py-4 text-ink">{program.commission || 'verify'}</td>
                  <td className="px-5 py-4 text-muted">{program.recurring || 'verify'}</td>
                  <td className="px-5 py-4 text-muted">{program.status || 'active'}</td>
                  <td className="px-5 py-4">
                    {program.ourLink ? (
                      <TrackedLink
                        href={program.ourLink}
                        target="_blank"
                        rel="sponsored nofollow noopener"
                        className="inline-flex min-h-8 items-center rounded-lg bg-accent px-4 py-1.5 text-xs font-semibold text-bg"
                        event="affiliate_click"
                        payload={{ tool: program.tool, source: 'tools-catalog' }}
                      >
                        Open tracked route
                      </TrackedLink>
                    ) : (
                      <span className="text-xs text-muted">Pending join</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 max-w-prose text-xs leading-6 text-muted">
        Some links are affiliate links. A listed tool does not override the comparison verdict; the honest pick wins even when there is no payout route.
      </div>

      <div className="mt-12">
        <Link href="/start" className="cta-secondary">Learn how to build around these</Link>
      </div>
    </div>
  )
}
