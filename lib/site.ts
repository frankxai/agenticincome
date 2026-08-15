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
  tagline: 'Build income with AI agents — machinery you can inspect.',
  description:
    'The engineering discipline of agentic income: a dated, re-verified knowledge base, the installable /ai Income Architect pack, self-serve products, and attested proof. No income promises — machinery and education.',
  author: 'Frank Riemer',
  // Hub links down to its spokes; spokes link up to the hub. Topical authority + referral flow.
  network: [
    { name: 'Agentic Passive Income', url: 'https://www.agenticpassiveincome.com', stage: 'AUTOMATE', pack: '/api', blurb: 'Streams that run on inspectable loops — content engines, product lines, honest affiliate systems.' },
  ],
  nav: [
    { label: 'Build', href: '/build' },
    { label: 'Operate', href: '/operate' },
    { label: 'Proof', href: '/proof' },
    { label: 'Offers', href: '/offers' },
    { label: 'Trust', href: '/trust' },
    { label: 'Pack', href: '/pack' },
  ],
} as const

export type Site = typeof site
