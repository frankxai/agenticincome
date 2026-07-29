import type { Metadata } from 'next'
import Link from 'next/link'
import { WaitlistPanel } from '@/components/WaitlistPanel'

export const metadata: Metadata = {
  title: 'Outcome Pack Lab Waitlist',
  description:
    'Apply to the selective founding Outcome Pack Lab with one real buyer problem and a workflow you can judge.',
  alternates: { canonical: '/waitlist' },
  openGraph: {
    title: 'Outcome Pack Lab · Coming Soon',
    description: 'Turn one real customer job into a governed, principal-owned Outcome Pack.',
    url: '/waitlist',
  },
}

export default function WaitlistPage() {
  return (
    <>
      <section className="section-band pt-20">
        <div className="max-w-4xl">
          <div className="kicker">Selective founding cohort · coming soon</div>
          <h1 className="mt-3 text-5xl font-semibold leading-[1.02] text-ink sm:text-6xl">
            Build one Outcome Pack with people who can judge the work.
          </h1>
          <p className="mt-5 max-w-3xl text-xl leading-8 text-muted">
            The Lab is for accountable founders and experts bringing one real buyer problem—not
            spectators collecting agent ideas. Start free first; apply only when you can name the
            workflow, the customer, and what good looks like.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/start" className="cta">Start the free Field Guide</Link>
            <Link href="/proof" className="cta-secondary">Read the evidence standard</Link>
          </div>
        </div>
      </section>

      <section className="section-band" aria-label="Outcome Pack Lab application">
        <WaitlistPanel />
      </section>
    </>
  )
}
