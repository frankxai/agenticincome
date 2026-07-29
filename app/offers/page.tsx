import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Choose Your Outcome Pack Path',
  description: 'Start with the free Field Guide, apply to the selective Outcome Pack Lab, or inspect a scope-first Outcome Pack Build Sprint.',
  alternates: { canonical: '/offers' },
  openGraph: {
    title: 'Agentic Income paths',
    description: 'Free value first. Selective cohort next. Scope-first implementation only when useful.',
    url: '/offers',
  },
}

const paths = [
  {
    number: '01',
    state: 'Free · live now',
    title: 'Agentic Income Field Guide',
    description: 'Map a buyer, choose the right income path, understand the six-part Outcome Pack, and run the public scaffold and validator.',
    includes: ['30-minute opportunity map', 'Service, product, and research paths', 'Verified public commands', 'No email or payment gate'],
    href: '/start',
    cta: 'Start free',
    featured: true,
  },
  {
    number: '02',
    state: 'Selective · coming soon',
    title: 'Outcome Pack Lab',
    description: 'A small working cohort for accountable operators who bring one real buyer problem and a workflow they can judge.',
    includes: ['Buyer and outcome contract', 'Authority and eval design', 'Peer review around real work', 'No guaranteed place or result'],
    href: '/waitlist',
    cta: 'Inspect the founding waitlist',
    featured: false,
  },
  {
    number: '03',
    state: 'Commercial · scope first',
    title: 'Outcome Pack Build Sprint',
    description: 'A bounded implementation for one accepted customer outcome, delivered in principal-owned accounts and source with a verification bundle.',
    includes: ['Outcome Pack contract', 'Governed workflow implementation', 'Preview and quality gates', 'Runbook, evidence, and handoff'],
    href: '/offers/implementation-sprint',
    cta: 'Inspect the build scope',
    featured: false,
  },
] as const

export default function Offers() {
  return (
    <>
      <section className="section-band pt-20">
        <div className="max-w-4xl">
          <div className="kicker">One method · three depths</div>
          <h1 className="mt-3 text-5xl font-semibold leading-[1.02] text-ink sm:text-6xl">
            Get the method before you consider buying the build.
          </h1>
          <p className="mt-5 max-w-3xl text-xl leading-8 text-muted">
            The Field Guide is the complete first step. The Lab is selective and coming soon. The
            Build Sprint is for a specific accepted outcome—not open-ended consulting.
          </p>
        </div>
      </section>

      <section className="section-band" aria-label="Agentic Income product paths">
        <div className="offer-lanes">
          {paths.map((path) => (
            <article key={path.number} className="offer-lane" data-featured={path.featured || undefined}>
              <div className="offer-lane-number">{path.number}</div>
              <div className="offer-lane-copy">
                <div className="panel-label">{path.state}</div>
                <h2>{path.title}</h2>
                <p>{path.description}</p>
                <ul>
                  {path.includes.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <Link href={path.href} className={path.featured ? 'cta' : 'cta-secondary'}>
                {path.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="conversion-band">
        <div>
          <div className="kicker">Commercial rule</div>
          <h2>Nothing is sold before the outcome is scoped.</h2>
          <p>
            No live checkout is required for this launch. Buyer, acceptance, authority, ownership,
            delivery, support, and commercial terms come before payment.
          </p>
        </div>
        <Link href="/trust" className="cta-secondary">Read the trust standard</Link>
      </section>
    </>
  )
}
