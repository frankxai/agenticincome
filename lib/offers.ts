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
    /**
     * Label shown once Polar checkout is live for this offer (see lib/polar.ts).
     * `cta` above stays the pre-checkout, request-access wording; this replaces
     * it only when the server confirms a real checkout exists.
     */
    buyLabel?: string
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
    title: 'Income Flywheel Starter Kit',
    shortTitle: 'Starter Kit',
    price: 'Free',
    summary: 'The first loop: pick a category, structure the comparison, route the recurring payer, and capture the relationship.',
    promise: 'Leave with one buildable comparison path and the exact checklist for turning it into an owned revenue loop.',
    cta: 'Open starter kit',
    audience: 'Builders who want the first honest revenue loop before buying a template or joining a membership.',
    firstWin: 'Choose one AI-tool category, one comparison shape, one recurring-payer route, and one email capture promise.',
    deliverables: [
      'First-loop playbook',
      'Recurring-payer shortlist',
      'Comparison-page outline',
      'Email capture checklist',
      '30-minute execution sprint',
    ],
    outcomes: [
      'A category worth writing about',
      'A comparison structure that can rank and be cited',
      'A disclosure-safe route to recurring tools',
      'A first owned-audience capture',
    ],
    proof: [
      'Built from the same catalog model that powers /tools.',
      'Uses the recommendation-first rule before any payout route.',
      'Delivered instantly on-site with no broken external funnel.',
    ],
    support: 'Self-serve. Use the checklist, then upgrade when you want the full operating desk.',
    upgradePath: 'Agentic Income Blueprint installs the full catalog, templates, and publishing cadence.',
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
    title: 'Agentic Income Blueprint',
    shortTitle: 'Blueprint',
    price: '$67',
    summary: 'The operating system for turning comparison content into a reusable recommendation asset and direct product path.',
    promise: 'Install the desk: catalog model, comparison template, product ladder, disclosure rules, and weekly operating cadence.',
    cta: 'Reserve Blueprint access',
    audience: 'Creator operators and founders who want the system packaged instead of reconstructing it from scattered notes.',
    firstWin: 'Publish the first citable comparison with a payer route, disclosure, email capture, and product upgrade path.',
    deliverables: [
      'Operating desk structure',
      'Comparison template',
      'Recurring-payer catalog model',
      'Offer ladder map',
      'Implementation walkthrough',
    ],
    outcomes: [
      'A repeatable article-to-product workflow',
      'A cleaner monetization decision tree',
      'Reusable product and email capture language',
      'A weekly operating cadence for audit and publishing',
    ],
    proof: [
      'Matches the public homepage mechanism.',
      'Built around the same honest-pick-first rule.',
      'Prepared for a secure payment-provider checkout and post-purchase delivery handoff.',
    ],
    support: 'Template-level support and update notes. No private implementation consulting is included at this tier.',
    upgradePath: 'Private Intel keeps the payer map current and adds monthly opportunity notes.',
    deliveryPath: '/delivery/blueprint',
    checkoutOutcome: 'When the payment link is configured, the provider should redirect buyers to the Blueprint delivery desk.',
    refundPolicy: 'No checkout is active for this product. Refund terms will be published before any payment is taken.',
    receiptInstruction: 'Keep the provider receipt. The delivery desk explains access, install order, and support boundaries.',
    checkout: {
      provider: 'external',
      envKey: 'AGENTIC_INCOME_BLUEPRINT_CHECKOUT_URL',
      fallback: 'request-access',
      buyLabel: 'Get the Blueprint',
    },
  },
  {
    slug: 'private-intel',
    tier: 'Membership',
    title: 'Private Intel',
    shortTitle: 'Private Intel',
    price: '$19/mo',
    summary: 'Monthly intelligence on payer shifts, stack opportunities, audit notes, and new routes worth building around.',
    promise: 'Stay ahead of payer changes and new AI-tool opportunities without rebuilding your research process every month.',
    cta: 'Request member access',
    audience: 'Operators who already understand the model and want the payer map, opportunity queue, and notes kept current.',
    firstWin: 'Pick the next program or content angle from a monthly brief instead of guessing from tool hype.',
    deliverables: [
      'Monthly payer brief',
      'Stack opportunity notes',
      'Catalog change log',
      'Priority watchlist',
      'Private Q&A window',
    ],
    outcomes: [
      'Faster payer decisions',
      'Cleaner content prioritization',
      'Fewer dead-end tool routes',
      'A durable operating rhythm',
    ],
    proof: [
      'Extends the same catalog that powers the public site.',
      'Uses audit notes rather than generic trend commentary.',
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
      buyLabel: 'Start Private Intel',
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
