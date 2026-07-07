import type { Metadata } from 'next'
import Link from 'next/link'
import { payingPrograms } from '@/lib/affiliate'
import { EmailCapture } from '@/components/EmailCapture'

export const metadata: Metadata = {
  title: 'Start Here',
  description: 'The 3-step path to building an income system with AI agents — what to build, in what order, and why it compounds.',
  alternates: { canonical: '/start' },
  openGraph: {
    title: 'Start Here',
    description: 'The 3-step path to building an income system with AI agents — what to build, in what order, and why it compounds.',
    url: '/start',
  },
}

export default function Start() {
  const top = payingPrograms().slice(0, 6)

  return (
    <div className="py-14">
      <div className="kicker">Start here</div>
      <h1 className="mt-3 text-5xl font-semibold text-ink">Build the first loop. Then run it like a desk.</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        Start with no audience and no product. One comparison that ranks, a recurring-payer route behind it, and an
        email list — then the same operating model repeats across every category you add. The first loop is a page;
        the tenth is a system.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          ['Find the signal', 'Choose one tool category where people already compare, switch, and buy.'],
          ['Set the verdict', 'Rank the answer on fit first; disclosure and payout enter after, never before.'],
          ['Capture the asset', 'Route the click, capture the email, and package the workflow into a product path.'],
        ].map(([title, body]) => (
          <div key={title} className="card motion-reveal">
            <div className="text-sm font-semibold text-gold">{title}</div>
            <p className="mt-3 text-sm leading-6 text-muted">{body}</p>
          </div>
        ))}
      </div>

      <ol className="mt-10 space-y-6">
        {[
          { t: 'Pick one tool category you actually use', d: 'Voice, video, writing, coding — whatever you have real opinions about. Authentic beats broad. You can only recommend honestly what you\'ve touched.' },
          { t: 'Write the comparison in the citable shape', d: 'Direct answer up top, sortable table, the genuine pick, a real FAQ. That structure is what ranks and what AI search engines lift verbatim.' },
          { t: 'Place recurring-payer links, then build the list', d: 'Link the tools that pay every month — not one-time bounties. Add one email capture. Now every reader is either income or a future relationship.' },
        ].map((s, i) => (
          <li key={s.t} className="flex gap-4 rounded-xl border border-border glass p-5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent/15 font-bold text-accent">{i + 1}</span>
            <div>
              <div className="font-semibold text-ink">{s.t}</div>
              <p className="mt-1 text-sm text-muted">{s.d}</p>
            </div>
          </li>
        ))}
      </ol>

      <h2 className="mt-14 text-2xl font-bold text-ink">The recurring-payer shortlist</h2>
      <p className="mt-2 max-w-2xl text-muted">The programs worth building around, ranked by fit and recurring potential. The point is not to chase payout; it is to route trust where it belongs.</p>
      <div className="mt-6 overflow-hidden rounded-xl border border-border glass">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-muted">
            <th className="px-4 py-3">Tool</th><th className="px-4 py-3">Commission</th><th className="px-4 py-3">Recurring</th>
          </tr></thead>
          <tbody>
            {top.map((p) => (
              <tr key={p.tool} className="border-t border-border">
                <td className="px-4 py-3 font-semibold text-ink">{p.tool}</td>
                <td className="px-4 py-3 text-ink">{p.commission}</td>
                <td className="px-4 py-3 text-muted">{p.recurring}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10">
        <Link href="/blog" className="font-medium text-accent hover:underline">See the comparisons in action</Link>
        <span className="mx-3 text-muted/40">·</span>
        <Link href="/delivery/starter-kit" className="font-medium text-accent hover:underline">Open the starter kit</Link>
        <span className="mx-3 text-muted/40">·</span>
        <Link href="/offers" className="font-medium text-accent hover:underline">Inspect the paid systems</Link>
      </div>

      <EmailCapture headline="Want the build order as a checklist?" sub="Get the step-by-step path and top recurring shortlist. No noise." />
    </div>
  )
}
