import { readFileSync } from 'node:fs'
import path from 'node:path'

const freePlaybooks = {
  'starter-kit': 'agentic-income-starter-kit.md',
  'hr-agency-sample': 'ai-native-hr-agency-sample.md',
} as const

export const freePlaybookSlugs = Object.keys(freePlaybooks)

/** Exact allowlist: paid product directories can never be requested here. */
export function getFreePlaybook(slug: string): { slug: string; format: string; content: string } | null {
  if (!Object.prototype.hasOwnProperty.call(freePlaybooks, slug)) return null
  const file = freePlaybooks[slug as keyof typeof freePlaybooks]
  return {
    slug, format: 'markdown',
    content: readFileSync(path.join(process.cwd(), 'public', 'downloads', file), 'utf8'),
  }
}
