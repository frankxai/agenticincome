import type { Metadata } from 'next'
import { baseOpenGraph } from '@/lib/open-graph'
import Link from 'next/link'
import { payingPrograms } from '@/lib/affiliate'
import { EmailCapture } from '@/components/EmailCapture'
import { OperatorFitCheck } from '@/components/OperatorFitCheck'

export const metadata: Metadata = {
  title: 'Start Here',
  description: 'The 3-step path to building an income system with AI agents: what to build, in what order, and how to verify each loop.',
  alternates: { canonical: '/start' },
  openGraph: {
    ...baseOpenGraph,
    title: 'Start Here',
    description: 'The 3-step path to building an income system with AI agents: what to build, in what order, and how to verify each loop.',
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
        You do not need a finished product to begin. Start with one question you can answer from firsthand experience,
        document the tradeoffs, and give readers an honest next step they can verify for themselves.
      </p>

      <ol className="mt-8 space-y-6">
        {[
          { t: 'Pick one tool category you actually use', d: 'Voice, video, writing, or coding: choose a workflow where you have real firsthand opinions. You can only recommend honestly what you have tested.' },
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

      <div className="mt-12">
        <OperatorFitCheck />
      </div>

      <h2 className="mt-14 text-2xl font-bold text-ink">The recurring-payer shortlist</h2>
      <p className="mt-2 max-w-2xl text-muted">Commission terms and recurring length for six programs, as listed in the partner data.</p>
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
