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
  tagline: 'Build a system that earns.',
  description:
    'The honest playbook for making money with AI agents — real tool comparisons, the exact stacks, and income systems that compound while you sleep.',
  author: 'Frank',
  // Hub links down to its spokes; spokes link up to the hub. Topical authority + referral flow.
  network: [
    { name: 'Agentic Passive Income', url: 'https://agenticpassiveincome.ai', blurb: 'The passive-income angle — set it once, let it run.' },
    { name: 'Disruptive Passive Income', url: 'https://disruptivepassiveincome.com', blurb: 'The tools quietly replacing whole job functions.' },
  ],
  nav: [
    { label: 'Comparisons', href: '/blog' },
    { label: 'The Stack', href: '/blog/personal-ai-coe-under-100' },
    { label: 'Start Here', href: '/start' },
  ],
} as const

export type Site = typeof site
