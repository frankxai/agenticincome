import type { Metadata } from 'next'
import Link from 'next/link'
import { payingPrograms } from '@/lib/affiliate'
import { TrackOnView } from '@/components/TrackOnView'

export const metadata: Metadata = {
  title: 'Starter Kit Delivery',
  description: 'The Agentic Income first-loop starter kit: choose a category, write the comparison, route the payer, and capture the audience.',
  robots: { index: false, follow: false },
}

const sprint = [
  ['00-05', 'Choose a category', 'Pick one tool category you have real experience with and where people already compare options.'],
  ['05-12', 'Name the question', 'Write the exact query the page will answer: best X for Y, X vs Y, or is X worth it.'],
  ['12-20', 'Draft the answer shape', 'Short answer, comparison table, honest pick, alternatives, FAQ, disclosure.'],
  ['20-25', 'Route the payer', 'Map the honest winner to the catalog and only add a paid route when it fits.'],
  ['25-30', 'Capture the next step', 'Add one email promise that helps the reader finish the same workflow.'],
]

export default function StarterKitDelivery() {
  const programs = payingPrograms().slice(0, 6)

  return (
    <div className="py-16">
      <TrackOnView event="delivery_view" payload={{ offer: 'starter-kit', source: 'delivery-page' }} />
      <section className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
        <div>
          <div className="kicker">Delivery</div>
          <h1 className="mt-3 max-w-4xl text-5xl font-semibold leading-[1.02] text-ink">Income Flywheel Starter Kit</h1>
          <p className="mt-5 max-w-3xl text-xl leading-8 text-muted">
            Use this to build the first loop: one comparison, one honest recommendation, one recurring-payer route, and one owned-audience capture.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="/downloads/agentic-income-starter-kit.md" className="cta" download>
              Download markdown kit
            </a>
            <Link href="/offers/blueprint" className="cta-secondary">
              Upgrade to Blueprint
            </Link>
          </div>
        </div>

        <aside className="rounded-2xl border border-border bg-surface/80 p-5">
          <div className="text-sm font-semibold text-gold">First win</div>
          <p className="mt-3 text-sm leading-6 text-muted">
            By the end of this kit, you should know what page to publish first, which payer route belongs behind it, and what the email capture should promise.
          </p>
        </aside>
      </section>

      <section className="section-band">
        <div className="section-heading motion-reveal">
          <div className="kicker">30-minute sprint</div>
          <h2>Turn intent into a page plan.</h2>
          <p>Do the smallest complete loop before adding more tools, products, or automation.</p>
        </div>
        <div className="mt-8 grid gap-3">
          {sprint.map(([time, title, body]) => (
            <div key={time} className="rounded-xl border border-border bg-surface/70 p-4 motion-reveal">
              <div className="grid gap-4 md:grid-cols-[5rem_14rem_1fr] md:items-start">
                <div className="font-mono text-sm font-semibold text-accent">{time}</div>
                <div className="font-semibold text-ink">{title}</div>
                <p className="text-sm leading-6 text-muted">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-band">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="kicker">Recurring shortlist</div>
            <h2 className="mt-3 text-4xl font-semibold text-ink">Build around programs that can compound.</h2>
            <p className="mt-4 text-muted">
              This shortlist comes from the same catalog powering the site. Verify terms before publishing because affiliate programs change.
            </p>
          </div>
          <div className="overflow-hidden rounded-xl border border-border bg-surface/80">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted">
                  <th className="px-4 py-3">Tool</th>
                  <th className="px-4 py-3">Commission</th>
                  <th className="px-4 py-3">Recurring</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((program) => (
                  <tr key={program.tool} className="border-t border-border">
                    <td className="px-4 py-3 font-semibold text-ink">{program.tool}</td>
                    <td className="px-4 py-3 text-ink">{program.commission}</td>
                    <td className="px-4 py-3 text-muted">{program.recurring}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ['Trust rule', 'Best fit first. Payout second. If the recommendation cannot survive disclosure, remove it.'],
            ['Page shape', 'Short answer, comparison table, honest pick, alternatives, FAQ, disclosure, next step.'],
            ['Upgrade path', 'When the first loop is clear, install the Blueprint so every future comparison follows the same desk.'],
          ].map(([title, body]) => (
            <div key={title} className="card motion-reveal">
              <div className="text-sm font-semibold text-gold">{title}</div>
              <p className="mt-3 text-sm leading-6 text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
