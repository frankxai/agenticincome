const signals = [
  {
    sourceType: 'Marketplace data',
    date: 'Feb 2026',
    signal: '+109%',
    title: 'Demand grew where AI met an existing business discipline.',
    body: 'Upwork reports that skills explicitly tied to applying AI grew 109% year over year; AI integration grew 178% and AI chatbot development 71%. The dataset uses completed US marketplace jobs and freelancer earnings.',
    lesson: 'Sell a valuable job and applied expertise—not an agent persona.',
    href: 'https://investors.upwork.com/news-releases/news-release-details/upworks-demand-skills-2026-demand-top-ai-skills-more-doubles-ai',
    source: 'Upwork In-Demand Skills 2026',
  },
  {
    sourceType: 'Vendor-published customer story',
    date: 'Mar 2026 result',
    signal: '$10M ARR',
    title: 'A narrow support outcome became a two-lane product.',
    body: 'Stripe reports that bootstrapped Chatbase reached $10M in annual recurring revenue in under three years using both self-serve and enterprise onboarding.',
    lesson: 'A specific customer job can support self-serve delivery and higher-touch implementation.',
    href: 'https://stripe.com/customers/chatbase',
    source: 'Stripe customer story: Chatbase',
  },
  {
    sourceType: 'Vendor-published customer story',
    date: 'Retrieved Jul 2026',
    signal: '1 hour → seconds',
    title: 'Automation stayed useful because authority stayed explicit.',
    body: 'Stripe reports that Dust reduced a multistep refund workflow from as much as an hour to seconds while keeping people able to review and validate sensitive actions.',
    lesson: 'The authority boundary is part of the product—not compliance copy added later.',
    href: 'https://stripe.com/customers/dust',
    source: 'Stripe customer story: Dust',
  },
  {
    sourceType: 'Vendor-published customer story',
    date: 'May 2026',
    signal: '90% SRE',
    title: 'Agent leverage depends on inspectable infrastructure.',
    body: 'Vercel reports that General Intelligence, an eight-person team, automated 90% of site-reliability work and uses branch previews as an agent-verification surface.',
    lesson: 'Owned code, previews, logs, and tests make agent work governable.',
    href: 'https://vercel.com/customers/how-general-intelligence-used-agents-to-build-an-agent-platform-on-vercel',
    source: 'Vercel customer story: General Intelligence',
  },
] as const

export function MarketEvidence() {
  return (
    <section className="section-band" aria-labelledby="market-evidence-title">
      <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
        <div className="section-heading">
          <div className="kicker">What the market actually shows</div>
          <h2 id="market-evidence-title">Income follows a customer job, not an agent count.</h2>
        </div>
        <div className="max-w-2xl">
          <p className="text-lg leading-8 text-muted">
            These are current platform data and vendor-published customer stories. They are useful
            signals—not Agentic Income customer results, not forecasts, and not promises of a typical outcome.
          </p>
          <p className="mt-3 text-xs leading-5 text-muted">Sources reviewed 29 July 2026.</p>
        </div>
      </div>

      <div className="market-evidence-grid">
        {signals.map((item) => (
          <article key={item.source} className="market-evidence-card">
            <div className="market-evidence-meta">
              <span>{item.sourceType}</span>
              <span>{item.date}</span>
            </div>
            <div className="market-evidence-signal">{item.signal}</div>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
            <div className="market-evidence-lesson">
              <strong>Design lesson</strong>
              <span>{item.lesson}</span>
            </div>
            <a href={item.href} target="_blank" rel="noopener noreferrer">
              Read {item.source} <span aria-hidden="true">↗</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}
