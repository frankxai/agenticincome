/**
 * The 7-Day Agentic Income Challenge — a free, evergreen lead-magnet path.
 *
 * Self-contained data (no filesystem, no email-sequence infrastructure): each day
 * is one concrete action that maps to the public Agentic Income skill or an on-site
 * route. The framing is capability, never income.
 */
export type ChallengeDay = {
  day: number
  title: string
  /** The public command or skill invocation this day uses, if any. */
  command?: string
  /** One concrete, real action — an artifact that exists, not a lecture. */
  action: string
  /** A real public destination. */
  href: string
  hrefLabel: string
}

export const challengeDays: ChallengeDay[] = [
  {
    day: 1,
    title: 'Create the owned system',
    command: 'npm run income:init',
    action:
      'Clone the public repository and scaffold an owned copy of the Request-to-Quote Outcome Pack. Output: an income-system.json and the reference contracts in your own directory.',
    href: '/pack',
    hrefLabel: 'Open the public system',
  },
  {
    day: 2,
    title: 'Pick one income model',
    action:
      'Choose a single model from your real constraints — a service, a product, or a system. One category, not five. Name the buyer, budget evidence, acceptance signal, and support burden before committing.',
    href: '/build',
    hrefLabel: 'Inspect the build path',
  },
  {
    day: 3,
    title: 'Architect the service',
    command: '/agentic-income validate',
    action:
      'Turn the model into one Outcome Pack: buyer, accepted outcome, offer, principal, workflow, authority, evals, economics, evidence, and stop conditions.',
    href: '/pack',
    hrefLabel: 'Read the operating skill',
  },
  {
    day: 4,
    title: 'Choose the honest tool stack',
    action:
      'Assemble the minimum machine — checkout, email, hosting, analytics, and agent runtime. Inspect the live catalog; every tool carries its cost and a non-affiliate alternative.',
    href: '/tools',
    hrefLabel: 'Inspect the tool catalog',
  },
  {
    day: 5,
    title: 'Design the offer',
    command: '/agentic-income sell',
    action:
      'Shape one offer with transparent price, scope, acceptance checks, support, and the agent workflow that delivers it. Keep commitments and customer-facing sends human-gated.',
    href: '/offers',
    hrefLabel: 'See offer patterns',
  },
  {
    day: 6,
    title: 'Write evidence-led copy',
    action:
      'Draft the landing page around the buyer, accepted outcome, inspectable mechanism, limits, and current access state. Disclose every compensated link before the click.',
    href: '/trust',
    hrefLabel: 'Read the trust standard',
  },
  {
    day: 7,
    title: 'Validate, then choose',
    command: 'npm run income:validate',
    action:
      'Validate the system contract, review the human approval boundaries, and make one explicit implement, revise, or stop decision. A valid schema is the start of review, not proof of demand.',
    href: '/proof',
    hrefLabel: 'Read the proof standard',
  },
]
