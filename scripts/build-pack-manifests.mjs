#!/usr/bin/env node

import { readFileSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(1)} KB`
}

function readDiskItem(diskPath, { displayPath = diskPath, kind = 'markdown', badge, excerptLines = 20, protectedDeliverable = false, previewPath }) {
  const abs = path.join(root, diskPath)
  const bytes = statSync(abs).size
  const raw = readFileSync(abs, 'utf8')
  const lines = raw.replace(/\r\n/g, '\n').split('\n')
  if (lines.length > 1 && lines[lines.length - 1] === '') {
    lines.pop()
  }
  let excerpt
  if (previewPath) {
    const sample = readFileSync(path.join(root, previewPath), 'utf8')
      .replace(/\r\n/g, '\n').trimEnd().split('\n')
    if (protectedDeliverable && sample.length >= lines.length) {
      throw new Error(`Public sample must be shorter than protected deliverable: ${diskPath}`)
    }
    excerpt = sample
  } else {
    if (protectedDeliverable && lines.length <= excerptLines) {
      throw new Error(`Protected deliverable needs an explicit partial sample: ${diskPath}`)
    }
    excerpt = lines.slice(0, Math.min(excerptLines, lines.length))
  }
  if (protectedDeliverable && excerpt.join('\n').trimEnd() === raw.replace(/\r\n/g, '\n').trimEnd()) {
    throw new Error(`Protected deliverable would be exposed in full: ${diskPath}`)
  }
  return {
    path: displayPath,
    diskPath,
    bytes,
    sizeLabel: formatSize(bytes),
    kind,
    badge,
    totalLines: lines.length,
    excerpt,
  }
}

const catalog = JSON.parse(readFileSync(path.join(root, 'products/catalog.json'), 'utf8'))
const blueprintCatalog = catalog.products.find((p) => p.id === 'blueprint')
const blueprintBadges = {
  'products/blueprint/00-README.md': 'Entry guide',
  'products/blueprint/operating-desk-architecture.md': 'Desk & cadence',
  'products/blueprint/coding-tool-comparison-matrix.md': 'Tool matrix & MDX',
  'products/blueprint/recurring-payer-catalog.csv': '2-row CSV sample',
  'products/blueprint/offer-and-waitlist-ladder.md': 'Offer ladder & schema',
  'products/blueprint/polar-fulfillment-checklist.md': 'Polar gate checklist',
  'products/blueprint/MANIFEST.json': 'SHA-256 manifest',
}

function inferKind(diskPath) {
  if (diskPath.endsWith('.csv')) return 'csv'
  if (diskPath.endsWith('.json')) return 'json'
  return 'markdown'
}

const blueprintFiles = blueprintCatalog.delivery.files.map((diskPath) =>
  readDiskItem(diskPath, {
    kind: inferKind(diskPath),
    badge: blueprintBadges[diskPath] || 'Delivered file',
    excerptLines: 22,
    protectedDeliverable: true,
    previewPath: diskPath === 'products/blueprint/recurring-payer-catalog.csv'
      ? 'products/blueprint/previews/recurring-payer-catalog.sample.csv'
      : undefined,
  })
)
const blueprintTotalBytes = blueprintFiles.reduce((sum, f) => sum + f.bytes, 0)

const starterFiles = [
  readDiskItem('public/downloads/agentic-income-starter-kit.md', {
    displayPath: 'downloads/agentic-income-starter-kit.md',
    badge: 'Live download',
    excerptLines: 22,
  }),
  readDiskItem('products/starter-kit/PRODUCT.md', {
    badge: 'Package spec',
    excerptLines: 18,
  }),
]
const starterTotalBytes = starterFiles.reduce((sum, f) => sum + f.bytes, 0)

const vibeFiles = [
  readDiskItem('products/vibe-os-pack/PRODUCT.md', {
    badge: 'Package spec',
    excerptLines: 22,
  }),
]

const claimsFiles = [
  readDiskItem('products/claims-guard-pack/PRODUCT.md', {
    badge: 'Package spec',
    excerptLines: 25,
  }),
]

const abosFiles = [
  readDiskItem('products/abos-pack-bundle/PRODUCT.md', {
    badge: 'Bundle spec',
    excerptLines: 19,
  }),
]

const teamFiles = [
  readDiskItem('products/agent-team-pro/PRODUCT.md', {
    badge: 'Roadmap spec',
    excerptLines: 17,
  }),
]

const intelFiles = [
  readDiskItem('products/private-intel/2026-06-BRIEF.md', {
    badge: 'Sample brief',
    excerptLines: 24,
  }),
]

const sprintFiles = [
  readDiskItem('products/implementation-sprint/PRODUCT.md', {
    badge: 'Sprint scope spec',
    excerptLines: 26,
  }),
]

const manifests = {
  'starter-kit': {
    slug: 'starter-kit',
    previewMode: 'deliverable-files',
    archiveName: 'agentic-income-starter-kit.md',
    totalFilesLabel: `${starterFiles.length} delivered files`,
    totalSizeLabel: formatSize(starterTotalBytes),
    licenseShort: 'Free personal business use',
    plateSvg: '/images/products/plate-starter-kit.svg',
    skipIf:
      'Skip this if you want mass-generated articles for tools you have never tested or an automated revenue scheme.',
    buyIf:
      'Start here if you have firsthand experience in one tool category and want a 30-minute structure for your first honest comparison and email capture.',
    files: starterFiles,
  },
  'vibe-os-pack': {
    slug: 'vibe-os-pack',
    previewMode: 'product-specification',
    archiveName: 'products/vibe-os-pack/PRODUCT.md',
    totalFilesLabel: 'Product specification · MIT source in frankxai/vibe-os',
    totalSizeLabel: `${vibeFiles[0].sizeLabel} spec`,
    licenseShort: 'MIT source · Packaged edition',
    plateSvg: '/images/products/plate-vibe-os-pack.svg',
    skipIf:
      'Skip this if you want medical or therapeutic claims, do not use Suno or local audio scripts, or prefer cloning frankxai/vibe-os from GitHub yourself for free.',
    buyIf:
      'Pick this if you create AI music or focus sessions and want the versioned skills, Python prompt and mixer scripts, and release checklist in one ready archive.',
    files: vibeFiles,
  },
  'claims-guard-pack': {
    slug: 'claims-guard-pack',
    previewMode: 'product-specification',
    archiveName: 'products/claims-guard-pack/PRODUCT.md',
    totalFilesLabel: 'Product specification · MIT source in frankxai/agentic-business-os',
    totalSizeLabel: `${claimsFiles[0].sizeLabel} spec`,
    licenseShort: 'MIT source · Packaged edition',
    plateSvg: '/images/products/plate-claims-guard-pack.svg',
    skipIf:
      'Skip this if you require formal legal review from a licensed attorney (this is an editorial audit skill, never legal advice) or prefer pulling the MIT source from GitHub.',
    buyIf:
      'Pick this if you publish comparisons, product pages, or newsletters and want deterministic checks for earnings claims, dated citations, voice restraint, and disclosures.',
    files: claimsFiles,
  },
  blueprint: {
    slug: 'blueprint',
    previewMode: 'deliverable-files',
    archiveName: 'agentic-income-operating-desk-v3',
    totalFilesLabel: `${blueprintFiles.length} delivered files`,
    totalSizeLabel: formatSize(blueprintTotalBytes),
    licenseShort: 'Personal commercial license',
    plateSvg: '/images/products/plate-blueprint.svg',
    skipIf:
      'Skip this if you want video lectures, a chat community, private consulting, or guaranteed earnings predictions. Every financial table inside is a labeled scenario with named assumptions.',
    buyIf:
      'Pick this when you want the complete 7-file operating desk: git workspace and cadence, dated coding-tool comparison matrix, 12-row recurring-payer CSV, 4-stage offer ladder, and fail-closed Polar.sh checklist.',
    files: blueprintFiles,
  },
  'abos-pack-bundle': {
    slug: 'abos-pack-bundle',
    previewMode: 'product-specification',
    archiveName: 'products/abos-pack-bundle/PRODUCT.md',
    totalFilesLabel: 'Bundle specification · 4 MIT packs in frankxai/agentic-business-os',
    totalSizeLabel: `${abosFiles[0].sizeLabel} spec`,
    licenseShort: 'MIT source · Packaged bundle',
    plateSvg: '/images/products/plate-abos-pack-bundle.svg',
    skipIf:
      'Skip this if you expect a hosted SaaS web app with user logins, or if you prefer assembling the four MIT folders yourself from frankxai/agentic-business-os.',
    buyIf:
      'Pick this if you run your business out of local Markdown and JSON repos and want Claims Guard, Business Intelligence, Design Contract, and Weekly Rhythm together.',
    files: abosFiles,
  },
  'agent-team-pro': {
    slug: 'agent-team-pro',
    previewMode: 'product-specification',
    archiveName: 'products/agent-team-pro/PRODUCT.md',
    totalFilesLabel: 'Roadmap specification · payload in assembly',
    totalSizeLabel: `${teamFiles[0].sizeLabel} spec`,
    licenseShort: 'Personal license + 12 mo updates',
    plateSvg: '/images/products/plate-agent-team-pro.svg',
    skipIf:
      'Skip this if you have not shipped your first single-pack or comparison workflow yet, or if you want unmonitored agents executing spend or external messages.',
    buyIf:
      'Join the waitlist if you run multiple AI coding tools across isolated git branches and want bounded maker and independent-reviewer loop templates.',
    files: teamFiles,
  },
  'private-intel': {
    slug: 'private-intel',
    previewMode: 'sample-issue',
    archiveName: 'products/private-intel/2026-06-BRIEF.md',
    totalFilesLabel: '1 sample brief · monthly cadence',
    totalSizeLabel: `${intelFiles[0].sizeLabel} sample`,
    licenseShort: 'Personal subscription · Cancel anytime',
    plateSvg: '/images/products/plate-private-intel.svg',
    skipIf:
      'Skip this if you are still setting up your first page (use the free Starter Kit first) or if you want daily hype news digests rather than monthly catalog diffs.',
    buyIf:
      'Request access if you already maintain comparison or product routes and want monthly partner-term drift, watchlist notes, and structured Q&A.',
    files: intelFiles,
  },
  'implementation-sprint': {
    slug: 'implementation-sprint',
    previewMode: 'product-specification',
    archiveName: 'products/implementation-sprint/PRODUCT.md',
    totalFilesLabel: 'Sprint scope specification · git handoff checklist',
    totalSizeLabel: `${sprintFiles[0].sizeLabel} spec`,
    licenseShort: 'Buyer owns 100% of repo & code',
    plateSvg: '/images/products/plate-implementation-sprint.svg',
    skipIf:
      'Skip this if you want an open-ended strategy deck without code, or if you have not yet identified a concrete workflow or audience to build around.',
    buyIf:
      'Request a scoped plan when you have an active product or content workflow and want an isolated git branch, local quality gates, and a verified Vercel preview handed over cleanly.',
    files: sprintFiles,
  },
}

const out = `// AUTO-GENERATED by scripts/build-pack-manifests.mjs from verified files on disk.
// Do not invent file paths, byte counts, line counts, or excerpts by hand.

export type PackFileItem = {
  path: string
  diskPath: string
  bytes: number
  sizeLabel: string
  kind: 'markdown' | 'skill' | 'json' | 'script' | 'csv'
  badge: string
  totalLines: number
  excerpt: string[]
}

export type PackPreviewMode = 'deliverable-files' | 'sample-issue' | 'product-specification'

export type PackManifest = {
  slug: string
  previewMode: PackPreviewMode
  archiveName: string
  totalFilesLabel: string
  totalSizeLabel: string
  licenseShort: string
  plateSvg: string
  skipIf: string
  buyIf: string
  files: PackFileItem[]
}

export const PACK_MANIFESTS: Record<string, PackManifest> = ${JSON.stringify(manifests, null, 2)}

export function getPackManifest(slug: string): PackManifest | undefined {
  return PACK_MANIFESTS[slug]
}
`

writeFileSync(path.join(root, 'lib/pack-manifests.ts'), out, 'utf8')
console.log('Generated lib/pack-manifests.ts from verified disk deliverables.')
