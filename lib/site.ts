/**
 * Per-site brand config. This is the ONLY file that differs in brand between the
 * flagship and the two spokes — fork the repo, swap this, ship. Everything else
 * (components, engine binding, post infrastructure) is identical across the network.
 */
export const site = {
  name: 'Agentic Income',
  domain: 'agenticincome.ai',
  url: 'https://www.agenticincome.ai',
  role: 'hub', // 'hub' (flagship) | 'spoke'
  tagline: 'The AI-tool income desk. Trinity Earn Stage.',
  description:
    'An operating desk that turns AI-tool search demand into ranked comparisons, recurring-payer routes, an owned list, and a direct product ladder. Part of the Trinity Income Portfolio (Earn / Automate / Compound).',
  author: 'Frank',
  // Hub links down to its spokes; spokes link up to the hub. Topical authority + referral flow.
  network: [
    { name: 'Agentic Passive Income', url: 'https://www.agenticpassiveincome.com', blurb: 'The automation angle: durable loops, clear tradeoffs, and fewer fragile tool bets.' },
    { name: 'Disruptive Passive Income', url: 'https://disruptivepassiveincome.com', blurb: 'The market-shift angle: where AI tools change workflows enough to justify a new route.' },
    { name: 'Trinity Income Router', url: 'https://trinity.agenticincome.ai', blurb: 'Context-aware routing across Earn, Automate, Compound stages. Explorer → Shaper progression.' },
  ],
  nav: [
    { label: 'Onboarding', href: '/onboarding' },
    { label: 'Challenge', href: '/challenge' },
    { label: 'Discovery', href: '/discovery' },
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'Comparisons', href: '/blog' },
    { label: 'Tools', href: '/tools' },
    { label: 'Offers', href: '/offers' },
    { label: 'Trust', href: '/trust' },
    { label: 'Design', href: '/design' },
    { label: 'Start', href: '/start' },
  ],
  trinity: {
    stage: 'Earn',
    progression: ['Explorer', 'Builder', 'Operator', 'Shaper'],
    description: 'Stage progression with exportable skills, public-trust proofs, and marketplace mechanics absorption for $2-5k/mo retainers.',
  },
} as const

export type Site = typeof site
