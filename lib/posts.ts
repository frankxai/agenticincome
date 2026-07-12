/**
 * Curated post registry — drives the blog index, ordering, and metadata.
 * Content itself lives in app/blog/<slug>/page.mdx. Add an entry here when you add a post.
 */
export type Post = {
  slug: string
  title: string
  dek: string
  query: string
  date: string
  cluster: 'coding' | 'creator' | 'local' | 'aeo' | 'income'
  tools: string[]
  featured?: boolean
}

export const posts: Post[] = [
  {
    slug: 'two-day-sprint-dissected',
    title: 'The Two-Day Implementation Sprint, Dissected',
    dek: 'The full anatomy of an agent-team delivery — the five fulfillment patterns, the honest cost table (human hours + agent spend), and what clients actually receive.',
    query: 'ai agent implementation sprint',
    date: '2026-07-11',
    cluster: 'income',
    tools: ['Claude Code', 'Codex'],
    featured: true,
  },
  {
    slug: 'best-ai-tools-faceless-youtube',
    title: 'Best AI Tools for a Faceless YouTube Channel (Full Stack Under $60/mo)',
    dek: 'The exact AI stack to run a faceless channel — script, voice, video, edit, clip — for the price of one streaming subscription.',
    query: 'best ai tools faceless youtube',
    date: '2026-06-08',
    cluster: 'creator',
    tools: ['ElevenLabs', 'CapCut', 'Descript', 'Higgsfield', 'Canva'],
    featured: true,
  },
  {
    slug: 'elevenlabs-alternatives',
    title: 'Best ElevenLabs Alternatives 2026 (Cheapest That Still Sounds Human)',
    dek: 'Six AI voices ranked by quality-per-dollar — and the one most creators should actually pick.',
    query: 'elevenlabs alternatives cheaper',
    date: '2026-06-08',
    cluster: 'creator',
    tools: ['ElevenLabs', 'CapCut', 'Descript'],
    featured: true,
  },
  {
    slug: 'personal-ai-coe-under-100',
    title: 'How to Build a Personal AI Center of Excellence Under $100/mo',
    dek: 'The exact stack an AI architect runs at home — the same 6-pillar system Fortune 500s pay millions for, for under $100 a month.',
    query: 'personal ai stack under 100',
    date: '2026-06-08',
    cluster: 'income',
    tools: ['Higgsfield', 'ElevenLabs', 'Systeme.io', 'CapCut', 'Copy.ai'],
    featured: true,
  },
  {
    slug: 'the-agentic-income-flywheel-2026',
    title: 'The Agentic Income Flywheel: Honest Comparisons + Recurring Tools + Owned Audience (2026)',
    dek: 'The exact system that turns one ranking comparison into recurring commissions, an email list, and content that earns for years across the whole network.',
    query: 'agentic income flywheel method',
    date: '2026-06-14',
    cluster: 'income',
    tools: ['Higgsfield', 'Systeme.io', 'ElevenLabs', 'Gamma', 'CapCut', 'HeyGen', 'Synthesia', 'Opus Clip'],
    featured: true,
  },
]

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug)
}

export const sortedPosts = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1))
