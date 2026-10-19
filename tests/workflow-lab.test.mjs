import assert from 'node:assert/strict'
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import test from 'node:test'
import { buildBrief, recordReview, validateBundle } from '../public/downloads/ai-shop-challenge/workflow-lab.mjs'

const samplePath = new URL('../public/downloads/ai-shop-challenge/workflow-lab-sample.json', import.meta.url)
const script = new URL('../public/downloads/ai-shop-challenge/workflow-lab.mjs', import.meta.url)
const sample = () => JSON.parse(readFileSync(samplePath, 'utf8'))
const reviewFor = (bundle) => ({
  artifactSha256: bundle.manifest.artifactSha256, decision: 'accept', reviewerId: 'fixture-reviewer',
  reviewedAt: '2026-10-11T06:00:00Z', checkedSourceLinks: true, checkedRights: true,
  checkedOutput: true, notes: 'Synthetic fixture structure inspected; not a real customer outcome.',
})

test('the complete local journey exports a source-linked artifact and explicit human attestation', () => {
  const dir = mkdtempSync(join(tmpdir(), 'workflow-lab-'))
  try {
    const built = spawnSync(process.execPath, [script.pathname, 'build', samplePath.pathname], { encoding: 'utf8' })
    assert.equal(built.status, 0, built.stderr)
    const bundle = JSON.parse(built.stdout)
    assert.equal(bundle.manifest.sourceCount, 2)
    assert.equal(bundle.manifest.claimCount, 5)
    const draft = join(dir, 'draft.json')
    writeFileSync(draft, built.stdout)
    const exported = spawnSync(process.execPath, [script.pathname, 'markdown', draft], { encoding: 'utf8' })
    assert.equal(exported.status, 0, exported.stderr)
    assert.equal(exported.stdout, bundle.markdown)
    const markdownPath = join(dir, 'brief.md')
    writeFileSync(markdownPath, exported.stdout)
    const exportedArtifactHash = createHash('sha256').update(readFileSync(markdownPath)).digest('hex')
    assert.equal(exportedArtifactHash, bundle.manifest.artifactSha256)
    assert.match(exported.stdout, /Synthetic example/)
    const review = join(dir, 'review.json')
    writeFileSync(review, JSON.stringify(reviewFor(bundle)))
    const received = spawnSync(process.execPath, [script.pathname, 'review', draft, review], { encoding: 'utf8' })
    assert.equal(received.status, 0, received.stderr)
    const receipt = JSON.parse(received.stdout)
    assert.equal(receipt.kind, 'local-human-attestation')
    assert.equal(receipt.decision, 'accept')
    assert.equal(receipt.artifactSha256, exportedArtifactHash)
    assert.equal(receipt.fixture, true)
    assert.equal(receipt.customerEvidenceEligible, false)
  } finally { rmSync(dir, { recursive: true, force: true }) }
})

test('identical inputs produce deterministic artifacts; changed evidence changes the bound hash', () => {
  const input = sample()
  const first = buildBrief(input)
  assert.deepEqual(first, buildBrief(JSON.parse(JSON.stringify(input))))
  input.claims[0].text += ' Changed scope.'
  assert.notEqual(buildBrief(input).manifest.artifactSha256, first.manifest.artifactSha256)
})

test('unreferenced, duplicate and unsafe sources fail before an artifact exists', () => {
  for (const mutate of [
    (x) => { x.claims[0].sourceIds = ['missing'] },
    (x) => { x.sources.push(x.sources[0]) },
    (x) => { x.claims.push(x.claims[0]) },
    (x) => { x.claims[0].sourceIds = ['scope', 'scope'] },
    (x) => { x.sources[0].recordedAt = '2026-02-30' },
    (x) => { x.unexpected = 'secret' },
    (x) => { x.sources[0].url = 'https://user:secret@example.com/note' },
    (x) => { x.sources[0].url = 'https://example.com/note?email=private' },
    (x) => { x.sources[0].url = 'javascript:alert(1)' },
    (x) => { x.sources[0].url = 'https://example.com/note>unsafe' },
    (x) => { x.claims[0].text = 'Hidden\u001b[31mtext' },
  ]) { const input = sample(); mutate(input); assert.throws(() => buildBrief(input)) }
})

