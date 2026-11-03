export type OfferStage = 'entry' | 'pack' | 'system' | 'continuity'

export type Offer = {
  slug: string
  tier: string
  ladderStage: OfferStage
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
    slug: 'starter-kit',
    tier: 'Free entry',
    ladderStage: 'entry',
    title: 'Income Flywheel Starter Kit',
    shortTitle: 'Starter Kit',
    price: 'Free',
    summary: 'The first loop: pick a category, structure an inspectable comparison, route a recurring payer, and capture an owned subscriber.',
    promise: 'Leave in 30 minutes with one buildable comparison path and the exact checklist for turning it into an owned revenue loop.',
    cta: 'Open starter kit',
    audience: 'Builders who want to prove one honest revenue loop before buying a template or joining a membership.',
    firstWin: 'Choose one AI-tool category, one comparison shape, one recurring-payer route, and one email capture checklist.',
    deliverables: [
      'First-loop Markdown playbook',
      'Recurring-payer shortlist criteria',
      'Comparison-page outline with non-affiliate slot',
      'Email capture checklist',
      '30-minute execution sprint',
    ],
    outcomes: [
      'A category you have tested firsthand and can write about honestly',
      'A comparison structure that leads with criteria and tradeoffs',
      'A disclosure-safe route to recurring tools',
      'Your first workflow-specific email capture',
    ],
    proof: [
      'Built from the same catalog schema that powers /tools.',
      'Applies the recommendation-first rule before any payout route.',
      'Delivered immediately on-site with a direct Markdown download.',
    ],
    support: 'Self-serve. Run the 30-minute sprint first, then inspect paid packs only when you want pre-built templates.',
    upgradePath: 'Step up to Claims Guard Pack ($39) for pre-publish copy auditing or Income Architecture Blueprint ($67) for full model planning.',
    deliveryPath: '/delivery/starter-kit',
    checkoutOutcome: 'The checkout route opens the Starter Kit delivery page immediately with zero payment step.',
    refundPolicy: 'Free product. No payment or refund flow required.',
    receiptInstruction: 'No receipt needed; the kit is available on-site and as a direct Markdown download.',
    checkout: {
      provider: 'internal',
      fallback: 'delivery',
    },
  },
  {
    slug: 'vibe-os-pack',
    tier: 'Focused skill pack',
    ladderStage: 'pack',
    title: 'Vibe OS Pack',
    shortTitle: 'Vibe OS Pack',
    price: '$24',
    summary: 'Three Claude Code skills and four Python audio utilities for translating target focus or creative states into structured Suno prompts and local tone layers.',
    promise: 'Install a versioned audio-prompt and tone-layering toolkit in under ten minutes, backed by MIT-licensed source.',
    cta: 'Request Vibe OS Pack access',
    audience: 'Creators, producers, and builders using Suno or local Python audio scripts who want repeatable prompt structure and acoustic layering.',
    firstWin: 'Run state_to_prompt.py for one focus or workout session and generate a structured Suno prompt with BPM, key, instrumentation, and vocal constraints.',
    deliverables: [
      'Three Claude Code AI-music prompt skills',
      'Four Python audio utilities (prompt generator, mixer, tone generators)',
      'Research-cited acoustic state-change whitepaper',
      'Two complete session script examples',
      'Pinned requirements.txt and PRODUCT.md contract',
    ],
    outcomes: [
      'Consistent Suno v4 prompt architecture across sessions',
      'Repeatable local stem mixing and optional tone layering',
      'Clear separation between acoustic research citations and medical claims',
      'Offline versioned archive ready to drop into any workspace',
    ],
    proof: [
      'Underlying source is MIT-licensed and public in frankxai/vibe-os.',
      'Every script and skill path is inspectable in the file-tree workbench on this page.',
      'Explicitly excludes medical or therapeutic claims; music generation uses your own Suno account.',
    ],
    support: 'Packaged-edition install guide and release errata. Music generation requires your own external Suno or audio account.',
    upgradePath: 'Pair with Agentic Business OS Pack Bundle ($99) when publishing commercial creator catalogs or landing pages.',
    deliveryPath: '/offers/vibe-os-pack#request-access',
    checkoutOutcome: 'Checkout stays gated until the versioned zip is uploaded to Polar. Submitting the form logs your access request.',
    refundPolicy: 'When checkout opens: 30-day no-questions refund via Polar.sh, our merchant of record.',
    receiptInstruction: 'No payment is taken while gated. Once live, Polar issues VAT-compliant receipts and direct zip downloads.',
    checkout: {
      provider: 'external',
      envKey: 'AGENTIC_INCOME_VIBE_OS_PACK_CHECKOUT_URL',
      fallback: 'request-access',
      buyLabel: 'Get Vibe OS Pack',
    },
  },
  {
    slug: 'claims-guard-pack',
    tier: 'Focused skill pack',
    ladderStage: 'pack',
    title: 'Claims Guard Pack',
    shortTitle: 'Claims Guard Pack',
    price: '$39',
    summary: 'One pre-publish skill that audits landing pages, comparison posts, and offer copy across five gates: regulated claims, citations, brand voice, AI-slop tells, and structure.',
    promise: 'Catch unsupported income claims, missing FTC/EU disclosures, unattributed forecasts, and generic AI phrasing before a page goes live.',
    cta: 'Request Claims Guard access',
    audience: 'Solo founders, technical writers, and comparison publishers who ship commercial pages and want a deterministic pre-publish checklist.',
    firstWin: 'Run the 5-gate audit on one live landing page or comparison draft and resolve every hard-fail line with concrete rewrites.',
    deliverables: [
      'Five-gate SKILL.md audit specification',
      'Zero-tolerance regulated-claim and income-promise checklist',
      'FTC and EU material-connection disclosure patterns',
      'Versioned manifest.json for Claude Code, Codex, and Claude Projects',
      'PRODUCT.md scope and non-legal-advice boundary contract',
    ],
    outcomes: [
      'Commercial pages reviewed for unverified claims before publish',
      'Inline disclosures placed directly adjacent to monetization links',
      'Consistent voice free of contrast formulas and AI filler',
      'Structured pass, warn, and fail output for every draft',
    ],
    proof: [
      'Underlying source is MIT-licensed and public in frankxai/agentic-business-os.',
      'Mirrors the editorial verification gate used across this site.',
      'States clearly that it is an editorial quality check and never legal advice.',
    ],
    support: 'Self-serve skill pack with install instructions for Claude.ai Projects and CLI coding tools.',
    upgradePath: 'Included inside the 4-pack Agentic Business OS Pack Bundle ($99) alongside memory, design, and weekly review skills.',
    deliveryPath: '/offers/claims-guard-pack#request-access',
    checkoutOutcome: 'Checkout stays gated until the packaged v0.1.0 zip is attached on Polar. Request access below for launch notification.',
    refundPolicy: 'When checkout opens: 30-day no-questions refund via Polar.sh.',
    receiptInstruction: 'No payment is taken today. When Polar checkout opens, your receipt includes direct zip delivery.',
    checkout: {
      provider: 'external',
      envKey: 'AGENTIC_INCOME_CLAIMS_GUARD_PACK_CHECKOUT_URL',
      fallback: 'request-access',
      buyLabel: 'Get Claims Guard Pack',
    },
  },
  {
    slug: 'blueprint',
    tier: 'Operating system',
    ladderStage: 'system',
    title: 'Agentic Income Blueprint',
    shortTitle: 'Blueprint',
    price: '$67',
    summary: 'Three complete business-plan kits covering scoped services, digital products, and comparison systems with scenario math, fulfillment runbooks, and kill criteria.',
    promise: 'Install the full planning desk: worked economics with named assumptions, comparison templates, disclosure rules, and 30-day kill-criterion worksheets.',
    cta: 'Reserve Blueprint access',
    audience: 'Independent builders and technical founders who want worked unit-economics models and fulfillment checklists packaged in clean Markdown.',
    firstWin: 'Complete one business-plan kit for your chosen lane with explicit conversion assumptions, fulfillment steps, and a 30-day stop rule.',
    deliverables: [
      '00-README.md install order and model selector',
      'Service Kit: fixed-scope audit, acceptance gates, and pricing math',
      'Product Kit: versioned pack spec, pre-checkout trust checklist, and launch sequence',
      'System Kit: citable comparison matrix, recurring-payer ledger, and refresh cadence',
      'Explicit kill-criterion worksheets with labeled scenario numbers',
    ],
    outcomes: [
      'A concrete unit-economics model with visible assumptions',
      'A repeatable comparison-to-product publishing workflow',
      'Clear FTC/EU disclosure and refund language ready to adapt',
      'Written stop conditions before spending months on a weak niche',
    ],
    proof: [
      'Matches the public fit-check and workflow architecture on this site.',
      'Every number inside the kits is labeled as an illustrative scenario rather than an income promise.',
      'Prepared for Polar merchant-of-record checkout and instant Markdown delivery.',
    ],
    support: 'Template-level documentation and update notes. Private consulting is scoped separately under Implementation Sprint.',
    upgradePath: 'Combine with Agentic Business OS Pack Bundle ($99) for CLI skills or Private Intel ($19/mo) for monthly payer-term updates.',
    deliveryPath: '/delivery/blueprint',
    checkoutOutcome: 'When the Polar product configuration is active, checkout routes buyers directly to the Blueprint delivery desk.',
    refundPolicy: '30-day no-questions refund via the merchant of record: reply to the receipt within 30 days of purchase for a full refund.',
    receiptInstruction: 'Keep your Polar receipt. The delivery desk walks through file download, install order, and support boundaries.',
    checkout: {
      provider: 'external',
      envKey: 'AGENTIC_INCOME_BLUEPRINT_CHECKOUT_URL',
      fallback: 'request-access',
      buyLabel: 'Get the Blueprint',
    },
  },
  {
    slug: 'abos-pack-bundle',
    tier: 'System bundle',
    ladderStage: 'system',
    title: 'Agentic Business OS Pack Bundle',
    shortTitle: 'ABOS Pack Bundle',
    price: '$99',
    summary: 'All four Agentic Business OS skill packs in one versioned archive: Claims Guard, Business Intelligence, Design Contract, and Weekly Rhythm.',
    promise: 'Equip your local coding tools with file-based business memory, design.md + taste.md authoring, pre-publish claim auditing, and a Monday-to-Friday founder loop.',
    cta: 'Request Bundle access',
    audience: 'Solo founders and small product teams running Claude Code, Codex, or OpenCode who want plain-text business governance inside git.',
    firstWin: 'Install registry.json, generate a reference-locked DESIGN.md for one product page, and run Claims Guard before opening a pull request.',
    deliverables: [
      'Pack 1: Claims Guard 5-gate pre-publish copy auditor',
      'Pack 2: Business Intelligence file-based decision and ledger memory',
      'Pack 3: Design Contract (design.md and taste.md generator)',
      'Pack 4: Weekly Rhythm founder-sized Monday plan and Friday review loop',
      'Unified registry.json, install guide, and PRODUCT-BUNDLE.md contract',
    ],
    outcomes: [
      'Four Markdown skills in one archive without external SaaS lock-in',
      'Decisions, design tokens, and weekly reviews tracked cleanly in git',
      'Consistent pre-publish claim and voice checks across every offer',
      'Lower single-archive price compared to buying individual packs',
    ],
    proof: [
      'Underlying source is MIT-licensed and public in frankxai/agentic-business-os.',
      'Plain Markdown and JSON files with zero hidden runtime daemons.',
      'Full archive tree and file excerpts are inspectable on this page prior to release.',
    ],
    support: 'Versioned bundle documentation and MIT license terms. No done-for-you setup is included at this tier.',
    upgradePath: 'Step up to Implementation Sprint when you want a dedicated build branch and Vercel preview implemented with you.',
    deliveryPath: '/offers/abos-pack-bundle#request-access',
    checkoutOutcome: 'Checkout remains gated until the v0.1.0 bundle zip is uploaded to Polar. Request access to join the release list.',
    refundPolicy: 'When checkout opens: 30-day no-questions refund via Polar.sh.',
    receiptInstruction: 'No payment is collected while gated. Live purchases receive a Polar VAT receipt and single zip download.',
    checkout: {
      provider: 'external',
      envKey: 'AGENTIC_INCOME_ABOS_PACK_BUNDLE_CHECKOUT_URL',
      fallback: 'request-access',
      buyLabel: 'Get ABOS Pack Bundle',
    },
  },
  {
    slug: 'agent-team-pro',
    tier: 'Production crew',
    ladderStage: 'system',
    title: 'Agent Team Pro',
    shortTitle: 'Agent Team Pro',
    price: '$129',
    summary: 'Multi-agent role specifications, bounded loop contracts, and independent reviewer gates extending the public skill pack into a multi-branch build workflow.',
    promise: 'Structure scout, builder, and independent-reviewer roles with explicit human money gates, stop budgets, and 12 months of release updates.',
    cta: 'Join Agent Team Pro waitlist',
    audience: 'Technical builders already running the free public skill pack who want isolated git worktree workflows and reviewer contracts.',
    firstWin: 'Configure one builder and independent-reviewer loop with explicit iteration budgets and human-gated publish rules.',
    deliverables: [
      'Role profiles for scout, builder, copy auditor, and reviewer',
      'Bounded loop contracts with iteration and elapsed-time ceilings',
      'Git worktree isolation and pre-merge verification checklists',
      '12 months of tagged release updates via Polar license key',
      'Architecture and boundary specification (PRODUCT.md)',
    ],
    outcomes: [
      'Clear separation between write branches and independent review',
      'Hard fail-closed boundaries around billing, DNS, and external sends',
      'Repeatable draft-PR verification before any production merge',
      'Structured handoff notes across sessions and coding tools',
    ],
    proof: [
      'Extends the public MIT skill contract in frankxai/agentic-income-skills.',
      'Labeled transparently in catalog.json as payload in assembly so checkout cannot open prematurely.',
      'Sells workflow machinery and templates rather than guaranteed financial outcomes.',
    ],
    support: '12 months of packaged updates once released, plus repository issue support for licensed buyers.',
    upgradePath: 'Request an Implementation Sprint if your team wants custom multi-agent workflows built and verified in your repository.',
    deliveryPath: '/offers/agent-team-pro#request-access',
    checkoutOutcome: 'Payload is currently in assembly and checkout is disabled. Joining the waitlist notifies you when v1.0 ships.',
    refundPolicy: 'No checkout is open today. Upon release, backed by our standard 30-day no-questions Polar refund.',
    receiptInstruction: 'No payment or receipt exists until v1.0 assembly completes and Polar checkout opens.',
    checkout: {
      provider: 'external',
      envKey: 'AGENTIC_INCOME_AGENT_TEAM_PRO_CHECKOUT_URL',
      fallback: 'request-access',
      buyLabel: 'Get Agent Team Pro',
    },
  },
  {
    slug: 'private-intel',
    tier: 'Monthly briefing',
    ladderStage: 'continuity',
    title: 'Private Intel',
    shortTitle: 'Private Intel',
    price: '$19/mo',
    summary: 'Monthly research briefings tracking affiliate commission diffs, sunset notices, new recurring AI programs, and comparison niches worth testing.',
    promise: 'Keep your recurring-payer ledger and comparison roadmap current each month without re-auditing dozens of partner terms from scratch.',
    cta: 'Request member access',
    audience: 'Publishers running active comparison pages or tool directories who want dated term-change diffs before quarterly public updates.',
    firstWin: 'Spot commission changes, cookie-window updates, or broken partner routes from one dated monthly Markdown brief.',
    deliverables: [
      'Monthly dated YYYY-MM-BRIEF.md research report',
      'Verified commission-rate and cookie-window diff table',
      'New recurring-payer shortlist additions and removals',
      'Three researched comparison opportunities with buyer-intent notes',
      'Async subscriber Q&A window',
    ],
    outcomes: [
      'Faster detection of partner-program term changes',
      'Grounded topic selection backed by documented buyer switching friction',
      'Fewer dead links or outdated commission disclosures on live pages',
      'Steady monthly review cadence',
    ],
    proof: [
      'Extends the verified affiliate catalog that powers /tools.',
      'Every brief entry carries a verification date and primary-source link.',
      'Prepared for recurring Polar subscription management with one-click portal cancellation.',
    ],
    support: 'Monthly brief delivery and async Q&A window. Done-for-you page builds are not included.',
    upgradePath: 'Pair with Implementation Sprint when you want a dedicated comparison or product surface engineered end-to-end.',
    deliveryPath: '/delivery/private-intel',
    checkoutOutcome: 'When recurring checkout is connected on Polar, subscribers route directly to the Private Intel delivery desk.',
    refundPolicy: 'Cancel anytime from the payment provider customer portal. If the first month was not useful, reply within 30 days for a full refund.',
    receiptInstruction: 'Keep the provider receipt and use the delivery desk to confirm monthly brief and Q&A access.',
    checkout: {
      provider: 'external',
      envKey: 'AGENTIC_INCOME_PRIVATE_INTEL_CHECKOUT_URL',
      fallback: 'request-access',
      buyLabel: 'Start Private Intel',
    },
  },
  {
    slug: 'implementation-sprint',
    tier: 'Agent-as-a-Service',
    ladderStage: 'continuity',
    title: 'Revenue System Implementation Sprint',
    shortTitle: 'Implementation Sprint',
    price: 'Scoped proposal',
    summary: 'A focused engagement to audit one workflow, design the offer architecture, implement the customer path on an isolated git branch, and hand over a verified preview.',
    promise: 'Turn one credible workflow into a working offer and product surface while keeping full ownership of your repository, process, and commercial decisions.',
    cta: 'Request a scoped plan',
    audience: 'Founder-led teams with domain expertise or an existing audience who want a working product surface built and verified rather than a slide deck.',
    firstWin: 'A written scope brief: customer job, commercial model, evidence standard, system boundary, delivery plan, and explicit stop conditions.',
    deliverables: [
      'Revenue-system audit and model recommendation',
      'Offer, capability, and customer-path architecture',
      'Git-backed implementation on an isolated branch',
      'Local quality gates and one Vercel preview URL',
      'Decision log, residual risks, and operating handoff',
    ],
    outcomes: [
      'One concrete customer path built in your own codebase',
      'A reviewable implementation your team can operate independently',
      'Inline disclosures, instrumentation boundaries, and proof near claims',
      'A clear go or no-go decision after inspecting the live preview',
    ],
    proof: [
      'The public skills repository exposes the underlying operating method.',
      'The deployable template and live routing directory show working components of the system.',
      'Every sprint is gated by repository checks, preview inspection, and written handoff.',
    ],
    support: 'Support and iteration boundaries are agreed in writing inside the scoped plan before any work begins.',
    upgradePath: 'Operate the system independently with our MIT skills, or package your workflow into a repeatable digital product.',
    deliveryPath: '/offers/implementation-sprint#request-access',
    checkoutOutcome: 'No payment is taken on this site. Submitting the form opens a scoped intake conversation so deliverables and acceptance checks come first.',
    refundPolicy: 'No checkout is active on-site for this service. Any commercial agreement states milestones, acceptance, and cancellation terms upfront.',
    receiptInstruction: 'No receipt is issued until a separate written scope and invoice are agreed.',
    accessMode: 'scope-first',
    checkout: {
      provider: 'internal',
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
