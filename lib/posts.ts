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
    slug: 'best-ai-video-generator-2026',
    title: 'Best AI Video Generator 2026: The Honest Pick for Creators Building Income',
    dek: 'Sora, Veo, and Kling produce the best raw quality and pay creators nothing. Higgsfield is the honest pick for a creator building a video business — and Pollo AI is the backdoor to the giants.',
    query: 'best ai video generator 2026',
    date: '2026-07-06',
    cluster: 'creator',
    tools: ['Higgsfield', 'Pika', 'Pollo AI', 'Topaz Labs'],
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
  {
    slug: 'systeme-io-review-2026',
    title: 'Systeme.io Review 2026: The All-in-One Creator Platform, Honestly Assessed',
    dek: 'Funnels, email, courses, and a membership site in one tool. What it does well, where it loses to specialists, and who should actually buy it.',
    query: 'systeme.io review',
    date: '2026-07-05',
    cluster: 'income',
    tools: ['Systeme.io', 'Copy.ai', 'Writesonic'],
    featured: true,
  },
  {
    slug: 'copy-ai-vs-writesonic-vs-rytr',
    title: 'Copy.ai vs Writesonic vs Rytr (2026): Honest Verdict',
    dek: 'Three AI writing tools, one honest verdict — Copy.ai for brand voice, Writesonic as the all-around winner, Rytr as the lifetime-recurring budget pick.',
    query: 'copy.ai vs writesonic vs rytr',
    date: '2026-07-05',
    cluster: 'income',
    tools: ['Copy.ai', 'Writesonic', 'Rytr'],
    featured: true,
  },
  {
    slug: 'best-ai-video-upscaler-2026',
    title: 'Best AI Video Upscaler 2026 (Honest Verdict + Who Should Skip It)',
    dek: 'What AI upscaling actually does, who genuinely needs it, and an honest look at Topaz Labs Video AI and Photo AI — including who should skip it entirely.',
    query: 'best ai video upscaler',
    date: '2026-07-05',
    cluster: 'creator',
    tools: ['Topaz Labs'],
    featured: true,
  },
  {
    slug: 'heygen-vs-synthesia',
    title: 'HeyGen vs Synthesia 2026: Which One Should You Actually Buy?',
    dek: "A practical buyer's guide for creators and small teams — which AI avatar tool earns back its subscription, HeyGen or Synthesia.",
    query: 'heygen vs synthesia',
    date: '2026-07-05',
    cluster: 'creator',
    tools: ['HeyGen', 'Synthesia'],
    featured: true,
  },
  {
    slug: 'best-ai-presentation-maker-2026',
    title: 'Best AI Presentation Maker 2026: Gamma vs Canva vs the Rest',
    dek: 'The honest pick for AI presentation makers in 2026 — why Gamma wins on product merit, and when Canva is the smarter buy.',
    query: 'best ai presentation maker',
    date: '2026-07-05',
    cluster: 'creator',
    tools: ['Gamma', 'Canva'],
    featured: true,
  },
]

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug)
}

export const sortedPosts = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1))
