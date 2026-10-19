import type { Metadata } from 'next'
import { baseOpenGraph } from '@/lib/open-graph'
import Link from 'next/link'
import { payingPrograms } from '@/lib/affiliate'
import { trustPrinciples } from '@/lib/trust'
import { AffiliateDisclosure } from '@/components/AffiliateDisclosure'
import { FaqSection } from '@/components/FaqSection'

export const metadata: Metadata = {
  title: 'Affiliate Disclosure',
  description:
    'The full, honest affiliate disclosure for Agentic Income: how we choose tools, why the recommendation survives the incentive, and the live list of every program we can earn from — the same data file the site runs on.',
  alternates: { canonical: '/disclosure' },
  openGraph: {
    ...baseOpenGraph,
    title: 'Affiliate Disclosure',
    description:
      'How we choose tools, why the recommendation survives the incentive, and the live list of every program we can earn from.',
    url: '/disclosure',
  },
}

const LAST_UPDATED = 'July 12, 2026'

const SELECTION = [
  [
    'Recommended without the payout first',
    'A tool has to earn the recommendation on fit alone before any affiliate link is attached. If joining the program would change the answer, the answer was wrong — and the tool does not go in.',
  ],
  [
    'A non-affiliate alternative, always named',
    'Every recommendation names a credible alternative we earn nothing from. If that alternative is the better call for a segment of readers, we say so first, in the same breath.',
  ],
  [
    'Honest costs on the table',
    'Each tool carries its real price, its labor floor, and its failure modes. We would rather lose the click than hide the con that makes the click regrettable.',
  ],
  [
    'Hands-on or clearly labeled',
    'If we have used a tool, the artifact says so. If we have not, the evidence label reads “desk review.” The labels are part of the product, not fine print.',
  ],
] as const

const faqs = [
  {
    q: 'Do I pay more because a link is an affiliate link?',
    a: 'No. Affiliate pricing is identical to going direct — the same checkout, the same price, the same terms. The only difference is that the tool’s program credits Agentic Income for the referral.',
  },
  {
    q: 'Does a commission change which tool wins the recommendation?',
    a: 'No, and that is the whole doctrine. The recommendation has to work without the payout. If the honest answer is a tool with no affiliate program — or a competitor’s tool — that is what we recommend, and every recommendation names a non-affiliate alternative so you can check our work.',
  },
  {
    q: 'How do I know which specific links are affiliate links?',
    a: 'Every page that carries a compensated link shows the disclosure notice in plain language before you reach the link, and the links themselves route through our self-hosted go. redirector, which sends disclosure headers on every hop. Disclosure lives next to the link, never buried in a footer.',
  },
  {
    q: 'Which programs is Agentic Income actually enrolled in right now?',
    a: 'The table on this page is generated from data/programs.json — the same catalog that powers every “Try” button and payout label across the site. It is not a marketing highlight reel; it is the literal data file the site runs on.',
  },
  {
    q: 'Is this even legally required, or are you going further?',
    a: 'The law requires disclosing a material connection before the click. Our standard is stricter than the floor: we do not market income outcomes at all — only machinery and education — because the FTC’s Operation AI Comply treats AI-attached earnings claims as its highest-risk category. Honesty here is the compliance floor and the conversion strategy at once.',
  },
]

