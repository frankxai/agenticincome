#!/usr/bin/env node

import { readFileSync } from 'node:fs'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const files = {
  home: read('app/page.tsx'),
  hero: read('components/IncomeDeskHero.tsx'),
  workflow: read('components/AgentWorkflowProof.tsx'),
  evidence: read('components/MarketEvidence.tsx'),
  waitlist: read('components/WaitlistForm.tsx'),
  analytics: read('lib/analytics.ts'),
  subscribe: read('app/api/subscribe/route.ts'),
  start: read('app/start/page.tsx'),
  privacy: read('app/privacy/page.tsx'),
  notFound: read('app/not-found.tsx'),
  footer: read('components/Footer.tsx'),
  headers: read('vercel.json'),
  css: read('app/globals.css'),
}

const failures = []
const requireText = (file, value, label) => {
  if (!files[file].includes(value)) failures.push(`${label}: missing ${JSON.stringify(value)} in ${file}`)
}
const forbidText = (file, value, label) => {
  if (files[file].toLowerCase().includes(value.toLowerCase())) failures.push(`${label}: forbidden ${JSON.stringify(value)} in ${file}`)
}

requireText('home', '<AgentWorkflowProof />', 'workflow is present on the homepage')
requireText('home', '<MarketEvidence />', 'sourced market evidence is present on the homepage')
requireText('home', '<OutcomePackBlueprint />', 'the product anatomy is present on the homepage')
forbidText('home', '<AssemblyHero />', 'the heavy abstract canvas hero is not mounted')
requireText('workflow', 'npm run income:validate -- examples/request-to-quote-desk/income-system.json', 'workflow shows the verified executable command')
requireText('workflow', 'Human gate', 'workflow exposes human approval')
requireText('workflow', 'It does not connect credentials', 'workflow exposes autonomy boundary')
requireText('workflow', 'Reference implementation only', 'workflow avoids customer-proof overclaim')
requireText('workflow', '/examples/request-to-quote-desk', 'workflow links the public reference pack')
requireText('workflow', '/schemas/income-system.v1.schema.json', 'workflow links the public schema')
requireText('evidence', 'not Agentic Income customer results', 'market evidence is not presented as first-party proof')
requireText('evidence', 'Marketplace data', 'market evidence labels source type')
requireText('evidence', 'Vendor-published customer story', 'vendor stories are labelled')

for (const event of [
  'implementation_request_clicked',
  'open_source_proof_clicked',
  'workflow_proof_clicked',
  'subscribe_unwired',
]) requireText('analytics', `'${event}'`, `analytics allowlist includes ${event}`)

requireText('subscribe', "mode === 'unwired' ? 'subscribe_unwired' : 'subscribe_success'", 'unwired intake is not recorded as success')
requireText('subscribe', "error: 'intake_unavailable'", 'unwired intake fails closed')
requireText('subscribe', 'isSameOriginRequest(req)', 'intake is same-origin only')
requireText('subscribe', 'readBoundedJson(req)', 'intake body is bounded before parsing')
requireText('waitlist', "if (!intakeAvailable)", 'waitlist form is hidden when intake is unwired')
requireText('waitlist', 'Nothing was stored', 'waitlist error states its persistence boundary')
requireText('waitlist', '<label htmlFor=', 'waitlist fields use visible labels')

forbidText('start', 'what ranks and what AI search engines lift verbatim', 'unsupported ranking claim')
forbidText('start', 'every reader is either income', 'dehumanizing outcome claim')

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
requireText('css', '.market-evidence-grid', 'market evidence responsive system')
requireText('css', '.waitlist-form', 'waitlist form design system')

if (failures.length) {
  console.error(`Public-surface verification failed:\n- ${failures.join('\n- ')}`)
  process.exit(1)
}

console.log('AgenticIncome public-surface verification passed (workflow proof, claims, analytics, privacy, 404, headers, responsive contracts).')
