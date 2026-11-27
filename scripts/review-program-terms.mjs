// Run by the monthly knowledge audit. The catalog stays authoritative.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { matchRow, pageText } from './vault-verify.mjs'

const maxBytes = 1024 * 1024
const dayMs = 24 * 60 * 60 * 1000
const cutoffDays = 90

function primarySource(program) {
  try {
    const url = new URL(program.commissionSourceUrl)
    return url.protocol === 'https:' && !url.username && !url.password && !url.port
      && /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(url.hostname) ? url.href : null
  } catch {
    return null
  }
}

// Read only the exact reviewed source URL. No account, affiliate URL, redirect,
// script execution, linked page discovery, or writes to the catalog.
export async function observeSource(url, request = fetch) {
  let response
  try {
    response = await request(url, {
      redirect: 'manual',
      signal: AbortSignal.timeout(7000),
      headers: { accept: 'text/html,text/plain', 'user-agent': 'AgenticIncome-TermsReview/1.0' },
    })
    if (!response.ok) return { status: response.status, error: 'Review source response' }
    if (!/^(text\/html|text\/plain)\b/i.test(response.headers.get('content-type') ?? '')) {
      return { status: response.status, error: 'Review non-text source' }
    }
    let bytes = 0
    const chunks = []
    for await (const chunk of response.body) {
      bytes += chunk.length
      if (bytes > maxBytes) return { status: response.status, error: 'Review oversized source' }
      chunks.push(chunk)
    }
    return { status: response.status, text: pageText(Buffer.concat(chunks).toString('utf8')) }
  } catch {
    return { status: response?.status ?? null, error: 'Review unavailable source' }
  } finally {
    if (response?.body && !response.body.locked) await response.body.cancel().catch(() => {})
  }
}

function reviewDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d\d-\d\d$/.test(value)) return null
  const parsed = Date.parse(value)
  return Number.isFinite(parsed) && new Date(parsed).toISOString().startsWith(value) ? parsed : null
}

export function reviewProgram(program, source, observation, now) {
  const reasons = []
  const active = program.hasProgram === true && program.status === 'active'
  if (!active) reasons.push('Hold promotion until program eligibility is confirmed')
  const rate = program.commission ?? ''
  const quoted = [...new Set(rate.match(/[$€£]\d+(?:[,.]\d+)*|\d+(?:\.\d+)?%/g) ?? [])]
  const lastReview = quoted.length ? program.commissionVerifiedAt : program.verifiedAt
  const date = reviewDate(lastReview)
  if (date === null || date > now) reasons.push('Record a valid reviewer date')
  else if (now - date >= cutoffDays * dayMs) reasons.push('Renew the 90-day source review')
  if (!source) reasons.push('Record an official terms source')
  else if (observation.error) reasons.push(observation.error)
  else {
    // Keep currency and percentage units intact. A number on a page can never
    // establish which plan it applies to, attribution rules, or eligibility.
    const match = matchRow(quoted.map(value => [value]), observation.text)
    if (match.missing.length) reasons.push('Recheck quoted figures: ' + match.missing.join(', '))
  }
  return { tool: program.tool, catalogStatus: program.status, terms: rate || null, source,
    lastReview: lastReview || null, httpStatus: observation?.status ?? null, reasons }
}

export async function auditPrograms(programs, now, observe = observeSource) {
  const sources = [...new Set(programs.map(primarySource).filter(Boolean))]
  const observations = new Map()
  for (let i = 0; i < sources.length; i += 4) {
    await Promise.all(sources.slice(i, i + 4).map(async source => {
      observations.set(source, await observe(source))
    }))
  }
  return programs.map(program => {
    const source = primarySource(program)
    return reviewProgram(program, source, observations.get(source), now)
  })
}

function markdown(rows, checkedAt) {
  const cell = value => String(value).replaceAll('|', '\\|').replace(/[\r\n]/g, ' ')
  const pending = rows.filter(row => row.reasons.length)
  return [
    '## Affiliate terms review · ' + checkedAt.slice(0, 10), '',
    pending.length + ' of ' + rows.length + ' catalog entries require review.',
    'Open the recorded source and check eligibility, rate, duration and exclusions before revising any buyer-facing claim. A matching figure is only a text observation.', '',
    '| Program | Catalog status | Last review | Reviewer action | Official source |',
    '| --- | --- | --- | --- | --- |',
    ...pending.map(row => '| ' + [row.tool, row.catalogStatus, row.lastReview ?? 'Missing',
      row.reasons.join('. '), row.source ?? 'Missing'].map(cell).join(' | ') + ' |'),
    '',
  ].join('\n')
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const catalog = JSON.parse(await readFile(new URL('../data/programs.json', import.meta.url), 'utf8'))
  const checkedAt = new Date().toISOString()
  const results = await auditPrograms(catalog.programs, Date.parse(checkedAt))
  const out = process.argv[2] ?? 'terms-review'
  await mkdir(out, { recursive: true })
  const summary = markdown(results, checkedAt)
  await writeFile(join(out, 'review.md'), summary)
  await writeFile(join(out, 'observations.json'), JSON.stringify({ checkedAt, results }, null, 2) + '\n')
  console.log(summary)
}