test('markdown treats supplied markup as text rather than executable presentation', () => {
  const input = sample()
  input.claims[0].text = '<script>alert(1)</script> [click](javascript:alert(1))'
  const { markdown } = buildBrief(input)
  assert.ok(!markdown.includes('<script>'))
  assert.ok(!markdown.includes('[click]('))
})

test('raw terminal controls and bidirectional formatting never enter exported text or URLs', () => {
  for (const control of ['\u001b[31mred\u001b[0m', '\u001b]0;title\u0007', '\u202eevil', '\u2066hidden\u2069', '\u061c']) {
    for (const field of ['url', 'text']) {
      const input = sample()
      if (field === 'url') input.sources[0].url = 'https://example.com/' + control
      else input.claims[0].text += control
      assert.throws(() => buildBrief(input))
    }
  }
})

test('required input fields must be own enumerable data that survives export', () => {
  const input = sample()
  const project = input.project
  delete input.project
  Object.setPrototypeOf(input, { project })
  assert.throws(() => buildBrief(input))
  Object.defineProperty(input, 'project', { value: project, enumerable: false })
  assert.throws(() => buildBrief(input))
})

test('tampered artifact, input or manifest cannot receive an acceptance receipt', () => {
  const original = buildBrief(sample())
  for (const mutate of [
    (x) => { x.markdown += 'Unsupported outcome' },
    (x) => { x.input.fixture = false },
    (x) => { x.manifest.customerEvidenceEligible = true },
    (x) => { x.manifest.state = 'accepted' },
  ]) { const bundle = structuredClone(original); mutate(bundle); assert.throws(() => validateBundle(bundle)); assert.throws(() => recordReview(bundle, reviewFor(original))) }
})

test('acceptance cannot skip review or unresolved claims, rights or questions', () => {
  const bundle = buildBrief(sample())
  for (const key of ['checkedSourceLinks', 'checkedRights', 'checkedOutput']) {
    const review = reviewFor(bundle); review[key] = false
    assert.throws(() => recordReview(bundle, review))
    review.decision = 'revise'
    assert.equal(recordReview(bundle, review).decision, 'revise')
  }
  for (const mutate of [
    (x) => { x.claims[0].state = 'review-required' },
    (x) => { x.sources[0].rights = 'unverified' },
    (x) => { x.openQuestions = ['Permission still needed'] },
  ]) { const input = sample(); mutate(input); const draft = buildBrief(input); assert.throws(() => recordReview(draft, reviewFor(draft))) }
  const wrong = reviewFor(bundle); wrong.artifactSha256 = '0'.repeat(64)
  assert.throws(() => recordReview(bundle, wrong))
  const badDate = reviewFor(bundle); badDate.reviewedAt = '2026-02-30T06:00:00Z'
  assert.throws(() => recordReview(bundle, badDate))
})

test('a local nonfixture attestation is still ineligible for automatic customer evidence', () => {
  const input = sample(); input.fixture = false
  const bundle = buildBrief(input)
  assert.equal(recordReview(bundle, reviewFor(bundle)).customerEvidenceEligible, false)
})

test('CLI rejects oversized and malformed input without echoing its contents', () => {
  const dir = mkdtempSync(join(tmpdir(), 'workflow-reject-'))
  try {
    const file = join(dir, 'secret.json')
    for (const content of ['PRIVATE_CONTENT', 'x'.repeat(128 * 1024 + 1)]) {
      writeFileSync(file, content)
      const result = spawnSync(process.execPath, [script.pathname, 'build', file], { encoding: 'utf8' })
      assert.equal(result.status, 1)
      assert.equal(result.stdout, '')
      assert.ok(!result.stderr.includes('PRIVATE_CONTENT'))
    }
  } finally { rmSync(dir, { recursive: true, force: true }) }
})
