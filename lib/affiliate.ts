import catalog from '@/data/programs.json'
import { withSource, type LinkSource } from '@/lib/link-source'

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
 * Site pages are the default source; the MCP server passes 'mcp'.
 */
export function getLink(tool: string, src: LinkSource = 'page'): string | null {
  const p = findProgram(tool)
  return p?.ourLink ? withSource(p.ourLink, src) : null
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
 * page (commissionVerifiedAt + commissionSourceUrl) — the only rows the
 * partner-economics tables render. Deprioritized and closed programs stay out
 * of those tables even when their terms are verified.
 */
export function verifiedEconomicsPrograms(): Program[] {
  return PROGRAMS
    .filter((p) => p.hasProgram && Boolean(p.commissionVerifiedAt))
    .filter((p) => p.status !== 'deprioritized' && p.status !== 'closed' && p.status !== 'dead-end')
    .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))
}

const VERIFIED_DATE = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })

/**
 * Human label for when the partner-economics rows were verified, derived from
 * the data so the copy can never drift from the catalog: "on 28 Sep 2026" or
 * "between 16 Aug 2026 and 28 Sep 2026".
 */
export function verifiedRangeLabel(programs: Program[] = verifiedEconomicsPrograms()): string {
  const dates = programs
    .map((p) => p.commissionVerifiedAt)
    .filter((d): d is string => Boolean(d))
    .sort()
  if (dates.length === 0) return 'on no date yet'
  const first = VERIFIED_DATE.format(new Date(`${dates[0]}T00:00:00Z`))
  const last = VERIFIED_DATE.format(new Date(`${dates[dates.length - 1]}T00:00:00Z`))
  return first === last ? `on ${first}` : `between ${first} and ${last}`
}

/** Programs worth joining, ranked by priority — drives the "monetize" surfaces. */
export function payingPrograms(): Program[] {
  return PROGRAMS
    .filter((p) => p.hasProgram && p.status !== 'closed' && p.status !== 'dead-end')
    .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))
}
