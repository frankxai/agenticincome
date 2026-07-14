import type { Metadata } from 'next'
import Link from 'next/link'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Onboarding Wizard | Trinity Earn Stage',
  description: 'Interactive onboarding wizard for the Trinity Income Portfolio. Progress from Explorer to Shaper with exportable skills, public-trust proofs, and marketplace mechanics.',
  alternates: { canonical: '/onboarding' },
}

const stages = [
  { id: 'explorer', label: 'Explorer', desc: 'Discover income streams, map your first node. Free 7-Day Challenge entry.' },
  { id: 'builder', label: 'Builder', desc: 'Build your first live page, join programs, track clicks. Exportable skill packs.' },
  { id: 'operator', label: 'Operator', desc: 'Run daily loops, optimize with meta-agents. Public-trust proofs published.' },
  { id: 'shaper', label: 'Shaper', desc: 'High-ticket retainers ($2-5k/mo), marketplace listings, portfolio orchestration.' },
]

export default function OnboardingWizard() {
  return (
    <div className="py-16 max-w-5xl mx-auto">
      <div className="kicker">Trinity Earn • Interactive</div>
      <h1 className="mt-3 text-5xl font-semibold tracking-tighter text-ink">Onboarding Wizard</h1>
      <p className="mt-4 max-w-3xl text-xl text-muted">
        Step into the Trinity Income Portfolio. Progress through Explorer → Shaper. Every stage includes exportable skills, public-trust proofs, and absorption of marketplace mechanics for Agentic Agency retainers ($2-5k/mo).
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {stages.map((stage, idx) => (
          <div key={stage.id} className="card glass p-8 motion-reveal border border-border">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-accent/10 text-accent font-mono flex items-center justify-center text-sm font-bold">{idx + 1}</div>
              <div className="text-2xl font-semibold text-ink">{stage.label}</div>
            </div>
            <p className="mt-4 text-muted leading-relaxed">{stage.desc}</p>
            <div className="mt-6">
              <Link href={idx === 0 ? "/challenge" : idx === 3 ? "/marketplace" : "/discovery"} className="cta text-sm">
                Enter {stage.label} Stage
              </Link>
            </div>
            <div className="mt-4 text-xs text-muted">Exportable skill: {stage.id}-skills.md • Trust proof: /trust</div>
          </div>
        ))}
      </div>

      <section className="mt-16 section-band">
        <div className="section-heading">
          <div className="kicker">Lead Magnet</div>
          <h2>Start with the 7-Day Challenge</h2>
          <p>One real action per day. Evergreen. No income claims. Real numbers published including zeros.</p>
        </div>
        <div className="mt-6">
          <Link href="/challenge" className="cta">Begin the Challenge →</Link>
        </div>
      </section>

      <section className="mt-12 text-sm text-muted">
        <p>Trinity branding absorbed: Marketplace mechanics for retainers, public-trust proofs at every stage, progression to Shaper with exportable skills. All changes pushed to main production e2e.</p>
      </section>
    </div>
  )
}
