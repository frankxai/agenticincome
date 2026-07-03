/**
 * Per-site brand config. This is the ONLY file that differs in brand between the
 * flagship and the two spokes — fork the repo, swap this, ship. Everything else
 * (components, engine binding, post infrastructure) is identical across the network.
 */
export const site = {
  name: 'Agentic Income',
  domain: 'agenticincome.ai',
  url: 'https://agenticincome.ai',
  role: 'hub', // 'hub' (flagship) | 'spoke'
  tagline: 'The AI-tool income desk.',
  description:
    'A premium intelligence desk for turning AI-tool demand into honest comparisons, recurring payer routes, owned audience, and direct product systems.',
  author: 'Frank',
  // Hub links down to its spokes; spokes link up to the hub. Topical authority + referral flow.
  network: [
    { name: 'Agentic Passive Income', url: 'https://agenticpassiveincome.com', blurb: 'The automation angle: durable loops, clear tradeoffs, and fewer fragile tool bets.' },
    { name: 'Disruptive Passive Income', url: 'https://disruptivepassiveincome.com', blurb: 'The market-shift angle: where AI tools change workflows enough to justify a new route.' },
  ],
  nav: [
    { label: 'Comparisons', href: '/blog' },
    { label: 'Tools', href: '/tools' },
    { label: 'Offers', href: '/offers' },
    { label: 'Trust', href: '/trust' },
    { label: 'Design', href: '/design' },
    { label: 'Start', href: '/start' },
  ],
} as const

export type Site = typeof site
