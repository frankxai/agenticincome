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
    slug: 'pricing-ai-work',
    title: 'When the buyer’s ceiling is below your price floor',
    dek: 'Four ways to price AI work, and a quote-review pilot with a €125 gap between what the seller needs and the buyer can justify.',
    query: 'pricing AI services seller margin buyer payback',
    date: '2026-11-28',
    cluster: 'income',
    tools: [],
  },
  {
    slug: 'quote-review-pilot',
    title: 'Can a €1,500 quote-review pilot pay for itself?',
    dek: 'Follow the supplier margin, buyer payback and acceptance test. Download the model and change the assumptions.',
    query: 'AI quote review implementation pilot economics',
    date: '2026-11-27',
    cluster: 'income',
    tools: [],
    featured: true,
  },
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
    title: 'Best AI Tools for a Faceless YouTube Channel',
    dek: 'An AI stack for a faceless channel: script, voice, video, edit and clip, with each price checked against the vendor pricing page.',
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
    title: 'How to Build a Personal AI Center of Excellence',
    dek: 'A personal AI Center of Excellence: one tool for each of six capabilities, with each price checked against the vendor pricing page.',
    query: 'personal ai stack under 100',
    date: '2026-06-08',
    cluster: 'income',
    tools: ['Higgsfield', 'ElevenLabs', 'Systeme.io', 'CapCut', 'Copy.ai'],
    featured: true,
  },
  {
    slug: 'the-agentic-income-flywheel-2026',
    title: 'The Agentic Income Flywheel: Honest Comparisons + Recurring Tools + Owned Audience (2026)',
    dek: 'How one honest comparison, recurring-commission programs, and an owned email list work together across the network, with program terms taken from the live catalog.',
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
