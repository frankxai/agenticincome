import { catalogRefusal, checkoutRelease, findCatalogProduct } from './polar.ts'

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
    refundPolicy: '30-day no-questions refund via the merchant of record: reply to the receipt or email us within 30 days of purchase and it is refunded in full.',
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
  {
    slug: 'agent-team-pro',
    tier: 'Product',
    title: 'Agent Team Pro',
    shortTitle: 'Agent Team Pro',
    price: '$129',
    summary: 'Advanced agent definitions, fulfillment workflows, and operating loops that extend the free pack into a production system.',
    promise: 'The premium delivery crew built from the same machinery that runs this business, with 12 months of updates. Machinery is promised, outcomes are not.',
    cta: 'Join the Agent Team Pro waitlist',
    audience: 'Founders already running the free pack who want the full fulfillment crew instead of assembling it role by role.',
    firstWin: 'Run one delivery workflow end to end with defined agent roles and a human approval step before anything reaches a customer.',
    deliverables: [
      'Advanced agent definitions',
      'Fulfillment workflows',
      'Operating loops',
      'Install README',
      '12 months of updates via license key',
    ],
    outcomes: [
      'A delivery crew you can inspect and edit',
      'Workflows with human approval boundaries kept in place',
      'An upgrade path from the free pack without rewiring it',
    ],
    proof: [
      'Extends the free, public pack rather than replacing it.',
      'Built from the same agent roles and loops that run this site.',
      'Checkout opens only once the files exist to deliver.',
    ],
    support: 'Template-level support and update notes for 12 months. No private implementation consulting is included.',
    upgradePath: 'Private Intel keeps the payer map current alongside the crew.',
    deliveryPath: '/delivery/agent-team-pro',
    checkoutOutcome: 'Once checkout opens, Polar.sh confirms the payment and returns buyers here, then to the Agent Team Pro delivery desk.',
    refundPolicy: '30-day no-questions refund via the merchant of record: reply to the receipt or email us within 30 days of purchase and it is refunded in full.',
    receiptInstruction: 'Polar.sh emails the receipt, download, and license key. Keep that email as proof of purchase.',
    checkout: {
      provider: 'external',
      envKey: 'AGENTIC_INCOME_AGENT_TEAM_PRO_CHECKOUT_URL',
      fallback: 'request-access',
      buyLabel: 'Get Agent Team Pro',
    },
  },
  {
    slug: 'claims-guard-pack',
    tier: 'Skill pack',
    title: 'Claims Guard Pack',
    shortTitle: 'Claims Guard',
    price: '$39',
    summary: 'A pre-publish gate that audits business copy through five checks and returns pass, warn, or fail with specific corrections.',
    promise: 'Run copy through regulated-claim, citation, brand-voice, AI-slop, and structure gates before it ships.',
    cta: 'Join the Claims Guard waitlist',
    audience: 'Founders and small teams publishing sales or marketing copy who want a repeatable check before anything goes live.',
    firstWin: 'Audit one page of live copy and fix every fail the gate returns.',
    deliverables: [
      'Claims Guard skill file',
      'Manifest and versioned packaging',
      'PRODUCT.md with scope and limits',
      'Install notes for Claude.ai projects or a repo',
    ],
    outcomes: [
      'Copy reviewed against the same five gates every time',
      'Specific corrections instead of a vague score',
      'Regulated claim language caught before publishing',
    ],
    proof: [
      'The source is MIT-licensed and public in frankxai/agentic-business-os; you can use it free from GitHub.',
      'This is the packaged, versioned edition. It is not exclusive content.',
      'Not legal advice.',
    ],
    support: 'Packaging and install questions only. Not legal review.',
    upgradePath: 'The Agentic Business OS Pack Bundle includes Claims Guard plus three more packs.',
    deliveryPath: '/delivery/claims-guard-pack',
    checkoutOutcome: 'Once checkout opens, Polar.sh confirms the payment and returns buyers here, then to the Claims Guard delivery desk.',
    refundPolicy: '30-day no-questions refund via the merchant of record: reply to the receipt or email us within 30 days of purchase and it is refunded in full.',
    receiptInstruction: 'Polar.sh emails the receipt and the zip download. Keep that email as proof of purchase.',
    checkout: {
      provider: 'external',
      fallback: 'request-access',
      buyLabel: 'Get Claims Guard',
    },
  },
  {
    slug: 'abos-pack-bundle',
    tier: 'Skill pack bundle',
    title: 'Agentic Business OS Pack Bundle',
    shortTitle: 'ABOS Pack Bundle',
    price: '$99',
    summary: 'All four Agentic Business OS skill packs in one package, with the pack registry and install guide.',
    promise: 'Claims Guard, Business Intelligence, Design Contract, and Weekly Rhythm, packaged and versioned together.',
    cta: 'Join the Pack Bundle waitlist',
    audience: 'Founders who want the whole set of skill packs installed together rather than one at a time.',
    firstWin: 'Install the bundle and run the Monday half of the Weekly Rhythm loop.',
    deliverables: [
      'Claims Guard pack',
      'Business Intelligence pack',
      'Design Contract pack',
      'Weekly Rhythm pack',
      'Pack registry and install guide',
    ],
    outcomes: [
      'File-based business memory your AI assistant can read',
      'A design.md and taste.md authoring workflow',
      'A founder-sized weekly operating loop',
      'A pre-publish copy gate',
    ],
    proof: [
      'The source is MIT-licensed and public in frankxai/agentic-business-os; you can use it free from GitHub.',
      'Skill files, not software: they guide the AI assistant you already use. No app, no account.',
      'No business-outcome claims.',
    ],
    support: 'Packaging and install questions only.',
    upgradePath: 'Pair it with Private Intel for monthly payer and landscape notes.',
    deliveryPath: '/delivery/abos-pack-bundle',
    checkoutOutcome: 'Once checkout opens, Polar.sh confirms the payment and returns buyers here, then to the Pack Bundle delivery desk.',
    refundPolicy: '30-day no-questions refund via the merchant of record: reply to the receipt or email us within 30 days of purchase and it is refunded in full.',
    receiptInstruction: 'Polar.sh emails the receipt and the zip download. Keep that email as proof of purchase.',
    checkout: {
      provider: 'external',
      fallback: 'request-access',
      buyLabel: 'Get the Pack Bundle',
    },
  },
  {
    slug: 'vibe-os-pack',
    tier: 'Toolkit',
    title: 'Vibe OS Pack',
    shortTitle: 'Vibe OS',
    price: '$24',
    summary: 'Claude Code skills and Python audio tools that turn a target state into a concrete AI-music prompt plus optional tone layering.',
    promise: 'Three Suno-focused prompt skills, four audio tools, research-cited docs, and two example session scripts.',
    cta: 'Join the Vibe OS waitlist',
    audience: 'Creators using Suno or a similar service who want structured prompts for focus, workout, or sleep sessions.',
    firstWin: 'Generate one session prompt from a target state and layer a tone track under it.',
    deliverables: [
      'Three Claude Code prompt skills',
      'Four Python audio tools',
      'Research-cited documentation',
      'Two example session scripts',
    ],
    outcomes: [
      'Repeatable music prompts from a named target state',
      'Optional tone and binaural layering',
      'Documentation that cites its sources',
    ],
    proof: [
      'The source is MIT-licensed and public in frankxai/vibe-os; you can use it free from GitHub.',
      'Not medical or therapeutic. No health outcomes are promised.',
      'Music generation requires your own Suno or similar account.',
    ],
    support: 'Packaging and install questions only.',
    upgradePath: 'The Agentic Business OS Pack Bundle covers the business side of the same skill-file approach.',
    deliveryPath: '/delivery/vibe-os-pack',
    checkoutOutcome: 'Once checkout opens, Polar.sh confirms the payment and returns buyers here, then to the Vibe OS delivery desk.',
    refundPolicy: '30-day no-questions refund via the merchant of record: reply to the receipt or email us within 30 days of purchase and it is refunded in full.',
    receiptInstruction: 'Polar.sh emails the receipt and the zip download. Keep that email as proof of purchase.',
    checkout: {
      provider: 'external',
      fallback: 'request-access',
      buyLabel: 'Get Vibe OS',
    },
  },
]

export function getOffer(slug: string): Offer | undefined {
  return offers.find((offer) => offer.slug === slug)
}

export function checkoutPath(offer: Offer): string {
  return `/api/checkout?offer=${offer.slug}`
}

/**
 * The static checkout link for an offer, or null. Static links point at live
 * Polar checkout, so they open only on CHECKOUT_RELEASE=live (lib/polar.ts),
 * and an offer backed by a catalog product also needs the catalog to permit
 * the sale. A link pasted into the environment cannot open checkout alone.
 */
export function checkoutUrl(offer: Offer): string | null {
  if (!offer.checkout.envKey) return null
  if (checkoutRelease() !== 'live') return null
  const product = findCatalogProduct(offer.slug)
  if (product && catalogRefusal(product)) return null
  const value = process.env[offer.checkout.envKey]
  if (!value) return null

  try {
    const url = new URL(value)
    return url.protocol === 'https:' ? url.toString() : null
  } catch {
    return null
  }
}
