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
  tagline: 'Own the outcome.',
  description:
    'Turn one valuable workflow into a governed income system you own. Start with the free Field Guide, inspect the public method, or scope an Outcome Pack build.',
  author: 'Frank Riemer',
  // Hub links down to its spokes; spokes link up to the hub. Topical authority + referral flow.
  network: [
    { name: 'Agentic Passive Income', url: 'https://www.agenticpassiveincome.com', stage: 'AUTOMATE', pack: '/api', blurb: 'Streams that run on inspectable loops — content engines, product lines, honest affiliate systems.' },
    { name: 'Disruptive Passive Income', url: 'https://disruptivepassiveincome.com', stage: 'COMPOUND', pack: '/dpi', blurb: 'The sovereign wealth substrate — income architecture structurally decoupled from hours.' },
  ],
  nav: [
    { label: 'Start free', shortLabel: 'Start', href: '/start' },
    { label: 'Evidence', shortLabel: 'Evidence', href: '/proof' },
    { label: 'Method', shortLabel: 'Method', href: '/pack' },
    { label: 'Build Sprint', shortLabel: 'Build', href: '/offers/implementation-sprint' },
  ],
} as const

export type Site = typeof site
