import type { Metadata } from 'next'
import Link from 'next/link'
import { challengeDays } from '@/lib/challenge'
import { EmailCapture } from '@/components/EmailCapture'
import { FaqSection } from '@/components/FaqSection'

export const metadata: Metadata = {
  title: 'The 7-Day Agentic Income Challenge',
  description:
    'A free, evergreen 7-day path: one concrete build step a day using the /ai pack and the knowledge base — assess, pick a model, architect, ship, operate. Capability, never income claims.',
  alternates: { canonical: '/challenge' },
  openGraph: {
    title: 'The 7-Day Agentic Income Challenge',
    description:
      'One concrete build step a day using the /ai pack and the knowledge base. A live, real system by day seven — no income claims.',
    url: '/challenge',
  },
}

const faqs = [
  {
    q: 'Will I make money doing this?',
    a: 'No promises — the challenge is built to say so honestly. You will finish the week with a live, real system, which is the part that is not in doubt. Whether it earns is up to your market, your effort, and time. We market machinery and education, never outcomes.',
  },
  {
    q: 'Is it actually free?',
    a: 'Yes. The /ai pack is MIT-licensed and the knowledge base is public. No credit card, no “free trial” that bills you later, no upsell hidden inside day one. The paid products are depth and updates — never required to finish the week.',
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
    a: 'You need a terminal and a coding agent (Claude Code is the reference runtime; Codex, Gemini CLI, Cursor, and OpenCode run the pack too). The pack does the heavy lifting — it interviews you and writes the artifacts. You direct it.',
  },
]

export default function ChallengePage() {
  return (
    <>
      <section className="section-band pt-20">
        <div className="section-heading motion-reveal">
          <div className="kicker text-[color:var(--color-accent)]">Free · evergreen · MIT pack</div>
          <h1 className="display-h2 !text-[clamp(2.2rem,4.5vw,3.4rem)]">
            The 7-Day <span className="text-[color:var(--color-accent)]">Agentic Income</span> Challenge
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[color:var(--color-muted)]">
            Seven days, one small real action each day — assess your leverage, pick a model, architect the business,
            choose an honest stack, design the offer, write copy that passes both gates, then ship and operate. No
            “$10k/mo passive” claims. You end the week with a live, real system in your own terminal and repo.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/pack" className="cta">
              Get the /ai pack
            </Link>
            <Link href="/start" className="cta-secondary">
              Start with the free kit
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
          <h2 className="display-h2">The recommendation has to work without the payout.</h2>
          <p>
            The challenge teaches the exact system this site runs on: best fit first, affiliate route second, every
            compensated link disclosed in plain language before you reach it. See the full{' '}
            <Link href="/disclosure" className="text-[color:var(--color-accent)] underline underline-offset-2">
              affiliate disclosure
            </Link>{' '}
            for the specifics, or the{' '}
            <Link href="/trust" className="text-[color:var(--color-accent)] underline underline-offset-2">
              trust standard
            </Link>{' '}
            for how the recommendations get made.
          </p>
        </div>
      </section>

      <EmailCapture
        headline="Get the 7-Day Challenge Brief"
        sub="One honest, concrete build step a day, by email. No income claims — just the next real thing to do."
        source="challenge"
        buttonLabel="Start Day 1"
        successMessage="You’re in. Day 1 — assess your real leverage — is on its way."
      />

      <section className="section-band">
        <div className="section-heading motion-reveal">
          <div className="kicker">Prefer to move now?</div>
          <h2 className="display-h2">Skip the wait. Install the pack today.</h2>
          <p>
            The whole challenge is powered by the free /ai pack — five staged commands, four specialist agents,
            four skills. You can run Day 1 the moment it is installed.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="https://github.com/frankxai/agenticincome" rel="noopener" className="cta">
              Get the pack on GitHub
            </a>
            <Link href="/pack" className="cta-secondary">
              See how the pack works
            </Link>
          </div>
        </div>
      </section>

      <FaqSection items={faqs} />
    </>
  )
}
