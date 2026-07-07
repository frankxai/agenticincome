export const designTokens = {
  color: {
    bg: '#05060A',
    surface: '#0A0C14',
    surface2: '#101522',
    border: '#1A1F2E',
    ink: '#F1F3F9',
    muted: '#8A90A8',
    accent: '#6EA8FE',
    accent2: '#A78BFA',
    gold: '#D6B56D',
    green: '#34D399',
    danger: '#FB7185',
  },
  radius: {
    control: '8px',
    panel: '12px',
    feature: '20px',
  },
  motion: {
    micro: 120,
    fast: 180,
    base: 260,
    slow: 420,
    signature: 900,
    easing: 'power3.out',
  },
} as const

export const brandPillars = [
  {
    title: 'Fit ranks first',
    body: 'The best tool wins before payout is considered. ChatGPT and Claude pay nothing and still take the top slot when they are the answer.',
  },
  {
    title: 'Recurring-payer routing',
    body: 'Revenue comes from tools that pay recurring and fit the recommendation they appear in.',
  },
  {
    title: 'Owned audience',
    body: 'Email capture turns one search visit into a durable relationship and a direct product path.',
  },
  {
    title: 'Reusable engine',
    body: 'One catalog, one template, one audit loop, and multiple audience angles across the network.',
  },
] as const
export const motionSystem = {
  thesis: 'Make compounding visible without delaying reading or action.',
  modes: [
    'Functional UI feedback at 120-180ms',
    'Section reveals at 260-420ms',
    'One signature flow trace at 900ms',
    'Reduced motion removes spatial travel and preserves static meaning',
  ],
} as const

export const swarmLeads = [
  'Creative Director',
  'Brand Strategist',
  'Product Designer',
  'Motion Design Studio',
  'Frontend Engineer',
  'Monetization SEO Agent',
  'Visual QA Red Team',
  'Vercel Release Engineer',
] as const

export const qualityGate = [
  'First viewport shows the actual income mechanism.',
  'All exact text in diagrams is coded, not generated into raster images.',
  'Canonical logo is vector-first and one-color safe.',
  'Affiliate links only render when catalog links exist.',
  'Motion has a named job and reduced-motion fallback.',
  'Desktop, mobile, and reduced-motion states are inspected before ship.',
] as const
