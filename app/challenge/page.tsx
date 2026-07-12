import type { Metadata } from 'next'
import Link from 'next/link'
import { getChallengeDays } from '@/lib/challenge'
import { EmailCapture } from '@/components/EmailCapture'
import { FaqSection } from '@/components/FaqSection'

export const metadata: Metadata = {
  title: 'The 7-Day Agentic Income Challenge',
  description:
    'A free, evergreen 7-day email challenge: one small, real build step a day, ending with a live income node and — if it works — your first honestly tracked click. No income claims.',
  alternates: { canonical: '/challenge' },
  openGraph: {
    title: 'The 7-Day Agentic Income Challenge',
    description:
      'A free, evergreen 7-day email challenge: one small, real build step a day, ending with a live income node and your first honestly tracked click. No income claims.',
    url: '/challenge',
  },
}

const faqs = [
  {
    q: 'Will I make money doing this?',
    a: 'No promises, and the challenge is built to say so honestly. Some people finish the week with a real tracked click; some finish with zero, which is a true and useful outcome, not a failure. You will have a live, real system either way — that part is not in doubt.',
  },
  {
    q: 'Is it actually free?',
    a: 'Yes. It is seven emails. No credit card, no "free trial" that bills you later, no upsell hidden inside day one.',
  },
  {
    q: 'How much time does each day take?',
    a: 'Fifteen to thirty minutes for most days. The whole design is one small, concrete, real action per day — not a lecture.',
  },
  {
    q: 'What if I fall behind or start late?',
    a: 'The challenge is evergreen — it starts the day you sign up and runs at your own pace. There is no cohort, no deadline, and no penalty for taking day 4 on day 9 instead.',
  },
  {
    q: 'Do I need to already know how to code?',
    a: 'No. Most days use free, no-code tools (a page builder, a doc, an affiliate dashboard). One optional day mentions a code-based template for people who want it — it is never required to finish the week.',
  },
]

export default function ChallengePage() {
  const days = getChallengeDays()

  return (
    <div className="py-16">
      <section className="max-w-4xl border-b border-border pb-14">
        <div className="kicker">Free · evergreen · email</div>
        <h1 className="mt-3 max-w-4xl break-words text-4xl font-semibold leading-[1.04] text-ink sm:text-5xl">
          Build your first honest AI-income node in a week.
        </h1>
        <p className="mt-5 text-xl leading-8 text-muted">
          Seven days, one small real action each day — a category, a joined program, a live page, an owned email
          list, and a first honestly tracked click. No &quot;$10k/mo passive&quot; claims. This network publishes
          its own real numbers, including the zeros.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/trust" className="cta-secondary">
            Read the trust standard first
          </Link>
          <Link href="/start" className="cta-secondary">
            Prefer to read the playbook now
          </Link>
        </div>
      </section>

      <section className="section-band">
        <div className="section-heading motion-reveal">
          <div className="kicker">What you build, day by day</div>
          <h2>Seven small, real steps. No teaching-only days.</h2>
          <p>Every day ends in a visible artifact — something that exists, not just something you learned.</p>
        </div>

        <ol className="mt-8 space-y-4">
          {days.map((d) => (
            <li key={d.day} className="flex gap-4 rounded-xl border border-border glass p-5 motion-reveal">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent/15 font-bold text-accent">
                {d.day}
              </span>
              <div>
                <div className="font-semibold text-ink">{d.title}</div>
                <p className="mt-1 text-sm text-muted">{d.teaser}</p>
                {d.ctaHref ? (
                  <Link href={d.ctaHref} className="mt-2 inline-block text-xs font-semibold text-accent hover:underline">
                    See the related walkthrough
                  </Link>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="section-band max-w-3xl">
        <div className="section-heading motion-reveal">
          <div className="kicker">The one rule</div>
          <h2>The recommendation has to work without the payout.</h2>
          <p>
            The challenge teaches the exact system this site runs on: best fit first, affiliate route second, every
            affiliate link disclosed in plain language before you reach it. See the full{' '}
            <Link href="/disclosure" className="text-accent">
              affiliate disclosure
            </Link>{' '}
            for the specifics.
          </p>
        </div>
      </section>

      <EmailCapture
        headline="Start the 7-day challenge"
        sub="One honest, concrete build step a day, by email. No income claims — just the next real thing to do."
        source="challenge"
        buttonLabel="Start Day 1"
        successMessage="You're in. Day 1 — pick your one category — is on its way."
      />

      <FaqSection items={faqs} />
    </div>
  )
}
