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
    { name: 'Disruptive Passive Income', url: 'https://disruptivepassiveincome.com', stage: 'COMPOUND', pack: '/dpi', blurb: 'The sovereign wealth substrate — income architecture structurally decoupled from hours.' },
  ],
  nav: [
    { label: 'Pack', href: '/pack' },
    { label: 'Challenge', href: '/challenge' },
    { label: 'Knowledge', href: 'https://github.com/frankxai/agenticincome/tree/main/knowledge' },
    { label: 'Offers', href: '/offers' },
    { label: 'Research', href: '/blog' },
    { label: 'Trust', href: '/trust' },
  ],
} as const

export type Site = typeof site
