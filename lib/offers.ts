export type Offer = {
  slug: string
  tier: string
  title: string
  shortTitle: string
  price: string
  summary: string
  promise: string
  cta: string
  audience: string
  firstWin: string
  deliverables: string[]
  outcomes: string[]
  proof: string[]
  support: string
  upgradePath: string
  deliveryPath: string
  checkoutOutcome: string
  refundPolicy: string
  receiptInstruction: string
  accessMode?: 'scope-first'
  checkout: {
    provider: 'internal' | 'external'
    envKey?: string
    fallback: 'delivery' | 'request-access'
  }
}

export const offers: Offer[] = [
  {
    slug: 'implementation-sprint',
    tier: 'Agent-as-a-Service',
    title: 'Revenue System Implementation Sprint',
    shortTitle: 'Implementation Sprint',
    price: 'Scoped proposal',
    summary: 'A focused engagement to audit one valuable workflow, design the revenue system, implement the customer path, and hand over a verified preview.',
    promise: 'Turn one credible workflow into a working offer and product surface without surrendering ownership of the repository, process, or next decision.',
    cta: 'Request a scoped plan',
    audience: 'Founder-led teams with a real workflow, domain expertise, or existing audience who need implementation depth rather than another broad AI strategy exercise.',
    firstWin: 'A written build decision: customer job, commercial model, evidence, system boundary, delivery plan, and explicit stop conditions.',
    deliverables: [
      'Revenue-system audit and model recommendation',
      'Offer, capability, and customer-path architecture',
      'Git-backed implementation on an isolated branch',
      'Local quality gates and one Vercel preview',
      'Decision log, residual risks, and operating handoff',
    ],
    outcomes: [
      'One concrete customer path instead of a generic AI concept',
      'A reviewable implementation your team can continue',
      'Honest language, instrumentation boundaries, and proof near claims',
      'A clear next decision after the preview is inspected',
    ],
    proof: [
      'The public skills repository exposes the operating method.',
      'The deployable template and live routing directory show working components of the system.',
      'Every sprint is scoped around repository evidence, checks, preview, and handoff.',
    ],
    support: 'Support and iteration boundaries are agreed in the scoped plan before work begins.',
    upgradePath: 'Continue independently with the open-source system, retain a bounded implementation lane, or package the result into a repeatable digital product.',
    deliveryPath: '/offers/implementation-sprint#request-access',
    checkoutOutcome: 'No payment is taken on this site. The request path opens the scoped-intake section so deliverables and acceptance checks can be agreed first.',
    refundPolicy: 'No checkout is active for this service. Any future commercial agreement must state payment, acceptance, support, and cancellation terms before work starts.',
    receiptInstruction: 'No receipt is expected until a separate scoped agreement and payment path exist.',
    accessMode: 'scope-first',
    checkout: {
      provider: 'internal',
      fallback: 'request-access',
    },
  },
  {
    slug: 'starter-kit',
    tier: 'Free',
    title: 'Outcome Pack Starter',
    shortTitle: 'Outcome Pack Starter',
    price: 'Free',
    summary: 'A no-gate capability map, public operating contract, local Request-to-Quote desk, and checklist for shaping one credible Outcome Pack.',
    promise: 'Leave with one buyer, one valuable workflow, one accepted outcome, and a clear authority boundary worth validating.',
    cta: 'Open the starter',
    audience: 'Builders with domain experience, buyer access, a repeatable method, or an audience who need the right first system before adding automation.',
    firstWin: 'Write one structured business test: buyer, job, evidence, accepted outcome, authority, and next validation decision.',
    deliverables: [
      '30-minute first-system sprint',
      'Six-part Outcome Pack checklist',
      'Public Agentic Income operating skill',
      'Local Request-to-Quote reference desk',
      'Downloadable Markdown worksheet',
    ],
    outcomes: [
      'A buyer and job worth investigating',
      'An outcome that can be accepted or rejected',
      'A clear human and agent authority split',
      'A reasoned build, revise, or stop decision',
    ],
    proof: [
      'The public skill exposes the complete operating contract.',
      'The browser-based Request-to-Quote desk sends nothing.',
      'Delivered instantly on-site with no email or checkout dependency.',
    ],
    support: 'Self-serve. Use the checklist and public reference system, then upgrade only when you need the complete design and validation desk.',
    upgradePath: 'The Outcome Pack Blueprint packages the full contract, templates, eval planning, economics, and launch decision.',
    deliveryPath: '/delivery/starter-kit',
    checkoutOutcome: 'The checkout route opens the Starter Kit delivery page immediately.',
    refundPolicy: 'Free product. No payment or refund flow required.',
    receiptInstruction: 'No receipt needed; the kit is available on-site and as a markdown download.',
    checkout: {
      provider: 'internal',
      fallback: 'delivery',
    },
  },
  {
    slug: 'blueprint',
    tier: 'Product',
    title: 'Outcome Pack Blueprint',
    shortTitle: 'Outcome Pack Blueprint',
    price: '$67',
    summary: 'The guided design system for turning a validated workflow into a complete offer, authority model, evaluation plan, runbook, and evidence bundle.',
    promise: 'Install the full Outcome Pack desk without reconstructing the commercial, operational, and governance layers from scattered prompts.',
    cta: 'Reserve Blueprint access',
    audience: 'Founder-operators and consultants who have chosen a credible workflow and want the complete design and validation structure before implementation.',
    firstWin: 'Complete a validated system brief with buyer, offer, acceptance, authority, economics, evals, evidence, and an explicit launch decision.',
    deliverables: [
      'Outcome Pack workbook and templates',
      'Offer and acceptance architecture',
      'Authority, budget, and revocation map',
      'Evaluation, evidence, and economics plan',
      'Implementation and operating runbook',
    ],
    outcomes: [
      'A buildable service contract instead of a vague agent idea',
      'Clear human gates before commercial commitments',
      'A testable quality and evidence model',
      'A reasoned implement, revise, or stop decision',
    ],
    proof: [
      'Extends the public operating contract and reference system.',
      'Uses the same principal-owned authority model shown on the site.',
      'Prepared for a secure payment-provider checkout and post-purchase delivery handoff.',
    ],
    support: 'Template-level support and update notes. Private implementation is not included at this tier.',
    upgradePath: 'Continue independently with the public validator or request a scoped implementation sprint.',
    deliveryPath: '/delivery/blueprint',
    checkoutOutcome: 'When the payment link is configured, the provider should redirect buyers to the Blueprint delivery desk.',
    refundPolicy: '30-day no-questions refund via the merchant of record: reply to the receipt or email us within 30 days of purchase and it is refunded in full.',
    receiptInstruction: 'Keep the provider receipt. The delivery desk explains access, install order, and support boundaries.',
    checkout: {
      provider: 'external',
      envKey: 'AGENTIC_INCOME_BLUEPRINT_CHECKOUT_URL',
      fallback: 'request-access',
    },
  },
  {
    slug: 'private-intel',
    tier: 'Membership',
    title: 'Operator Evidence Brief',
    shortTitle: 'Operator Brief',
    price: '$19/mo',
    summary: 'Monthly evidence on agent runtimes, authority patterns, evaluation practices, operating costs, and market changes that affect live Outcome Packs.',
    promise: 'Keep a working agent service current without rebuilding the research and verification layer every month.',
    cta: 'Request member access',
    audience: 'Operators who already have a live or validated Outcome Pack and want a bounded update rhythm rather than generic AI news.',
    firstWin: 'Choose one evidence-backed system change, re-verification task, or risk decision from the current brief.',
    deliverables: [
      'Monthly operator evidence brief',
      'Runtime and authority change log',
      'Evaluation and cost notes',
      'Priority re-verification queue',
      'Bounded operator Q&A window',
    ],
    outcomes: [
      'Faster operating decisions',
      'Current authority and evaluation assumptions',
      'Fewer stale runtime or tool dependencies',
      'A durable monthly verification rhythm',
    ],
    proof: [
      'Extends the dated research and public proof standard.',
      'Uses decision-ready evidence rather than generic trend commentary.',
      'Prepared for recurring payment-provider checkout and member delivery handoff.',
    ],
    support: 'Membership updates and private Q&A windows. No done-for-you implementation unless a separate partner package is created.',
    upgradePath: 'Future partner and licensing packages can add implementation, templates, or private audits.',
    deliveryPath: '/delivery/private-intel',
    checkoutOutcome: 'When the membership checkout is configured, the provider should send members to the Private Intel delivery desk.',
    refundPolicy: 'Cancel anytime from the payment provider’s customer portal. If the first month was not useful, ask and it will be refunded.',
    receiptInstruction: 'Keep the provider receipt and use the delivery desk to confirm the monthly brief and Q&A access path.',
    checkout: {
      provider: 'external',
      envKey: 'AGENTIC_INCOME_PRIVATE_INTEL_CHECKOUT_URL',
      fallback: 'request-access',
    },
  },
]

export function getOffer(slug: string): Offer | undefined {
  return offers.find((offer) => offer.slug === slug)
}

export function checkoutPath(offer: Offer): string {
  return `/api/checkout?offer=${offer.slug}`
}

export function checkoutUrl(offer: Offer): string | null {
  if (!offer.checkout.envKey) return null
  const value = process.env[offer.checkout.envKey]
  if (!value) return null

  try {
    const url = new URL(value)
    return url.protocol === 'https:' ? url.toString() : null
  } catch {
    return null
  }
}
