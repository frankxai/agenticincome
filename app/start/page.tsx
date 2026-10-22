import type { Metadata } from 'next'
import { baseOpenGraph } from '@/lib/open-graph'
import Link from 'next/link'
import { payingPrograms } from '@/lib/affiliate'
import { Waitlist } from '@/components/Waitlist'

export const metadata: Metadata = {
  title: 'Start Here',
  description: 'The 3-step path to building an income system with AI agents — what to build, in what order, and why it compounds.',
  alternates: { canonical: '/start' },
  openGraph: {
    ...baseOpenGraph,
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
      <h1 className="mt-3 text-5xl font-semibold text-ink">Build the first revenue loop.</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        You do not need a finished product to begin. Start with one question you can answer from experience,
        document the tradeoffs, and give readers an honest next step they can choose to keep.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          ['Find the signal', 'Choose one tool category where people already compare, switch, and buy.'],
          ['Protect the trust', 'Write the answer so the useful recommendation survives disclosure and payout pressure.'],
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
          { t: 'Write the comparison in an inspectable shape', d: 'Lead with the answer, show the criteria, name the tradeoffs, date the evidence, and disclose any material incentive.' },
          { t: 'Offer a useful next step', d: 'Add a link only when it fits the recommendation. Offer an email or product path only when its delivery and data handling are clear.' },
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

      <Waitlist
        headline="Want to hear when the Blueprint opens?"
        sub="The build order above is the free path and stays free. Join the waitlist for one email when the paid Blueprint opens."
      />
    </div>
  )
}
