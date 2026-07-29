import { getLaunchReadiness } from '@/lib/readiness'
import { WaitlistForm } from '@/components/WaitlistForm'

const fitSignals = [
  'You can name a real buyer and a workflow with meaningful friction.',
  'You have domain judgment, buyer access, an audience, or an existing service.',
  'You are willing to keep pricing, contracts, production, and money human-approved.',
  'You want an owned operating asset—not a generic automation demo.',
] as const

export function WaitlistPanel({ source = 'outcome-pack-lab' }: { source?: string }) {
  const readiness = getLaunchReadiness()

  return (
    <div className="waitlist-shell">
      <aside className="waitlist-fit">
        <div className="panel-label">Designed for a small founding cohort</div>
        <h2>Bring one workflow worth governing.</h2>
        <p>
          The Outcome Pack Lab is a coming-soon working cohort for turning one real customer job
          into a buyer, outcome, offer, workflow, authority map, eval plan, and evidence contract.
        </p>
        <ul>
          {fitSignals.map((signal) => <li key={signal}>{signal}</li>)}
        </ul>
        <div className="waitlist-not-fit">
          <strong>Not a fit:</strong> anonymous “make money with AI” ideas, income guarantees,
          mass cold outreach, autonomous financial actions, or workflows no participant can judge.
        </div>
      </aside>

      <div className="waitlist-intake">
        <div className="waitlist-intake-header">
          <span className="panel-label">Outcome Pack Lab · coming soon</span>
          <span data-state={readiness.captureMode}>
            {readiness.captureMode === 'unwired' ? 'Intake offline' : 'Applications open'}
          </span>
        </div>
        <WaitlistForm captureMode={readiness.captureMode} source={source} />
      </div>
    </div>
  )
}
