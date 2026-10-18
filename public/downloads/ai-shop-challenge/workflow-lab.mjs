#!/usr/bin/env node
/* Source-to-Brief Lab 2026-10-11.1 — original code, MIT licence.
 * Local, deterministic reference workflow. No model, network, keys or telemetry.
 */
import { createHash } from 'node:crypto'
import { readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const VERSION = '2026-10-11.1'
const LIMIT = 128 * 1024
const unsafeControl = /[\u0000-\u001f\u007f\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/
const fail = (message) => { throw new Error(message) }
const sha256 = (value) => createHash('sha256').update(value).digest('hex')
const canonical = (value) => JSON.stringify(sort(value))
function sort(value) {
  if (Array.isArray(value)) return value.map(sort)
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, sort(value[key])]))
  return value
}
function object(value, keys, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).some((key) => !keys.includes(key)) || keys.some((key) => !Object.keys(value).includes(key))) fail(`${label}: unexpected or missing field`)
}
function text(value, label, max = 1200) {
  if (typeof value !== 'string' || !value.trim() || value.length > max || unsafeControl.test(value)) fail(`${label}: expected bounded, single-line text`)
}
function id(value) {
  if (typeof value !== 'string' || !/^[a-z][a-z0-9-]{0,63}$/.test(value)) fail('Invalid identifier')
}
function list(value, min, max, label) {
  if (!Array.isArray(value) || value.length < min || value.length > max) fail(`${label}: invalid item count`)
}
function day(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value) fail('Invalid source date')
}
const md = (value) => value.replace(/[\\`*_{}\[\]()<>#!|~]/g, '\\$&')

export function validateInput(input) {
  object(input, ['version', 'fixture', 'project', 'buyer', 'job', 'sources', 'claims', 'nextActions', 'openQuestions'], 'Input')
  if (input.version !== 1 || typeof input.fixture !== 'boolean') fail('Invalid input version or fixture flag')
  for (const key of ['project', 'buyer', 'job']) text(input[key], key, 300)
  list(input.sources, 1, 20, 'Sources')
  const sourceIds = new Set()
  for (const source of input.sources) {
    object(source, ['id', 'title', 'url', 'recordedAt', 'rights'], 'Source')
    id(source.id); text(source.title, 'Source title', 200); day(source.recordedAt)
    if (sourceIds.has(source.id)) fail('Duplicate source identifier')
    sourceIds.add(source.id)
    if (!['owned', 'licensed', 'public-domain', 'unverified'].includes(source.rights)) fail('Invalid rights state')
    if (typeof source.url !== 'string' || source.url.length > 1500 || unsafeControl.test(source.url) || /[<>\s]/.test(source.url)) fail('Unsafe source URL')
    let url
    try { url = new URL(source.url) } catch { fail('Invalid source URL') }
    if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) fail('Source URL must be HTTPS without credentials, query data or fragments')
  }
  list(input.claims, 1, 40, 'Claims')
  const claimIds = new Set()
  for (const claim of input.claims) {
    object(claim, ['id', 'text', 'sourceIds', 'state'], 'Claim')
    id(claim.id); text(claim.text, 'Claim')
    if (claimIds.has(claim.id)) fail('Duplicate claim identifier')
    claimIds.add(claim.id)
    if (!['approved', 'review-required'].includes(claim.state)) fail('Invalid claim state')
    list(claim.sourceIds, 1, 20, 'Claim sources')
    if (new Set(claim.sourceIds).size !== claim.sourceIds.length || claim.sourceIds.some((key) => !sourceIds.has(key))) fail('Claim has missing or duplicate source references')
  }
  list(input.nextActions, 1, 12, 'Next actions')
  list(input.openQuestions, 0, 12, 'Open questions')
  for (const value of [...input.nextActions, ...input.openQuestions]) text(value, 'Action or question', 500)
  // Leave room for the complete input, rendered draft and manifest in the bundle.
  if (Buffer.byteLength(canonical(input), 'utf8') > 24 * 1024) fail('Input exceeds the local size limit')
  return input
}

export function buildBrief(value) {
  const input = validateInput(value)
  const lines = [
    `# ${md(input.project)}`, '',
    '**Source-linked draft · human review required**', '',
    input.fixture ? '> Synthetic example. No customer, market or commercial result is represented.' : '> User-supplied source references. Structural validation does not establish factual truth or rights.', '',
    `**Buyer:** ${md(input.buyer)}`, '', `**Job:** ${md(input.job)}`, '',
    '## Source-linked notes and claims', '',
    ...input.claims.map((claim) => `- **${claim.id} · ${claim.state}** — ${md(claim.text)} [${claim.sourceIds.join(', ')}]`), '',
    '## Source inventory', '',
    ...input.sources.map((source) => `- **${source.id}** — ${md(source.title)} · ${source.recordedAt} · rights asserted: ${source.rights}\n  <${source.url}>`), '',
    '## Next actions', '', ...input.nextActions.map((action, index) => `${index + 1}. ${md(action)}`), '',
    '## Open questions', '', ...(input.openQuestions.length ? input.openQuestions.map((q) => `- ${md(q)}`) : ['None recorded. A reviewer must still inspect the sources.']), '',
    '## Release boundary', '',
    'A local acceptance receipt is a human attestation, not authenticated customer demand, legal clearance, payment, publication or analytics activation. Check original sources, rights and the complete output before using it.', '',
  ]
  const markdown = lines.join('\n')
  return {
    schemaVersion: 1, labVersion: VERSION, input: structuredClone(input), markdown,
    manifest: {
      inputSha256: sha256(canonical(input)), artifactSha256: sha256(markdown),
      sourceCount: input.sources.length, claimCount: input.claims.length,
      fixture: input.fixture, state: 'draft', customerEvidenceEligible: false,
      sourceVerification: 'user-supplied-not-independently-verified',
      unresolvedClaims: input.claims.filter((claim) => claim.state !== 'approved').map((claim) => claim.id),
    },
  }
}

