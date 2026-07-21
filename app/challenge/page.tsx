import type { Metadata } from 'next'
import Link from 'next/link'
import { challengeDays } from '@/lib/challenge'
import { FaqSection } from '@/components/FaqSection'

export const metadata: Metadata = {
  title: 'The 7-Day Agentic Income Challenge',
  description:
    'A free, evergreen seven-day path from one buyer problem to a validated, principal-owned Outcome Pack using the public Agentic Income skill.',
  alternates: { canonical: '/challenge' },
  openGraph: {
    title: 'The 7-Day Agentic Income Challenge',
    description:
      'One concrete artifact a day using the public operating contract. A reviewable Outcome Pack by day seven — no income claims.',
    url: '/challenge',
  },
}

const faqs = [
  {
    q: 'Will I make money doing this?',
    a: 'No. The challenge improves the quality of a business test; it does not create demand or guarantee a result. Whether the system earns depends on the buyer, offer, delivery, market, evidence, and continued human work.',
  },
  {
    q: 'Is it actually free?',
    a: 'Yes. The operating skill, schema, validator, scaffold, and reference system are MIT-licensed in a public repository. No account, card, customer data, or private credential is required.',
  },
  {
    q: 'How much time does each day take?',
    a: 'Fifteen to thirty minutes for most days. The whole design is one small, concrete, real action per day — a written artifact, not a lecture.',
  },
  {
    q: 'What if I fall behind or start late?',
    a: 'It is evergreen — it starts the day you begin and runs at your own pace. There is no cohort, no deadline, and no penalty for taking day four on day nine instead.',
  },
  {
    q: 'Do I need to already know how to code?',
    a: 'You need Node.js 20 or newer for the validator and scaffold. A capable coding agent helps, but the contracts are readable and the reference system can be inspected without handing an agent unrestricted authority.',
  },
]

export default function ChallengePage() {
  return (
    <>
      <section className="section-band pt-20">
        <div className="section-heading motion-reveal">
          <div className="kicker text-[color:var(--color-accent)]">Free · evergreen · public MIT contract</div>
          <h1 className="display-h2 !text-[clamp(2.2rem,4.5vw,3.4rem)]">
            The 7-Day <span className="text-[color:var(--color-accent)]">Agentic Income</span> Challenge
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[color:var(--color-muted)]">
            Seven days, one reviewable artifact each day: buyer, principal, accepted outcome,
            Outcome Pack, authority model, validation evidence, and one operating decision. You
            finish with a serious business test in your own repository—not an income prediction.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/pack" className="cta">
              Open the operating skill
            </Link>
            <Link href="/start" className="cta-secondary">
              Use the capability map
            </Link>
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="section-heading motion-reveal">
          <div className="kicker">What you build, day by day</div>
          <h2 className="display-h2">Seven small, real steps. No teaching-only days.</h2>
          <p>Every day ends in a visible artifact — something that exists, not just something you read.</p>
        </div>

        <ol className="mt-8 space-y-3">
          {challengeDays.map((d) => (
            <li key={d.day} className="card motion-reveal flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-[color:var(--color-surface-2)] font-mono text-sm font-bold text-[color:var(--color-accent)]">
                {String(d.day).padStart(2, '0')}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-display text-lg font-bold text-[color:var(--color-ink)]">{d.title}</h3>
                  {d.command ? (
                    <span className="kchip font-mono !text-[color:var(--color-accent)]">{d.command}</span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-muted)]">{d.action}</p>
                <Link
                  href={d.href}
                  rel={d.href.startsWith('http') ? 'noopener' : undefined}
                  className="mt-3 inline-block text-xs font-semibold text-[color:var(--color-accent)] underline underline-offset-2"
                >
                  {d.hrefLabel} →
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="section-band max-w-3xl">
        <div className="section-heading motion-reveal">
          <div className="kicker">The one rule</div>
          <h2 className="display-h2">Agents prepare. An authorized principal commits.</h2>
          <p>
            Research, triage, drafts, tests, and evidence gathering can run automatically. Pricing,
            contracts, public income claims, production promotion, customer sends, credential
            grants, and movement of money require explicit authority and an auditable approval. Read the{' '}
            <Link href="/trust" className="text-[color:var(--color-accent)] underline underline-offset-2">
              trust standard
            </Link>{' '}
            for the complete boundary.
          </p>
        </div>
      </section>

      <section className="conversion-band motion-reveal">
        <div>
          <div className="kicker">No email gate</div>
          <h2 className="display-h2">Start the full challenge now.</h2>
          <p>
            The full operating contract, schema, validator, scaffold, and Request-to-Quote reference
            system are public. Clone them, inspect them, and keep the resulting system in your repo.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
          <a href="https://github.com/frankxai/agentic-income-skills" target="_blank" rel="noopener noreferrer" className="cta">
            Open the public repository
          </a>
          <Link href="/pack" className="cta-secondary">
            See what ships
          </Link>
        </div>
      </section>

      <FaqSection items={faqs} />
    </>
  )
}
