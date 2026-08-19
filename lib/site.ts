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
  tagline: 'Earn with agents. Keep the judgment.',
  description:
    'The operating system for people who build income with AI agent teams: playbooks, partner economics, working code — and a live MCP server your agents can query. Claims are dated and sourced. We never promise income.',
  author: 'Frank Riemer',
  // Hub links down to its spokes; spokes link up to the hub. Topical authority + referral flow.
  network: [
    { name: 'Agentic Passive Income', url: 'https://www.agenticpassiveincome.com', stage: 'AUTOMATE', pack: '/api', blurb: 'Streams that run on inspectable loops — content engines, product lines, honest affiliate systems.' },
  ],
  nav: [
    { label: 'MCP', href: '/mcp' },
    { label: 'Build', href: '/build' },
    { label: 'Operate', href: '/operate' },
    { label: 'Proof', href: '/proof' },
    { label: 'Offers', href: '/offers' },
    { label: 'Trust', href: '/trust' },
    { label: 'Pack', href: '/pack' },
  ],
} as const

export type Site = typeof site
