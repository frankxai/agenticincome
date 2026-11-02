export type PackFileItem = {
  path: string
  sizeLabel: string
  kind: 'markdown' | 'skill' | 'json' | 'script'
  badge: string
  totalLines: number
  excerpt: string[]
}

export type PackManifest = {
  slug: string
  archiveName: string
  totalFilesLabel: string
  totalSizeLabel: string
  licenseShort: string
  plateSvg: string
  skipIf: string
  buyIf: string
  files: PackFileItem[]
}

export const PACK_MANIFESTS: Record<string, PackManifest> = {
  'starter-kit': {
    slug: 'starter-kit',
    archiveName: 'agentic-income-starter-kit.md',
    totalFilesLabel: '2 inspectable docs',
    totalSizeLabel: '6.4 KB',
    licenseShort: 'Free personal operator use',
    plateSvg: '/images/products/plate-starter-kit.svg',
    skipIf:
      'Skip this if you want mass-generated articles for tools you have never tested or a push-button revenue scheme.',
    buyIf:
      'Start here if you have real experience in one tool category and want a 30-minute structure for your first honest comparison and email capture.',
    files: [
      {
        path: 'downloads/agentic-income-starter-kit.md',
        sizeLabel: '3.8 KB',
        kind: 'markdown',
        badge: 'Live download',
        totalLines: 91,
        excerpt: [
          '# Agentic Income Starter Kit',
          '',
          'Use this kit to build the first complete revenue loop:',
          '1. one search-intent question',
          '2. one honest comparison',
          '3. one recurring-payer route',
          '4. one owned-audience capture',
          '5. one next product step',
          '',
          '## The 30-Minute Sprint',
          '### 00-05: Choose A Category',
          'Pick one AI-tool category you have touched directly.',
          'The recommendation has to survive: "Some links may pay us, but the best-fit tool still wins."',
        ],
      },
      {
        path: 'products/starter-kit/PRODUCT.md',
        sizeLabel: '2.6 KB',
        kind: 'markdown',
        badge: 'Spec',
        totalLines: 24,
        excerpt: [
          '# Income Flywheel Starter Kit - Product Specification',
          '',
          '- Product ID: starter-kit',
          '- Price: Free ($0, delivered immediately on-site)',
          '- Delivery Path: /delivery/starter-kit',
          '',
          '## What You Build in 30 Minutes',
          '1. 00-05 min: Pick one tool category you use weekly.',
          '2. 05-12 min: Write one plain-language comparison question.',
          '3. 12-20 min: Draft short answer, criteria, winner, and non-affiliate option.',
          '4. 20-25 min: Check recurring terms against the verified catalog.',
          '5. 25-30 min: Attach one workflow-specific checklist capture.',
        ],
      },
    ],
  },

  'vibe-os-pack': {
    slug: 'vibe-os-pack',
    archiveName: 'vibe-os-pack.zip',
    totalFilesLabel: '3 skills + 4 Python tools',
    totalSizeLabel: '42.0 KB',
    licenseShort: 'MIT source · Packaged edition',
    plateSvg: '/images/products/plate-vibe-os-pack.svg',
    skipIf:
      'Skip this if you want medical or therapeutic claims, do not use Suno or local audio tools, or prefer cloning frankxai/vibe-os from GitHub yourself for free.',
    buyIf:
      'Pick this if you create AI music or focus sessions and want the versioned skills, Python prompt/mixer utilities, and release checklist in one ready archive.',
    files: [
      {
        path: 'products/vibe-os-pack/PRODUCT.md',
        sizeLabel: '3.1 KB',
        kind: 'markdown',
        badge: 'Manifest',
        totalLines: 29,
        excerpt: [
          '# Vibe OS Pack - Product Specification',
          '',
          '- Price: $24 one-time (packaged edition)',
          '- Upstream Source: github.com/frankxai/vibe-os (MIT licensed)',
          '',
          '## Included Package Tree',
          '- skills/suno-prompt-architect/SKILL.md',
          '- skills/session-state-designer/SKILL.md',
          '- skills/catalog-release-qc/SKILL.md',
          '- tools/state_to_prompt.py',
          '- tools/stem_mixer.py & tools/tone_layer.py',
          '- docs/state-change-whitepaper.md',
        ],
      },
      {
        path: 'skills/suno-prompt-architect/SKILL.md',
        sizeLabel: '8.4 KB',
        kind: 'skill',
        badge: 'Skill',
        totalLines: 112,
        excerpt: [
          '---',
          'name: suno-prompt-architect',
          'description: Map target acoustic state, BPM, key, and arrangement metatags into clean Suno v4 prompts.',
          '---',
          '',
          '## Prompt Assembly Order',
          '1. Tempo & groove anchor (e.g. 120 BPM, tight brushed percussion)',
          '2. Harmonic center & timbre (F# minor, warm Rhodes, sub bass)',
          '3. Section metatags ([Intro] [Build] [Drop] [Outro])',
          '4. Vocal or instrumental boundary (explicitly prevent muddy mid-range crowding)',
        ],
      },
      {
        path: 'tools/state_to_prompt.py',
        sizeLabel: '6.2 KB',
        kind: 'script',
        badge: 'Python CLI',
        totalLines: 148,
        excerpt: [
          '"""Deterministic state-to-prompt compiler for Suno v4 sessions."""',
          'PRESETS = {',
          '    "deep_focus": {"bpm": "116-122", "key": "F#m", "vox": "instrumental"},',
          '    "sprint_build": {"bpm": "124-128", "key": "Am", "vox": "chopped_minimal"},',
          '    "evening_winddown": {"bpm": "76-84", "key": "Dm", "vox": "instrumental"},',
          '}',
          '',
          'def build_prompt(state: str, genre: str) -> str:',
          '    cfg = PRESETS[state]',
          '    return f"{genre}, {cfg[\'bpm\']} BPM, {cfg[\'key\']}, {cfg[\'vox\']}, crisp transients"',
        ],
      },
    ],
  },

  'claims-guard-pack': {
    slug: 'claims-guard-pack',
    archiveName: 'claims-guard-pack-v0.1.0.zip',
    totalFilesLabel: '4 files · 5 audit gates',
    totalSizeLabel: '28.5 KB',
    licenseShort: 'MIT source · Packaged edition',
    plateSvg: '/images/products/plate-claims-guard-pack.svg',
    skipIf:
      'Skip this if you require formal legal review from a licensed attorney (this is an editorial audit skill, never legal advice) or prefer pulling the MIT source from GitHub.',
    buyIf:
      'Pick this if you publish comparisons, product pages, or newsletters and want deterministic checks for earnings claims, dated citations, voice restraint, and disclosures.',
    files: [
      {
        path: 'products/claims-guard-pack/PRODUCT.md',
        sizeLabel: '3.4 KB',
        kind: 'markdown',
        badge: 'Manifest',
        totalLines: 32,
        excerpt: [
          '# Claims Guard Pack - Product Specification',
          '',
          '## Five Verification Gates Inside the Pack',
          '1. Gate 1 - Regulated & Earnings Claims (Zero Tolerance)',
          '2. Gate 2 - Citation & Date Freshness (as of YYYY-MM + URL)',
          '3. Gate 3 - Brand Voice & Editorial Restraint',
          '4. Gate 4 - FTC/EU Inline Disclosure Completeness',
          '5. Gate 5 - Page Structure & Candid Skip Boundaries',
        ],
      },
      {
        path: 'rules/claims-guard-rules.json',
        sizeLabel: '9.6 KB',
        kind: 'json',
        badge: 'Rule set',
        totalLines: 164,
        excerpt: [
          '{',
          '  "version": "0.1.0",',
          '  "gates": [',
          '    { "id": "earnings-promise", "severity": "error", "action": "Remove unverified dollar outcome claims." },',
          '    { "id": "undated-price", "severity": "error", "action": "Attach as-of month/year and vendor pricing URL." },',
          '    { "id": "missing-disclosure", "severity": "error", "action": "Place material connection note above first paid link." },',
          '    { "id": "contrast-cliche", "severity": "warn", "action": "Replace rhetorical X-not-Y line with concrete fact." }',
          '  ]',
          '}',
        ],
      },
      {
        path: 'blocks/disclosure-snippets.md',
        sizeLabel: '4.2 KB',
        kind: 'markdown',
        badge: 'Templates',
        totalLines: 58,
        excerpt: [
          '## Standard Comparison Disclosure (Place Above First Paid Link)',
          '',
          'Disclosure: Some vendor links on this page are affiliate links that pay a commission',
          'at no extra cost to you. Rankings follow hands-on fit and switching cost first;',
          'every comparison names at least one non-affiliate option.',
        ],
      },
    ],
  },

  blueprint: {
    slug: 'blueprint',
    archiveName: 'income-architecture-blueprint-v2.zip',
    totalFilesLabel: '5 Markdown specs',
    totalSizeLabel: '118.4 KB',
    licenseShort: 'Personal commercial license',
    plateSvg: '/images/products/plate-blueprint.svg',
    skipIf:
      'Skip this if you want video lectures, a chat community, private consulting, or guaranteed earnings predictions. Every number inside is a labeled scenario with named assumptions.',
    buyIf:
      'Pick this when you are ready to turn one skill, comparison workflow, or digital pack into a structured operating plan with fulfillment runbooks and kill-by-date criteria.',
    files: [
      {
        path: 'products/blueprint/00-README.md',
        sizeLabel: '4.1 KB',
        kind: 'markdown',
        badge: 'Entry guide',
        totalLines: 66,
        excerpt: [
          '# Income Architecture Blueprint - v2',
          '',
          'Version: 2.0 · Price: $67 one-time · 30-day no-questions refund',
          '',
          'Three complete business-plan kits (services, products, systems) plus the operating',
          'discipline to run whichever one you pick.',
          '',
          'Each kit includes:',
          '1. Full planning template',
          '2. Worked fictional example from start to finish',
          '3. Scenario economics tables with named assumptions',
          '4. Agent-role fulfillment runbook with quality gates',
          '5. Launch sequence & kill-criterion worksheet',
        ],
      },
      {
        path: 'products/blueprint/product-kit.md',
        sizeLabel: '36.2 KB',
        kind: 'markdown',
        badge: 'Kit 02',
        totalLines: 412,
        excerpt: [
          '# Model 2 Kit: Packaged Judgment (Digital Products)',
          '',
          'Use when: You have solved a problem at least twice and can package the',
          'checklists, schemas, or scripts so another builder saves 10+ hours.',
          '',
          '## Section 1: Artifact Narrowing',
          '- Buyer job in one plain sentence:',
          '- Exact files inside the archive (never sell a vague promise):',
          '- Pre-purchase inspection proof (what the buyer reads for free):',
          '- Kill criterion: If < N qualified requests or sales by YYYY-MM-DD, revise or archive.',
        ],
      },
      {
        path: 'products/blueprint/service-kit.md',
        sizeLabel: '38.0 KB',
        kind: 'markdown',
        badge: 'Kit 01',
        totalLines: 428,
        excerpt: [
          '# Model 1 Kit: Agent-Amplified Services',
          '',
          'Use when: You have 8+ focused hours per week and need first revenue within 30 days.',
          '',
          '## Fixed-Scope Sprint Contract Checklist',
          '- Exact repository / workflow input state:',
          '- Non-goals (what this sprint refuses to touch):',
          '- Verification gate before handoff:',
          '- Written stop conditions & handover bundle:',
        ],
      },
      {
        path: 'products/blueprint/system-kit.md',
        sizeLabel: '40.1 KB',
        kind: 'markdown',
        badge: 'Kit 03',
        totalLines: 446,
        excerpt: [
          '# Model 3 Kit: Operated Catalog & Comparison Systems',
          '',
          'Use when: You have under 8 hours per week and are building a durable comparison',
          'and tool-routing asset with strict maintenance floors.',
          '',
          '## Monthly Freshness Cadence',
          '- Re-verify vendor pricing & commission terms before updating tables',
          '- Keep best-fit non-affiliate picks intact regardless of payout',
        ],
      },
    ],
  },

  'abos-pack-bundle': {
    slug: 'abos-pack-bundle',
    archiveName: 'abos-pack-bundle-v0.1.0.zip',
    totalFilesLabel: '4 skill packs + registry',
    totalSizeLabel: '94.0 KB',
    licenseShort: 'MIT source · Packaged bundle',
    plateSvg: '/images/products/plate-abos-pack-bundle.svg',
    skipIf:
      'Skip this if you expect a hosted SaaS web app with user logins, or if you prefer assembling the four MIT folders yourself from frankxai/agentic-business-os.',
    buyIf:
      'Pick this if you run your business out of local Markdown/JSON repos and want Claims Guard, Business Intelligence, Design Contract, and Weekly Rhythm wired together.',
    files: [
      {
        path: 'products/abos-pack-bundle/PRODUCT.md',
        sizeLabel: '3.2 KB',
        kind: 'markdown',
        badge: 'Bundle spec',
        totalLines: 28,
        excerpt: [
          '# Agentic Business OS Pack Bundle - Product Specification',
          '',
          '## Four Coordinated Skill Packs Included',
          '1. claims-guard-pack/ ($39 standalone): 5-gate pre-publish copy & disclosure check',
          '2. business-intelligence-pack/: File-based decision, spend & offer memory',
          '3. design-contract-pack/: design.md + taste.md non-averaged reference locks',
          '4. weekly-rhythm-pack/: Founder Monday scope & Friday verification loop',
          '5. registry.json + PRODUCT-BUNDLE.md: Cross-harness install guide',
        ],
      },
      {
        path: 'packs/registry.json',
        sizeLabel: '2.9 KB',
        kind: 'json',
        badge: 'Registry',
        totalLines: 54,
        excerpt: [
          '{',
          '  "bundle": "agentic-business-os",',
          '  "version": "0.1.0",',
          '  "packs": ["claims-guard-pack", "business-intelligence-pack", "design-contract-pack", "weekly-rhythm-pack"],',
          '  "harnesses": ["claude-code", "codex", "opencode", "grok", "antigravity"]',
          '}',
        ],
      },
    ],
  },

  'agent-team-pro': {
    slug: 'agent-team-pro',
    archiveName: 'agent-team-pro-v1.zip',
    totalFilesLabel: '5 role specs + 4 loops',
    totalSizeLabel: 'Payload in assembly',
    licenseShort: 'Personal license + 12 mo updates',
    plateSvg: '/images/products/plate-agent-team-pro.svg',
    skipIf:
      'Skip this if you have not shipped your first single-pack or comparison workflow yet, or if you want unmonitored agents executing spend or external messages.',
    buyIf:
      'Join the waitlist if you coordinate multiple coding harnesses in parallel git worktrees and want battle-tested maker/verifier loop contracts and regression gates.',
    files: [
      {
        path: 'products/agent-team-pro/PRODUCT.md',
        sizeLabel: '3.0 KB',
        kind: 'markdown',
        badge: 'Roadmap spec',
        totalLines: 28,
        excerpt: [
          '# Agent Team Pro - Product Specification',
          '',
          '- Status: Payload in assembly (not open for checkout)',
          '- Price band: $129 one-time with 12 months of updates',
          '',
          '## Planned Architecture Inside the Kit',
          '1. agents/: Coordinator, Maker, Independent Verifier, Scout, Editorial Gatekeeper',
          '2. loops/: LOOP.md, GATE.md, WORKER.md, VERIFIER.md with budget caps',
          '3. workflows/: Git worktree isolation & path-lane locking',
          '4. evals/: Deterministic link, voice, and checkout-gate test runners',
        ],
      },
      {
        path: 'loops/release-verify/LOOP.md',
        sizeLabel: '4.4 KB',
        kind: 'markdown',
        badge: 'Preview template',
        totalLines: 64,
        excerpt: [
          '# Loop Contract: Release Verification',
          '',
          '- Actor model: 1 Maker worktree + 1 Independent Verifier + Human Money Gate',
          '- Max iterations: 3 · No-progress stop: 1',
          '- Required exit receipt: lint + test + type-check + static link check + SHA-256 log',
          '- Forbidden scope: live pricing changes, wallet actions, external customer sends',
        ],
      },
    ],
  },

  'private-intel': {
    slug: 'private-intel',
    archiveName: 'YYYY-MM-BRIEF.md',
    totalFilesLabel: 'Monthly Markdown brief',
    totalSizeLabel: '12-18 KB / issue',
    licenseShort: 'Personal subscription · Cancel anytime',
    plateSvg: '/images/products/plate-private-intel.svg',
    skipIf:
      'Skip this if you are still setting up your first page (use the free Starter Kit first) or if you want daily hype news digests rather than monthly catalog diffs.',
    buyIf:
      'Request access if you already operate comparison or product routes and want monthly payer-term drift, watchlist notes, and structured Q&A.',
    files: [
      {
        path: 'products/private-intel/2026-06-BRIEF.md',
        sizeLabel: '2.4 KB',
        kind: 'markdown',
        badge: 'Archive sample',
        totalLines: 47,
        excerpt: [
          '# Private Intel Brief',
          'Date: 2026-06-26',
          '',
          '## Thesis',
          'The durable opportunity is maintained comparison memory around tools with',
          'recurring economics, real switching pain, and clear buyer intent.',
          '',
          '## Monthly Operating Question',
          'Which page would still be useful if every affiliate program disappeared tomorrow?',
          'That page gets built first.',
        ],
      },
    ],
  },

  'implementation-sprint': {
    slug: 'implementation-sprint',
    archiveName: 'scoped-sprint-handoff/',
    totalFilesLabel: '5 handoff artifacts',
    totalSizeLabel: 'Git branch + preview',
    licenseShort: 'Buyer owns 100% of repo & code',
    plateSvg: '/images/products/plate-implementation-sprint.svg',
    skipIf:
      'Skip this if you want an open-ended strategy deck without code, or if you have not yet identified a concrete workflow or audience to build around.',
    buyIf:
      'Request a scoped plan when you have an active product or content workflow and want an isolated git branch, local quality gates, and a verified Vercel preview handed over cleanly.',
    files: [
      {
        path: 'handoff/00-SCOPE-AND-STOP-CONDITIONS.md',
        sizeLabel: '4.8 KB',
        kind: 'markdown',
        badge: 'Scope template',
        totalLines: 52,
        excerpt: [
          '# Implementation Sprint Scope & Acceptance Contract',
          '',
          '1. Customer job & single primary conversion path',
          '2. Allowed repository write paths (isolated agent branch)',
          '3. Verification gates: lint, unit tests, type-check, static links, build',
          '4. Explicit stop conditions & human-gated commercial switches',
          '5. Residual risk ledger & team handover instructions',
        ],
      },
    ],
  },
}

export function getPackManifest(slug: string): PackManifest | undefined {
  return PACK_MANIFESTS[slug]
}
