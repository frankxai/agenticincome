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
  checkout: {
    provider: 'internal' | 'external'
    envKey?: string
    fallback: 'delivery' | 'request-access'
  }
}

export const offers: Offer[] = [
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
    refundPolicy: '7-day refund window if the buyer has not used the implementation walkthrough or requested template support.',
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
    refundPolicy: 'Cancel any future renewal from the payment provider. First-month refunds are reviewed when access was not delivered.',
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
