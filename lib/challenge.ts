/**
 * The 7-Day Agentic Income Challenge — a free, evergreen lead-magnet path.
 *
 * Self-contained data (no filesystem, no email-sequence infrastructure): each day
 * is one concrete action that maps to the public Agentic Income operating contract,
 * so the reader can begin with no email gate or private repository dependency.
 */
export type ChallengeDay = {
  day: number
  title: string
  /** The pack command this day runs, if any — rendered as a mono chip. */
  command?: string
  /** One concrete, real action — an artifact that exists, not a lecture. */
  action: string
  /** A real destination: an internal route or a knowledge-base file on GitHub. */
  href: string
  hrefLabel: string
}

const PUBLIC_REPO = 'https://github.com/frankxai/agentic-income-skills'

export const challengeDays: ChallengeDay[] = [
  {
    day: 1,
    title: 'Choose one buyer and one painful job',
    command: '/agentic-income discover',
    action:
      'Start with a person or team you can understand and reach. Capture the job, current process, urgency, constraints, and evidence that the problem is real.',
    href: '/start',
    hrefLabel: 'Use the capability map',
  },
  {
    day: 2,
    title: 'Name the principal and the boundary',
    action:
      'Identify the human or legal entity that owns the offer, accounts, credentials, customer obligation, and money. List what the agent may prepare and what requires approval.',
    href: `${PUBLIC_REPO}/blob/main/docs/income-system-v1.md`,
    hrefLabel: 'Inspect the open contract',
  },
  {
    day: 3,
    title: 'Define the accepted outcome',
    command: '/agentic-income validate',
    action:
      'Write what done means, how it will be checked, which claims are out of scope, and the smallest demand signal that justifies a build.',
    href: '/build',
    hrefLabel: 'See the four-stage build path',
  },
  {
    day: 4,
    title: 'Scaffold the owned Outcome Pack',
    command: 'npm run income:init -- --output=../my-income-system',
    action:
      'Clone the public repository, install dependencies, run the tests, and create an owned working copy. Keep credentials and customer data out of Git and model context.',
    href: PUBLIC_REPO,
    hrefLabel: 'Open the MIT repository',
  },
  {
    day: 5,
    title: 'Design the workflow and human gates',
    command: '/agentic-income build',
    action:
      'Map inputs, outputs, tools, handoffs, failure paths, budgets, revocation, evals, support, and the exact moments an authorized principal must decide.',
    href: `${PUBLIC_REPO}/tree/main/examples/request-to-quote-desk`,
    hrefLabel: 'Inspect the reference system',
  },
  {
    day: 6,
    title: 'Validate the contract and evidence',
    command: 'npm run income:validate -- income-system.json',
    action:
      'Run the schema and policy validator. Then test the accepted outcome, document limitations, and label every artifact as reference or customer evidence.',
    href: `${PUBLIC_REPO}/blob/main/schemas/income-system.v1.schema.json`,
    hrefLabel: 'Inspect the machine-readable schema',
  },
  {
    day: 7,
    title: 'Publish proof, then make one operating decision',
    command: '/agentic-income prove · improve',
    action:
      'Publish only what the evidence supports. Record quality, economics, incidents, freshness, and the next bounded change. Stop when the validation threshold or kill criterion fails.',
    href: '/proof',
    hrefLabel: 'See the proof standard',
  },
]