export function validateBundle(bundle) {
  object(bundle, ['schemaVersion', 'labVersion', 'input', 'markdown', 'manifest'], 'Bundle')
  const expected = buildBrief(bundle.input)
  if (canonical(bundle) !== canonical(expected)) fail('Bundle integrity mismatch; rebuild from the original input')
  return expected
}

export function recordReview(bundle, review) {
  const expected = validateBundle(bundle)
  object(review, ['artifactSha256', 'decision', 'reviewerId', 'reviewedAt', 'checkedSourceLinks', 'checkedRights', 'checkedOutput', 'notes'], 'Review')
  id(review.reviewerId); text(review.notes, 'Review notes', 500)
  if (!['accept', 'revise'].includes(review.decision)) fail('Invalid review decision')
  if (review.artifactSha256 !== expected.manifest.artifactSha256) fail('Review refers to a different artifact')
  if (typeof review.reviewedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(review.reviewedAt) || Number.isNaN(Date.parse(review.reviewedAt)) || new Date(review.reviewedAt).toISOString().replace('.000Z', 'Z') !== review.reviewedAt.replace('.000Z', 'Z')) fail('Invalid review timestamp')
  for (const key of ['checkedSourceLinks', 'checkedRights', 'checkedOutput']) if (typeof review[key] !== 'boolean') fail('Review checks must be explicit booleans')
  if (review.decision === 'accept' && (!review.checkedSourceLinks || !review.checkedRights || !review.checkedOutput || expected.manifest.unresolvedClaims.length || expected.input.openQuestions.length || expected.input.sources.some((source) => source.rights === 'unverified'))) fail('Acceptance requires complete review and resolved claims, rights and questions')
  return {
    schemaVersion: 1, labVersion: VERSION, kind: 'local-human-attestation',
    fixture: expected.input.fixture, customerEvidenceEligible: false,
    inputSha256: expected.manifest.inputSha256, ...structuredClone(review),
    limitation: 'Local identity and attestations are not independently authenticated. Never count this receipt as a sale, customer activation or model score.',
  }
}

function readJson(path) {
  if (!path || !statSync(path).isFile() || statSync(path).size > LIMIT) fail('Expected a local JSON file within the size limit')
  const value = readFileSync(path)
  if (value.length > LIMIT) fail('JSON file exceeds the local size limit')
  try { return JSON.parse(value.toString('utf8')) } catch { fail('Invalid JSON file') }
}

export function runCli(args) {
  const [command, inputPath, reviewPath] = args
  if (command === 'build' && args.length === 2) return JSON.stringify(buildBrief(readJson(inputPath)), null, 2)
  if (command === 'markdown' && args.length === 2) return validateBundle(readJson(inputPath)).markdown
  if (command === 'review' && args.length === 3) return JSON.stringify(recordReview(readJson(inputPath), readJson(reviewPath)), null, 2)
  fail('Usage: node workflow-lab.mjs build input.json | markdown draft.json | review draft.json review.json')
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2)
    const output = runCli(args)
    process.stdout.write(args[0] === 'markdown' ? output : output + '\n')
  }
  catch { process.stderr.write('Workflow Lab: input, integrity or review validation failed. See the local guide; no output was accepted.\n'); process.exitCode = 1 }
}