export default function DisclosurePage() {
  // Only programs with a routed link can pay today; unjoined or paused rows (ourLink null) stay on /tools.
  const active = payingPrograms().filter((program) => Boolean(program.ourLink))

  return (
    <>
      <section className="section-band pt-20">
        <div className="section-heading motion-reveal">
          <div className="kicker text-[color:var(--color-gold)]">Affiliate disclosure · updated {LAST_UPDATED}</div>
          <h1 className="display-h2 !text-[clamp(2.2rem,4.5vw,3.4rem)]">
            The recommendation is <span className="text-[color:var(--color-accent)]">never for sale.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[color:var(--color-muted)]">
            This page states plainly how Agentic Income makes money from the links on this site, exactly which
            recommendations that affects — none, by design — and how to verify any of it yourself. It is the full
            disclosure, not the minimum one.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/trust" className="cta">
              Read the trust standard
            </Link>
            <Link href="/tools" className="cta-secondary">
              Inspect the live catalog
            </Link>
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="section-heading motion-reveal">
          <div className="kicker">The disclosure itself</div>
          <h2 className="display-h2">Word for word, everywhere it applies.</h2>
          <p>This is the exact notice that appears on every page carrying an affiliate link. Nothing softer runs anywhere on the site.</p>
        </div>
        <div className="mt-4 max-w-3xl motion-reveal">
          <AffiliateDisclosure />
        </div>
      </section>

      <section className="section-band">
        <div className="section-heading motion-reveal">
          <div className="kicker">How we choose tools</div>
          <h2 className="display-h2">Fit is the gate. The payout comes after.</h2>
          <p>Four rules decide whether a tool is recommended at all — and none of them is “what pays best.”</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {SELECTION.map(([title, body]) => (
            <div key={title} className="card motion-reveal">
              <div className="text-sm font-semibold text-[color:var(--color-accent-2)]">{title}</div>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-muted)]">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-band">
        <div className="section-heading motion-reveal">
          <div className="kicker">The doctrine</div>
          <h2 className="display-h2">The recommendation survives the incentive.</h2>
          <p>
            Before any tool enters the registry with an affiliate link, it must already be the recommendation without
            one. The four principles below govern every surface on the site — the same ones on the{' '}
            <Link href="/trust" className="text-[color:var(--color-accent)] underline underline-offset-2">trust standard</Link>.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustPrinciples.map((principle) => (
            <div key={principle.title} className="card motion-reveal">
              <div className="text-sm font-semibold text-[color:var(--color-gold)]">{principle.title}</div>
              <p className="mt-3 text-sm leading-6 text-[color:var(--color-muted)]">{principle.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-band">
        <div className="section-heading motion-reveal">
          <div className="kicker">The legal floor — and past it</div>
          <h2 className="display-h2">Stricter than the law asks.</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="card motion-reveal">
            <div className="text-sm font-semibold text-[color:var(--color-ink)]">Material connection, disclosed</div>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-muted)]">
              Some tools here are ones we have joined a referral program for. If you buy through the link, the
              program may pay us a commission — sometimes once, sometimes a share of your subscription while you stay
              a customer. That is a real business relationship, and it is disclosed wherever it applies, before the link.
            </p>
          </div>
          <div className="card motion-reveal">
            <div className="text-sm font-semibold text-[color:var(--color-ink)]">No earnings claims, at all</div>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-muted)]">
              The FTC’s <span className="font-semibold text-[color:var(--color-ink)]">Operation AI Comply</span> treats
              AI-attached “passive income” promises as its highest-risk category. Our standard goes further than the
              rule: we do not market income outcomes anywhere — only machinery and education. What you build is real;
              what you earn is never promised.
            </p>
          </div>
          <div className="card motion-reveal">
            <div className="text-sm font-semibold text-[color:var(--color-ink)]">Never a paid placement</div>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-muted)]">
              We do not accept payment to write a positive review, do not hide better unpaid alternatives, and label
              our own products (Blueprint, Agent Team Pro, Private Intel) separately from third-party tool
              recommendations. Compensated reviews and AI-generated fake reviews are exactly what the Consumer
              Reviews Rule bans; we do not go near them.
            </p>
          </div>
        </div>
        <p className="motion-reveal mt-6 max-w-3xl text-sm leading-relaxed text-[color:var(--color-muted)]">
          Every compensated link routes through our self-hosted{' '}
          <a
            href="https://github.com/frankxai/go-agenticincome"
            rel="noopener"
            className="text-[color:var(--color-accent)] underline underline-offset-2"
          >
            go. redirector
          </a>
          , whose router policy sends disclosure headers on every hop and rel=&quot;sponsored&quot; on the link
          itself — so search engines and browsers can identify it as compensated. The redirector is an open repo:
          audit the routing, the catalog sync, and the headers yourself.
        </p>
      </section>

      <section className="section-band">
        <div className="section-heading motion-reveal">
          <div className="kicker">Verify it yourself</div>
          <h2 className="display-h2">The current, real program list.</h2>
          <p>
            No curated highlight reel — this is every active program in the catalog file the site actually runs on,
            the same one that drives every payout label across the network.
          </p>
        </div>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border glass">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[color:var(--color-muted)]">
                <th className="px-4 py-3 font-semibold">Tool</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Payout window</th>
                <th className="px-4 py-3 font-semibold">Commission</th>
              </tr>
            </thead>
            <tbody>
              {active.map((program) => (
                <tr key={program.tool} className="border-t border-border">
                  <td className="px-4 py-3 font-semibold text-[color:var(--color-ink)]">{program.tool}</td>
                  <td className="px-4 py-3 text-[color:var(--color-muted)]">{program.status ?? 'active'}</td>
                  <td className="px-4 py-3 text-[color:var(--color-muted)]">{program.recurring ?? 'one-time'}</td>
                  <td className="px-4 py-3 text-[color:var(--color-muted)]">{program.commission ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[color:var(--color-muted)]">
          A program appearing here means Agentic Income can legally earn from that tool today. It does not mean every
          mention of that tool is a paid link — check the disclosure notice on the specific page for that.
        </p>
      </section>

      <FaqSection items={faqs} />

      <section className="section-band max-w-3xl text-sm leading-6 text-[color:var(--color-muted)]">
        <p>
          This disclosure exists because the honesty of the recommendation is the entire product here — not a legal
          formality bolted on afterward. See{' '}
          <Link href="/trust" className="text-[color:var(--color-accent)] underline underline-offset-2">the trust standard</Link>{' '}
          for how recommendations get made, or{' '}
          <Link href="/tools" className="text-[color:var(--color-accent)] underline underline-offset-2">the tool catalog</Link>{' '}
          for the underlying data.
        </p>
      </section>
    </>
  )
}
