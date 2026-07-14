import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Discovery Hub | Trinity Income Portfolio',
  description: 'Discovery hub for Trinity Earn stage. Explore income streams, exportable skills, manager agents, DePIN nodes, MCP integrations, and Agentic Agency opportunities. Stage progression with public-trust proofs.',
  alternates: { canonical: '/discovery' },
}

const discoveries = [
  { category: 'Income Streams', items: ['Generative Royalty Farm', 'LoL Coaching Swarm', 'Style Agent Subscriptions', 'Esports Org Swarm'] },
  { category: 'Exportable Skills', items: ['agentic-passive-income', 'trinity-income-router', '6pillar-guardian-factory', 'multi-brand-content-repurposing'] },
  { category: 'Manager Agents', items: ['Meta-Income-Optimizer', 'Income-Swarm-Orchestrator', 'Trinity Router', 'Starlight Queen'] },
  { category: 'DePIN / MCP', items: ['Base/Immutable nodes', 'Composio connectors', 'Hermes MCP servers', 'On-chain royalty tracking'] },
  { category: 'Marketplace Mechanics', items: ['Retainer listings ($2-5k/mo)', 'Lead magnet graduates', 'Public-trust proofs', 'Stage badges (Explorer→Shaper)'] },
]

export default function DiscoveryHub() {
  return (
    <div className="py-16 max-w-6xl mx-auto">
      <div className="kicker">Trinity Earn • Open</div>
      <h1 className="mt-3 text-5xl font-semibold tracking-tighter">Discovery Hub</h1>
      <p className="mt-4 max-w-3xl text-xl text-muted">
        Explore the full Trinity Income Portfolio. Discover streams, skills, agents, and marketplace opportunities. Every entry carries public-trust proofs and exportable artifacts. Progress your stage.
      </p>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {discoveries.map((d, i) => (
          <div key={i} className="card p-8 border border-border glass">
            <div className="font-semibold text-gold text-sm tracking-widest">{d.category}</div>
            <ul className="mt-4 space-y-3 text-sm">
              {d.items.map((item, ii) => (
                <li key={ii} className="flex items-start gap-3">
                  <span className="text-accent mt-1">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <section className="mt-16 section-band">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="kicker">Next Step</div>
            <h2>Ready to progress?</h2>
            <p className="text-muted">Complete the 7-Day Challenge → Onboarding Wizard → Retainer Marketplace.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/challenge" className="cta-secondary">7-Day Challenge</Link>
            <Link href="/onboarding" className="cta">Onboarding Wizard</Link>
            <Link href="/marketplace" className="cta">Marketplace</Link>
          </div>
        </div>
      </section>

      <div className="mt-12 text-xs text-muted text-center">
        Trinity branding: Marketplace mechanics absorbed • Public-trust proofs at every discovery • Stage progression Explorer to Shaper • Exportable skills from agentic-passive-income + trinity-income-router.
      </div>
    </div>
  )
}
