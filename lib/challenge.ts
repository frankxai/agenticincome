import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

/**
 * The 5-7 day evergreen email challenge (Income — Product Experience v1, the
 * assigned pull mechanic). Content lives as portable markdown in content/challenge/
 * — not app/ MDX routes — because these files are the email source of truth, sent
 * later via an ESP/automation (see SEQUENCE.md), not a set of pages Next.js routes
 * directly. This module only reads them for the /challenge landing preview.
 */
export type ChallengeDay = {
  day: number
  subject: string
  title: string
  teaser: string
  cta: string
  ctaHref: string
  body: string
}

const CONTENT_DIR = join(process.cwd(), 'content', 'challenge')

function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {}, body: raw }

  const [, frontmatter, body] = match
  const data: Record<string, string> = {}
  for (const line of frontmatter.split(/\r?\n/)) {
    const separatorIndex = line.indexOf(':')
    if (separatorIndex === -1) continue
    const key = line.slice(0, separatorIndex).trim()
    let value = line.slice(separatorIndex + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    data[key] = value
  }
  return { data, body: body.trim() }
}

export function getChallengeDays(): ChallengeDay[] {
  // Only the day-N.md email bodies — excludes SEQUENCE.md (sending-mechanism notes,
  // not a challenge day) and any other non-day markdown dropped in this folder later.
  const files = readdirSync(CONTENT_DIR).filter((f) => /^day-\d+\.md$/.test(f))
  const days = files.map((file) => {
    const raw = readFileSync(join(CONTENT_DIR, file), 'utf8')
    const { data, body } = parseFrontmatter(raw)
    return {
      day: Number(data.day ?? 0),
      subject: data.subject ?? '',
      title: data.title ?? '',
      teaser: data.teaser ?? '',
      cta: data.cta ?? '',
      ctaHref: data.ctaHref ?? '/challenge',
      body,
    }
  })
  return days.sort((a, b) => a.day - b.day)
}
