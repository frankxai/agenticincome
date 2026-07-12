import type { Metadata } from 'next'
import Link from 'next/link'
import { PackTerminal } from '@/components/PackTerminal'

export const metadata: Metadata = {
  title: 'The /ai pack — Income Architect for Claude Code, Codex, and beyond',
  description:
    'Install /ai: five staged commands, four specialist agents, four skills. Assess your capability, architect your income model, design the offer, ship it, operate it — with written artifacts at every stage.',
  alternates: { canonical: '/pack' },
  openGraph: { url: '/pack' },
}

const STAGES = [
  ['/ai assess', 'Audits your skills, sites, socials, and assets into a leverage read — where proof and distribution already overlap.', 'income/00-capability-inventory.md'],
  ['/ai architect', 'Picks your income model from your real constraints and writes the full business plan. Every number a labeled scenario; every plan carries a kill criterion.', 'income/01-income-architecture.md'],
  ['/ai offer', 'Designs the offer, outcome-anchored pricing, scope armor, and the agent team that delivers it.', 'income/02-offer.md'],
  ['/ai ship', 'Landing copy, merchant-of-record checkout, launch runbook — self-service end to end, earned channels only.', 'income/03-launch-runbook.md'],
  ['/ai operate', 'The weekly loop: numbers, delivery QA, freshness check, kill-criteria verdict, one experiment.', 'income/weekly/YYYY-WW.md'],
] as const

const TEAM = [
  ['income-architect', 'Lead strategist — model selection, honest economics, kill criteria.'],
  ['offer-strategist', 'Pricing and packaging — outcome anchors, scope armor, real objections.'],
  ['delivery-engineer', 'Fulfillment systems — agent teams, quality gates, runbooks that run without their author.'],
  ['proof-writer', 'The voice — landing pages and cases that pass both gates: engineer respect, FTC yawn.'],
] as const

export default function PackPage() {
  return (
    <>
      <section className="section-band pt-20">
        <div className="section-heading motion-reveal">
          <div className="kicker text-[color:var(--color-accent)]">The pack · open machinery · MIT</div>
          <h1 className="display-h2 !text-[clamp(2.2rem,4.5vw,3.4rem)]">
            <span className="font-mono text-[0.85em] text-[color:var(--color-accent)]">/ai</span> — the Income Architect
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[color:var(--color-muted)]">
            A staged build of your income system, run by an agent team in your own terminal and
            repo. Not a course you watch — machinery that interviews you, writes artifacts, and
            holds you to your own kill criteria.
          </p>
        </div>
      </section>

      <PackTerminal />

      <section className="section-band">
        <div className="section-heading motion-reveal">
          <div className="kicker">The five stages</div>
          <h2 className="display-h2">Every stage ends in a written artifact.</h2>
        </div>
        <div className="mt-8 motion-reveal">
          {STAGES.map(([cmd, desc, artifact]) => (
            <div key={cmd} className="kb-row !grid-cols-[8.5rem_1fr] sm:!grid-cols-[8.5rem_1fr_auto]">
              <span className="font-mono text-sm text-[color:var(--color-accent)]">{cmd}</span>
              <span>
                <span className="kb-desc !mt-0 !text-[0.95rem] !text-[color:var(--color-ink)]">{desc}</span>
              </span>
              <span className="kchip hidden sm:inline-block">{artifact}</span>
            </div>
          ))}
        </div>
        <p className="motion-reveal mt-6 max-w-3xl text-sm leading-relaxed text-[color:var(--color-muted)]">
          Doctrine, non-negotiable: no income promises — economics are ranges with named
          assumptions. One offer, one product, one stream at a time. Honest costs on everything.
          Disclosure by default. If it lives only in a chat, it doesn’t exist.
        </p>
      </section>

      <section className="section-band">
        <div className="section-heading motion-reveal">
          <div className="kicker">The team inside</div>
          <h2 className="display-h2">Four specialists, one quality floor.</h2>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {TEAM.map(([name, desc]) => (
            <div key={name} className="card motion-reveal">
              <div className="font-mono text-sm text-[color:var(--color-accent-2)]">{name}</div>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-muted)]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-band">
        <div className="section-heading motion-reveal">
          <div className="kicker">Runtimes</div>
          <h2 className="display-h2">Claude Code first. Portable everywhere.</h2>
          <p className="mt-4 max-w-2xl text-[color:var(--color-muted)]">
            The richest experience is the Claude Code plugin — one-command install, subagent
            fan-out, scheduled loops. The pack’s intelligence is plain markdown, so Codex, Gemini
            CLI, Cursor, and OpenCode run the full system via the{' '}
            <a
              className="text-[color:var(--color-accent)] underline underline-offset-2"
              href="https://github.com/frankxai/agenticincome/blob/main/packs/PORTABLE.md"
              rel="noopener"
            >
              portable guide
            </a>
            . Runtimes churn quarterly; your income architecture shouldn’t.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="https://github.com/frankxai/agenticincome" rel="noopener" className="cta">
              Get the pack on GitHub
            </a>
            <Link href="/start" className="cta-secondary">
              Start with the free kit
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
