import type { Metadata } from 'next'
import { baseOpenGraph } from '@/lib/open-graph'
import { brandPillars, designTokens, motionSystem, qualityGate, swarmLeads } from '@/lib/design'

export const metadata: Metadata = {
  title: 'Design System',
  description: 'The Agentic Income design, motion, and trust operating system.',
  alternates: { canonical: '/design' },
  openGraph: {
    ...baseOpenGraph,
    title: 'Design System',
    description: 'The Agentic Income design, motion, and trust operating system.',
    url: '/design',
  },
}

const scores = [
  ['First read', 96],
  ['Trust proof', 94],
  ['Motion restraint', 92],
  ['Revenue clarity', 97],
]

export default function DesignSystemPage() {
  return (
    <div className="py-16">
      <section className="border-b border-border pb-14">
        <div className="kicker">Design operating system</div>
        <h1 className="mt-4 max-w-4xl text-5xl font-semibold leading-[0.98] text-ink sm:text-7xl">
          The system has to look as trustworthy as it behaves.
        </h1>
        <p className="mt-6 max-w-3xl text-xl leading-relaxed text-muted">
          Agentic Income uses design as proof: the recommendation model is visible, the catalog is inspectable, and motion only makes compounding easier to understand.
        </p>
      </section>

      <section className="section-band">
        <div className="section-heading motion-reveal">
          <div className="kicker">Brand pillars</div>
          <h2>Pragmatic, premium, and accountable.</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {brandPillars.map((pillar) => (
            <div key={pillar.title} className="card motion-reveal">
              <div className="text-sm font-semibold text-gold">{pillar.title}</div>
              <p className="mt-3 text-sm leading-6 text-muted">{pillar.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-band">
        <div className="section-heading motion-reveal">
          <div className="kicker">Tokens</div>
          <h2>Dark desk, signal color, restrained wealth.</h2>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {Object.entries(designTokens.color).map(([name, value]) => (
            <div key={name} className="rounded-xl border border-border bg-surface p-4 motion-reveal">
              <div className="h-14 rounded-lg border border-white/10" style={{ background: value }} />
              <div className="mt-3 font-mono text-xs text-muted">{name}</div>
              <div className="mt-1 font-mono text-sm text-ink">{value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-band">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="section-heading motion-reveal">
            <div className="kicker">Motion</div>
            <h2>{motionSystem.thesis}</h2>
            <p>Motion is a proof layer. It connects cause and effect without hiding controls, delaying reading, or making meaning motion-only.</p>
          </div>
          <div className="grid gap-3">
            {motionSystem.modes.map((mode) => (
              <div key={mode} className="card motion-reveal">
                <div className="text-sm font-semibold text-ink">{mode}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="section-heading motion-reveal">
          <div className="kicker">Council</div>
          <h2>The swarm has named authority.</h2>
          <p>Each role owns a distinct decision surface so taste, conversion, motion, and release quality do not blur together.</p>
        </div>
        <div className="mt-8 grid gap-3 md:grid-cols-4">
          {swarmLeads.map((lead) => (
            <div key={lead} className="rounded-xl border border-border bg-surface/80 p-4 text-sm font-semibold text-ink motion-reveal">
              {lead}
            </div>
          ))}
        </div>
      </section>

      <section className="section-band">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="kicker motion-reveal">Quality gate</div>
            <h2 className="mt-3 text-4xl font-semibold text-ink motion-reveal">Ship only when the artifact proves it.</h2>
            <div className="mt-8 space-y-4">
              {scores.map(([label, value]) => (
                <div key={label} className="motion-reveal">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-ink">{label}</span>
                    <span className="font-mono text-muted">{value}/100</span>
                  </div>
                  <div className="meter-track">
                    <div className="meter-fill" data-meter-fill style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-3">
            {qualityGate.map((item) => (
              <div key={item} className="card motion-reveal">
                <p className="text-sm leading-6 text-muted">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
