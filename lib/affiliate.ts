import catalog from '@/data/programs.json'

export type Program = {
  tool: string
  category: string
  aliases: string[]
  hasProgram: boolean
  priority?: number
  commission?: string
  recurring?: string
  cookieDays?: number | null
  network?: string
  signupUrl?: string
  ourLink?: string | null
  status?: string
  note?: string
  verifiedAt?: string
  commissionNote?: string
  commissionSourceUrl?: string
  commissionVerifiedAt?: string
}

const PROGRAMS = catalog.programs as Program[]
export const DISCLOSURE = catalog.disclosure as string

const byAlias = new Map<string, Program>()
for (const p of PROGRAMS) {
  byAlias.set(p.tool.toLowerCase(), p)
  for (const a of p.aliases ?? []) byAlias.set(a.toLowerCase(), p)
}

export function findProgram(tool: string): Program | undefined {
  return byAlias.get(tool.trim().toLowerCase())
}

/**
 * The affiliate link for a tool, or null when we haven't joined the program.
 * Null is the honest default — callers render plain text, never a dead link.
 */
export function getLink(tool: string): string | null {
  const p = findProgram(tool)
  return p?.ourLink ?? null
}

/** Slug for MCP + registry lookups: "Systeme.io" → "systeme-io". */
export function programSlug(p: Program): string {
  return p.tool.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function findProgramBySlug(slug: string): Program | undefined {
  return PROGRAMS.find((p) => programSlug(p) === slug.trim().toLowerCase())
}

/**
 * Programs whose commission terms were re-verified against the program's own
 * page on 2026-08-16 — the only rows the partner-economics tables render.
 */
export function verifiedEconomicsPrograms(): Program[] {
  return PROGRAMS
    .filter((p) => p.hasProgram && Boolean(p.commissionVerifiedAt))
    .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))
}

/** Programs worth joining, ranked by priority — drives the "monetize" surfaces. */
export function payingPrograms(): Program[] {
  return PROGRAMS
    .filter((p) => p.hasProgram && p.status !== 'closed' && p.status !== 'dead-end')
    .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))
}
