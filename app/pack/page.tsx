import type { Metadata } from 'next'
import Link from 'next/link'
import { PackTerminal } from '@/components/PackTerminal'

export const metadata: Metadata = {
  title: 'The Open Agentic Income Skill and Outcome Pack Contract',
  description:
    'Inspect and run the MIT-licensed operating contract, schema, validator, scaffold, and Request-to-Quote reference system for principal-owned agent services.',
  alternates: { canonical: '/pack' },
  openGraph: { url: '/pack' },
}

const STAGES = [
  ['discover', 'Map credible buyers, painful jobs, owned assets, evidence, and the narrowest opportunity worth validating.', 'opportunity brief'],
  ['validate', 'Test demand, delivery feasibility, honest economics, acceptance conditions, and explicit stop criteria.', 'validation record'],
  ['build', 'Create the offer, principal, workflow, interfaces, authority, evals, runbook, and evidence model.', 'Outcome Pack'],
  ['deliver', 'Run the workflow inside its authority boundary and collect acceptance evidence without fabricating customer proof.', 'delivery record'],
  ['operate · prove · improve', 'Review quality, economics, incidents, freshness, and the next bounded change.', 'operating decision'],
] as const

const TEAM = [
  ['Operating skill', 'Nine explicit modes: discover, validate, build, sell, deliver, operate, publish, prove, and improve.'],
  ['Open schema', 'A machine-readable contract for the system, authority model, evaluation, economics, and proof.'],
  ['Validator + scaffold', 'Executable checks and an owned copy of the reference Outcome Pack.'],
  ['Reference system', 'A complete Request-to-Quote desk with schemas, agent card, and human approval before commitments.'],
] as const

export default function PackPage() {
  return (
    <>
      <section className="section-band pt-20">
        <div className="section-heading motion-reveal">
          <div className="kicker text-[color:var(--color-accent)]">Open contract · portable skill · MIT</div>
          <h1 className="display-h2 !text-[clamp(2.2rem,4.5vw,3.4rem)]">
            <span className="font-mono text-[0.78em] text-[color:var(--color-accent)]">/agentic-income</span>
            {' '}— the Outcome Pack operating skill
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[color:var(--color-muted)]">
            A public operating contract for building principal-owned agent services in your own
            terminal and repository. It tells a coding agent what to produce, what evidence must
            exist, and which commitments remain human-gated.
          </p>
        </div>
      </section>

      <PackTerminal />

      <section className="section-band">
        <div className="section-heading motion-reveal">
          <div className="kicker">The operating modes</div>
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
          Non-negotiable: no guaranteed income, hidden affiliate routing, pooled funds, custody,
          unrestricted financial authority, or secrets in the manifest, Git, or model context.
          Prices, contracts, transfers, permission increases, and public income claims are human-gated.
        </p>
      </section>

      <section className="section-band">
        <div className="section-heading motion-reveal">
          <div className="kicker">What actually ships</div>
          <h2 className="display-h2">Contract, schema, executable checks, reference.</h2>
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
          <div className="kicker">Runtime portability</div>
          <h2 className="display-h2">Readable by people. Usable by capable coding agents.</h2>
          <p className="mt-4 max-w-2xl text-[color:var(--color-muted)]">
            The intelligence lives in Markdown, JSON Schema, JSON, and JavaScript rather than a
            proprietary runtime. Claude Code, Codex, Gemini CLI, Cursor, OpenCode, and future agents
            can inspect the same authority and quality contract. Start with the{' '}
            <a
              className="text-[color:var(--color-accent)] underline underline-offset-2"
              href="https://github.com/frankxai/agentic-income-skills/blob/main/skills/agentic-income/SKILL.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              public operating skill
            </a>
            . Runtime features may differ; the principal and evidence contract does not.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="https://github.com/frankxai/agentic-income-skills" target="_blank" rel="noopener noreferrer" className="cta">
              Open the public repository
            </a>
            <Link href="/start" className="cta-secondary">
              Map the right starting path
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
