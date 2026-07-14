import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Retainer Marketplace | $2-5k/mo Agentic Agency',
  description: 'Trinity Earn Stage retainer marketplace. High-ticket Agentic Agency plays: $2,000–$5,000/mo retainers for manager agents, DePIN orchestration, MCP integration, and portfolio optimization. Public-trust proofs included.',
  alternates: { canonical: '/marketplace' },
}

const retainers = [
  {
    tier: 'Explorer Retainer',
    price: '$2,000/mo',
    desc: 'Weekly audits, skill export setup, first marketplace listing. 4-week onboarding to Builder.',
    features: ['Stage mapping', 'Exportable skills pack', 'Trust proof publication', 'Basic discovery hub access'],
    cta: 'Apply for Explorer',
  },
  {
    tier: 'Operator Retainer',
    price: '$3,500/mo',
    desc: 'Daily swarm orchestration, meta-optimizer, DePIN node management, MCP server integration. Public dashboard.',
    features: ['Full Trinity routing', 'Agentic Agency playbooks', 'Retainer marketplace UI', 'Weekly public-trust reports'],
    cta: 'Secure Operator Slot',
  },
  {
    tier: 'Shaper Retainer',
    price: '$5,000/mo',
    desc: 'Portfolio-level strategy, high-ticket deal flow, brand absorption, exportable skill factory. Full marketplace presence.',
    features: ['Shaper stage mastery', 'Manager agent delegation', 'DePIN + MCP production', 'Priority discovery + leads'],
    cta: 'Join as Shaper',
  },
]

export default function RetainerMarketplace() {
  return (
    <div className="py-16 max-w-6xl mx-auto">
      <div className="kicker">Trinity Earn • High-Ticket</div>
      <h1 className="mt-3 text-5xl font-semibold tracking-tighter">Retainer Marketplace</h1>
      <p className="mt-4 max-w-3xl text-xl text-muted">
        $2,000 – $5,000/mo Agentic Agency retainers. Manager agents, DePIN, MCP integration, Trinity portfolio optimization. Every listing includes public-trust proofs and exportable skills.
      </p>

      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {retainers.map((r, i) => (
          <div key={i} className="card p-8 flex flex-col border border-border glass">
            <div className="text-xs uppercase tracking-[2px] text-gold font-semibold">{r.tier}</div>
            <div className="mt-2 text-5xl font-semibold tabular-nums text-ink">{r.price}</div>
            <p className="mt-4 text-muted flex-1">{r.desc}</p>
            <ul className="mt-6 space-y-2 text-sm text-muted">
              {r.features.map((f, fi) => <li key={fi}>• {f}</li>)}
            </ul>
            <a href="#apply" className="cta mt-8 text-center">{r.cta}</a>
            <div className="mt-3 text-[10px] text-center text-muted">Public-trust proof • Exportable skills • Stage progression</div>
          </div>
        ))}
      </div>

      <section id="apply" className="mt-16 section-band max-w-2xl">
        <div className="section-heading">
          <div className="kicker">Apply</div>
          <h2>Secure your retainer slot</h2>
          <p>Submit interest. We review for fit, publish proof, and onboard via Trinity router. Marketplace mechanics fully absorbed.</p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Application submitted (demo). In production: wired to Stripe + Hermes profile creation.') }}>
          <input type="text" placeholder="Name / Agency" className="input w-full" required />
          <input type="email" placeholder="Email" className="input w-full" required />
          <select className="input w-full" required>
            <option>Explorer Retainer ($2k)</option>
            <option>Operator Retainer ($3.5k)</option>
            <option>Shaper Retainer ($5k)</option>
          </select>
          <textarea placeholder="Current stage, skills, goals (Explorer to Shaper)" className="input w-full h-32" required />
          <button type="submit" className="cta w-full">Submit Application → Review in 48h</button>
        </form>
        <p className="mt-4 text-xs text-muted">All retainers include exportable skills, public-trust proofs, and integration with discovery hub + 7-Day Challenge graduates.</p>
      </section>
    </div>
  )
}
