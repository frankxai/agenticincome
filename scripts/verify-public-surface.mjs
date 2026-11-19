#!/usr/bin/env node

import { readFileSync } from 'node:fs'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const files = {
  home: read('app/page.tsx'),
  hero: read('components/IncomeDeskHero.tsx'),
  workflow: read('components/AgentWorkflowProof.tsx'),
  analytics: read('lib/analytics.ts'),
  subscribe: read('app/api/subscribe/route.ts'),
  'email-capture': read('components/EmailCapture.tsx'),
  start: read('app/start/page.tsx'),
  privacy: read('app/privacy/page.tsx'),
  notFound: read('app/not-found.tsx'),
  footer: read('components/Footer.tsx'),
  headers: read('vercel.json'),
  css: read('app/globals.css'),
  path: read('components/PathSection.tsx'),
  'service-kit': read('products/blueprint/service-kit.md'),
}

const failures = []
const requireText = (file, value, label) => {
  if (!files[file].includes(value)) failures.push(`${label}: missing ${JSON.stringify(value)} in ${file}`)
}
const forbidText = (file, value, label) => {
  if (files[file].toLowerCase().includes(value.toLowerCase())) failures.push(`${label}: forbidden ${JSON.stringify(value)} in ${file}`)
}

requireText('home', '<AgentWorkflowProof />', 'workflow is present on the homepage')
requireText('workflow', 'node scripts/affiliate-audit.mjs', 'workflow shows the executable command')
requireText('workflow', 'Human gate', 'workflow exposes human approval')
requireText('workflow', 'It does not join a program', 'workflow exposes autonomy boundary')
requireText('workflow', 'Reference implementation only', 'workflow avoids customer-proof overclaim')
requireText('workflow', '/skills/affiliate-audit/SKILL.md', 'workflow links the public skill contract')
requireText('workflow', '/scripts/affiliate-audit.mjs', 'workflow links executable source')

for (const event of [
  'implementation_request_clicked',
  'open_source_proof_clicked',
  'workflow_proof_clicked',
  'subscribe_unwired',
  'subscribe_manual',
]) requireText('analytics', `'${event}'`, `analytics allowlist includes ${event}`)

requireText('subscribe', "error: 'intake_closed'", 'closed intake refuses the request')
requireText('email-capture', "receipt.mode === 'manual_email'", 'manual intake tells the visitor nothing was saved')
requireText('subscribe', 'isSameOriginRequest(req)', 'intake is same-origin only')
requireText('subscribe', 'readBoundedJson(req)', 'intake body is bounded before parsing')

forbidText('start', 'what ranks and what AI search engines lift verbatim', 'unsupported ranking claim')
forbidText('start', 'every reader is either income', 'dehumanizing outcome claim')
for (const file of ['path', 'service-kit']) forbidText(file, '5–20×', 'unsourced performance multiple')

requireText('privacy', "alternates: { canonical: '/privacy' }", 'privacy canonical metadata')
requireText('notFound', 'robots: { index: false, follow: false }', '404 noindex metadata')
requireText('footer', 'href="/privacy"', 'privacy route is discoverable')

for (const header of [
  'Content-Security-Policy',
  'Cross-Origin-Opener-Policy',
  'Cross-Origin-Resource-Policy',
  'Strict-Transport-Security',
  'X-Permitted-Cross-Domain-Policies',
]) requireText('headers', header, `security header ${header}`)

requireText('css', '.hero-actions > *', 'hero CTA containment')
requireText('css', '.workflow-steps', 'workflow responsive system')

if (failures.length) {
  console.error(`Public-surface verification failed:\n- ${failures.join('\n- ')}`)
  process.exit(1)
}

console.log('AgenticIncome public-surface verification passed (workflow proof, claims, analytics, privacy, 404, headers, responsive contracts).')
