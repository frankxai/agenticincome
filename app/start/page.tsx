import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'The Free Agentic Income Field Guide',
  description:
    'Map one buyer, choose a viable income path, define an Outcome Pack, and run the verified public scaffold and validator.',
  alternates: { canonical: '/start' },
  openGraph: {
    title: 'The Free Agentic Income Field Guide',
    description: 'A practical path from one valuable workflow to a principal-owned Outcome Pack.',
    url: '/start',
  },
}

const firstThirty = [
  {
    time: '00–10',
    title: 'Name the buyer and costly job',
    prompt: 'Who has the problem? What happens today? What is delayed, lost, risky, repetitive, or expensive?',
    output: 'One sentence: “For [buyer], [job] causes [measurable consequence].”',
  },
  {
    time: '10–20',
    title: 'Define the accepted outcome',
    prompt: 'What useful result could a governed workflow create? How would the buyer and you decide it is good enough?',
    output: 'Three checks, one explicit non-goal, and one human approval boundary.',
  },
  {
    time: '20–30',
    title: 'Choose the smallest proof',
    prompt: 'Can you demonstrate the contract, a reference run, or a reviewable artifact before building the full service?',
    output: 'One seven-day test with a stop condition—not a launch fantasy.',
  },
] as const

const startingPaths = [
  {
    label: 'Fastest path to a real buyer',
    title: 'Service → Outcome Pack',
    fit: 'You know a painful business process, can reach the buyer, and can judge the result.',
    first: 'Capture one real request, success condition, constraint, and approval boundary.',
    example: 'Reference: a governed Request-to-Quote desk for B2B service businesses.',
    href: '/build/request-to-quote',
    cta: 'Inspect the service reference',
  },
  {
    label: 'Best for an existing method or audience',
    title: 'Method → Self-serve product',
    fit: 'People already ask the same question, use your framework, or want your templates and operating process.',
    first: 'Prove the manual method, define the delivery, then automate only the repeatable parts.',
    example: 'Output: product brief, acceptance path, support boundary, and honest upgrade decision.',
    href: '/offers',
    cta: 'Inspect the product paths',
  },
  {
    label: 'Best for trusted research and distribution',
    title: 'Judgment → Evidence-led research',
    fit: 'You have category experience and can publish better decisions than a generic tool directory.',
    first: 'Choose one decision, state criteria, date evidence, disclose incentives, and preserve unpaid alternatives.',
    example: 'Output: a citable decision page with an owned next step and no hidden incentive.',
    href: '/trust',
    cta: 'Read the trust standard',
  },
] as const

const outcomePack = [
  ['Buyer and problem', 'Who has the job, why it matters now, and what the current process costs.'],
  ['Outcome and acceptance', 'What done means, how it is checked, and which claims are out of scope.'],
  ['Offer and principal', 'Who owns pricing, terms, support, customer relationship, accounts, and IP.'],
  ['Workflow and interfaces', 'Agent steps, tools, inputs, outputs, handoffs, failure paths, and versions.'],
  ['Authority and budgets', 'What may run, what requires approval, what is denied, and how access is revoked.'],
  ['Evals and operations', 'Quality checks, economics, runbook, incidents, evidence, and the next decision.'],
] as const

const commands = [
  'git clone https://github.com/frankxai/agentic-income-skills.git',
  'cd agentic-income-skills',
  'npm install',
  'npm run income:init -- --output=../my-outcome-pack',
  'npm run income:validate -- ../my-outcome-pack/income-system.json',
  'npm test',
] as const

