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
  tagline: 'Revenue systems built with agents, delivered with proof.',
  description:
    'Agent-as-a-Service implementation, open-source revenue-system skills, practical digital products, and reader-first AI tool research.',
  author: 'Frank',
  // Hub links down to its spokes; spokes link up to the hub. Topical authority + referral flow.
  network: [
    { name: 'Agentic Passive Income', url: 'https://www.agenticpassiveincome.com', blurb: 'The automation angle: durable loops, clear tradeoffs, and fewer fragile tool bets.' },
    { name: 'Disruptive Passive Income', url: 'https://disruptivepassiveincome.com', blurb: 'The market-shift angle: where AI tools change workflows enough to justify a new route.' },
  ],
  nav: [
    { label: 'Implementation', href: '/offers/implementation-sprint' },
    { label: 'Offers', href: '/offers' },
    { label: 'Open source', href: 'https://github.com/frankxai/agentic-income-skills' },
    { label: 'Research', href: '/blog' },
    { label: 'Trust', href: '/trust' },
  ],
} as const

export type Site = typeof site