export default function Start() {
  return (
    <>
      <section className="section-band pt-20">
        <div className="max-w-4xl">
          <div className="kicker">Free · ungated · executable</div>
          <h1 className="mt-3 text-5xl font-semibold leading-[1.02] text-ink sm:text-6xl">
            Find the first income system your experience can actually support.
          </h1>
          <p className="mt-5 max-w-3xl text-xl leading-8 text-muted">
            Begin with a buyer, a useful outcome, and evidence you can judge—not an agent persona
            or a passive-income claim. In thirty minutes, leave with one testable path.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://github.com/frankxai/agentic-income-skills/blob/main/skills/agentic-income/SKILL.md"
              target="_blank"
              rel="noopener noreferrer"
              className="cta"
            >
              Open the free operating skill
            </a>
            <a href="#first-thirty" className="cta-secondary">Run the 30-minute map</a>
          </div>
        </div>
      </section>

      <section id="first-thirty" className="section-band" aria-labelledby="first-thirty-title">
        <div className="section-heading">
          <div className="kicker">Your first 30 minutes</div>
          <h2 id="first-thirty-title">A useful decision before another tool.</h2>
          <p>Write the answers. If you cannot name the buyer or judge the outcome, pause the build.</p>
        </div>
        <ol className="field-guide-timeline">
          {firstThirty.map((step) => (
            <li key={step.time}>
              <div className="field-guide-time">{step.time}</div>
              <div>
                <h3>{step.title}</h3>
                <p>{step.prompt}</p>
                <div><strong>Leave with:</strong> {step.output}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="section-band" aria-labelledby="paths-title">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div className="section-heading">
            <div className="kicker">Choose the path your assets support</div>
            <h2 id="paths-title">Service first. Product when repeatable. Research when trusted.</h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-muted">
            Most people should start with a narrow service because a real buyer creates better
            constraints and evidence. Products and research become stronger after the method works manually.
          </p>
        </div>
        <div className="starting-paths">
          {startingPaths.map((path, index) => (
            <article key={path.title}>
              <div className="starting-path-index">0{index + 1}</div>
              <div className="panel-label">{path.label}</div>
              <h3>{path.title}</h3>
              <p><strong>Fit:</strong> {path.fit}</p>
              <p><strong>First move:</strong> {path.first}</p>
              <div className="starting-path-example">{path.example}</div>
              <Link href={path.href}>{path.cta} <span aria-hidden="true">→</span></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section-band" aria-labelledby="anatomy-title">
        <div className="section-heading">
          <div className="kicker">Outcome Pack anatomy</div>
          <h2 id="anatomy-title">Six contracts turn automation into an accountable service.</h2>
        </div>
        <ol className="field-guide-anatomy">
          {outcomePack.map(([title, body], index) => (
            <li key={title}>
              <span>0{index + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="section-band" aria-labelledby="commands-title">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div className="section-heading">
            <div className="kicker">Run the public system</div>
            <h2 id="commands-title">Scaffold it. Validate it. Try to break the authority rules.</h2>
            <p>
              These commands were executed again on 29 July 2026: five tests passed, the reference
              pack validated, a fresh scaffold was created, and that scaffold validated.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://github.com/frankxai/agentic-income-skills"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-secondary"
              >
                Inspect source on GitHub
              </a>
              <a
                href="https://github.com/frankxai/agentic-income-skills/tree/main/examples/request-to-quote-desk"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-secondary"
              >
                Open the reference pack
              </a>
            </div>
          </div>
          <div className="public-command-panel" aria-label="Verified Agentic Income commands">
            <div>
              <span>agentic-income-skills / local</span>
              <strong>MIT · Node 20+</strong>
            </div>
            <ol>
              {commands.map((command) => (
                <li key={command}><code>{command}</code></li>
              ))}
            </ol>
            <p>
              The reference is not production-ready by default. Replace the example principal,
              domains, credentials, provider references, budgets, terms, evals, and evidence first.
            </p>
          </div>
        </div>
      </section>

      <section className="conversion-band">
        <div>
          <div className="kicker">When the map is real</div>
          <h2>Bring one workflow worth governing.</h2>
          <p>
            The Outcome Pack Lab is a selective, coming-soon cohort. The Build Sprint is a scope-first
            implementation. Neither is required to use the public method.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
          <Link href="/waitlist" className="cta">Inspect the founding Lab</Link>
          <Link href="/offers/implementation-sprint" className="cta-secondary">Inspect the Build Sprint</Link>
        </div>
      </section>
    </>
  )
}
