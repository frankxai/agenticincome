#!/usr/bin/env node
/**
 * Generates crisp, code-exact SVG schematic plates (640x360) for every AgenticIncome offer.
 * Grounded in Refero Linear Changelog (11d3e58a) + Supabase (28aeb534) + Eraser (66b9ff99)
 * diagram-as-evidence discipline: zero bitmap blur, zero purple SaaS glow, exact typography.
 */
import fs from 'node:fs'
import path from 'node:path'

const outDir = path.join(process.cwd(), 'public', 'images', 'products')
fs.mkdirSync(outDir, { recursive: true })

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function frame({ badge, code, title, subtitle, footerLeft, footerRight, body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="640" height="360" fill="none" role="img" aria-label="${esc(title)}">
  <defs>
    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#1A1F2E" stroke-width="0.75" stroke-opacity="0.55"/>
    </pattern>
    <linearGradient id="surfaceGrad" x1="0" y1="0" x2="640" y2="360" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0A0C14"/>
      <stop offset="100%" stop-color="#05060A"/>
    </linearGradient>
  </defs>
  <rect width="640" height="360" rx="16" fill="url(#surfaceGrad)"/>
  <rect x="0.5" y="0.5" width="639" height="359" rx="15.5" stroke="#1A1F2E"/>
  <rect x="16" y="52" width="608" height="256" fill="url(#grid)" opacity="0.7"/>

  <!-- Top Telemetry Header -->
  <line x1="0" y1="48" x2="640" y2="48" stroke="#1A1F2E" stroke-width="1"/>
  <circle cx="24" cy="24" r="4" fill="#10B981"/>
  <text x="36" y="28" fill="#F1F3F9" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="11" font-weight="600">${esc(badge)}</text>
  <rect x="524" y="13" width="96" height="22" rx="11" fill="#101522" stroke="#1A1F2E"/>
  <text x="572" y="28" text-anchor="middle" fill="#8A90A8" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">${esc(code)}</text>

  <!-- Title Strip -->
  <text x="28" y="82" fill="#F1F3F9" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="19" font-weight="600">${esc(title)}</text>
  <text x="28" y="102" fill="#8A90A8" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="12">${esc(subtitle)}</text>

  <!-- Schematic Body -->
  ${body}

  <!-- Bottom Receipt Footer -->
  <line x1="0" y1="316" x2="640" y2="316" stroke="#1A1F2E" stroke-width="1"/>
  <text x="24" y="341" fill="#8A90A8" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10.5">${esc(footerLeft)}</text>
  <text x="616" y="341" text-anchor="end" fill="#10B981" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10.5">${esc(footerRight)}</text>
</svg>
`
}

const plates = {
  'plate-starter-kit.svg': frame({
    badge: 'STARTER KIT · FREE SPRINT GUIDE',
    code: 'FREE · $0',
    title: 'First Revenue Loop Schematic',
    subtitle: '30-minute sequence from real tool experience to owned audience capture',
    footerLeft: 'DELIVERY: /delivery/starter-kit · 5 SPRINT BLOCKS',
    footerRight: 'INSTANT ON-SITE ACCESS',
    body: `
      <rect x="28" y="132" width="176" height="146" rx="10" fill="#0A0C14" stroke="#1A1F2E"/>
      <text x="44" y="158" fill="#10B981" font-family="ui-monospace, monospace" font-size="10">01 · 00-12 MIN</text>
      <text x="44" y="180" fill="#F1F3F9" font-family="system-ui, sans-serif" font-size="14" font-weight="600">Category &amp; Query</text>
      <text x="44" y="202" fill="#8A90A8" font-family="system-ui, sans-serif" font-size="11">Pick 1 tested category</text>
      <text x="44" y="220" fill="#8A90A8" font-family="system-ui, sans-serif" font-size="11">Name plain buyer query</text>
      <rect x="44" y="240" width="144" height="22" rx="4" fill="#101522"/>
      <text x="52" y="255" fill="#F1F3F9" font-family="ui-monospace, monospace" font-size="10">X vs Y · best X for Y</text>

      <line x1="204" y1="205" x2="232" y2="205" stroke="#10B981" stroke-width="1.5"/>
      <polygon points="232,205 225,201 225,209" fill="#10B981"/>

      <rect x="232" y="132" width="176" height="146" rx="10" fill="#0A0C14" stroke="#10B981" stroke-opacity="0.55"/>
      <text x="248" y="158" fill="#10B981" font-family="ui-monospace, monospace" font-size="10">02 · 12-25 MIN</text>
      <text x="248" y="180" fill="#F1F3F9" font-family="system-ui, sans-serif" font-size="14" font-weight="600">Honest Comparison</text>
      <text x="248" y="202" fill="#8A90A8" font-family="system-ui, sans-serif" font-size="11">Best-fit winner first</text>
      <text x="248" y="220" fill="#8A90A8" font-family="system-ui, sans-serif" font-size="11">Non-affiliate option named</text>
      <rect x="248" y="240" width="144" height="22" rx="4" fill="#101522"/>
      <text x="256" y="255" fill="#34D399" font-family="ui-monospace, monospace" font-size="10">FTC/EU disclosure top</text>

      <line x1="408" y1="205" x2="436" y2="205" stroke="#10B981" stroke-width="1.5"/>
      <polygon points="436,205 429,201 429,209" fill="#10B981"/>

      <rect x="436" y="132" width="176" height="146" rx="10" fill="#0A0C14" stroke="#1A1F2E"/>
      <text x="452" y="158" fill="#F59E0B" font-family="ui-monospace, monospace" font-size="10">03 · 25-30 MIN</text>
      <text x="452" y="180" fill="#F1F3F9" font-family="system-ui, sans-serif" font-size="14" font-weight="600">Owned Relationship</text>
      <text x="452" y="202" fill="#8A90A8" font-family="system-ui, sans-serif" font-size="11">Workflow checklist opt-in</text>
      <text x="452" y="220" fill="#8A90A8" font-family="system-ui, sans-serif" font-size="11">Direct product bridge</text>
      <rect x="452" y="240" width="144" height="22" rx="4" fill="#101522"/>
      <text x="460" y="255" fill="#F59E0B" font-family="ui-monospace, monospace" font-size="10">starter-kit.md ready</text>
    `,
  }),

  'plate-blueprint.svg': frame({
    badge: 'BLUEPRINT V2 · CORE ARCHITECTURE',
    code: 'ONE-TIME · $67',
    title: 'Three Business-Plan Kits + Kill Criteria',
    subtitle: 'Worked fictional scenarios, fulfillment runbooks, and launch checklists',
    footerLeft: 'FILES: 00-README · service-kit · product-kit · system-kit',
    footerRight: '30-DAY REFUND · POLAR MoR',
    body: `
      <rect x="28" y="128" width="182" height="154" rx="10" fill="#0A0C14" stroke="#1A1F2E"/>
      <text x="44" y="152" fill="#06B6D4" font-family="ui-monospace, monospace" font-size="10">KIT 01 · SERVICES</text>
      <text x="44" y="173" fill="#F1F3F9" font-family="system-ui, sans-serif" font-size="13.5" font-weight="600">service-kit.md</text>
      <text x="44" y="195" fill="#8A90A8" font-family="system-ui, sans-serif" font-size="11">8+ hrs/wk entry lane</text>
      <text x="44" y="213" fill="#8A90A8" font-family="system-ui, sans-serif" font-size="11">Scoped audit &amp; sprint</text>
      <text x="44" y="231" fill="#8A90A8" font-family="system-ui, sans-serif" font-size="11">Acceptance check sheet</text>
      <text x="44" y="262" fill="#34D399" font-family="ui-monospace, monospace" font-size="10">Fastest to first client</text>

      <rect x="229" y="128" width="182" height="154" rx="10" fill="#101522" stroke="#10B981" stroke-opacity="0.7"/>
      <text x="245" y="152" fill="#10B981" font-family="ui-monospace, monospace" font-size="10">KIT 02 · PRODUCTS</text>
      <text x="245" y="173" fill="#F1F3F9" font-family="system-ui, sans-serif" font-size="13.5" font-weight="600">product-kit.md</text>
      <text x="245" y="195" fill="#8A90A8" font-family="system-ui, sans-serif" font-size="11">Packaged judgment</text>
      <text x="245" y="213" fill="#8A90A8" font-family="system-ui, sans-serif" font-size="11">Scenario unit economics</text>
      <text x="245" y="231" fill="#8A90A8" font-family="system-ui, sans-serif" font-size="11">Kill-criterion by date</text>
      <text x="245" y="262" fill="#10B981" font-family="ui-monospace, monospace" font-size="10">Self-serve digital desk</text>

      <rect x="430" y="128" width="182" height="154" rx="10" fill="#0A0C14" stroke="#1A1F2E"/>
      <text x="446" y="152" fill="#F59E0B" font-family="ui-monospace, monospace" font-size="10">KIT 03 · SYSTEMS</text>
      <text x="446" y="173" fill="#F1F3F9" font-family="system-ui, sans-serif" font-size="13.5" font-weight="600">system-kit.md</text>
      <text x="446" y="195" fill="#8A90A8" font-family="system-ui, sans-serif" font-size="11">Operated catalog assets</text>
      <text x="446" y="213" fill="#8A90A8" font-family="system-ui, sans-serif" font-size="11">Agent role runbooks</text>
      <text x="446" y="231" fill="#8A90A8" font-family="system-ui, sans-serif" font-size="11">Maintenance floor math</text>
      <text x="446" y="262" fill="#F59E0B" font-family="ui-monospace, monospace" font-size="10">Compounding directory</text>
    `,
  }),

  'plate-claims-guard-pack.svg': frame({
    badge: 'CLAIMS GUARD · VERIFICATION PACK',
    code: 'PACKAGED · $39',
    title: 'Five-Gate Pre-Publish Copy Auditor',
    subtitle: 'Audits regulated claims, dated citations, voice restraint, AI-slop, and disclosures',
    footerLeft: 'SOURCE: frankxai/agentic-business-os · MIT',
    footerRight: 'PASS / WARN / FAIL RECEIPT',
    body: `
      <rect x="28" y="134" width="172" height="142" rx="10" fill="#0A0C14" stroke="#1A1F2E"/>
      <text x="44" y="158" fill="#8A90A8" font-family="ui-monospace, monospace" font-size="10">INPUT DRAFT</text>
      <text x="44" y="184" fill="#F59E0B" font-family="ui-monospace, monospace" font-size="10.5">- Unverified $ claim</text>
      <text x="44" y="206" fill="#F59E0B" font-family="ui-monospace, monospace" font-size="10.5">- Undated vendor price</text>
      <text x="44" y="228" fill="#F59E0B" font-family="ui-monospace, monospace" font-size="10.5">- Missing disclosure</text>
      <text x="44" y="250" fill="#F59E0B" font-family="ui-monospace, monospace" font-size="10.5">- AI contrast cliché</text>

      <line x1="200" y1="205" x2="228" y2="205" stroke="#10B981" stroke-width="1.5"/>

      <rect x="228" y="126" width="184" height="158" rx="10" fill="#101522" stroke="#10B981" stroke-opacity="0.7"/>
      <text x="244" y="150" fill="#10B981" font-family="ui-monospace, monospace" font-size="10">5 DETERMINISTIC GATES</text>
      <text x="244" y="174" fill="#F1F3F9" font-family="ui-monospace, monospace" font-size="10.5">[1] Regulated claims</text>
      <text x="244" y="195" fill="#F1F3F9" font-family="ui-monospace, monospace" font-size="10.5">[2] Dated citations</text>
      <text x="244" y="216" fill="#F1F3F9" font-family="ui-monospace, monospace" font-size="10.5">[3] Voice restraint</text>
      <text x="244" y="237" fill="#F1F3F9" font-family="ui-monospace, monospace" font-size="10.5">[4] Anti-slop filter</text>
      <text x="244" y="258" fill="#F1F3F9" font-family="ui-monospace, monospace" font-size="10.5">[5] FTC/EU disclosure</text>

      <line x1="412" y1="205" x2="440" y2="205" stroke="#10B981" stroke-width="1.5"/>

      <rect x="440" y="134" width="172" height="142" rx="10" fill="#0A0C14" stroke="#1A1F2E"/>
      <text x="456" y="158" fill="#10B981" font-family="ui-monospace, monospace" font-size="10">AUDIT OUTPUT</text>
      <text x="456" y="186" fill="#F1F3F9" font-family="system-ui, sans-serif" font-size="13" font-weight="600">Line-level fixes</text>
      <text x="456" y="208" fill="#8A90A8" font-family="system-ui, sans-serif" font-size="11">Exact replacement text</text>
      <text x="456" y="226" fill="#8A90A8" font-family="system-ui, sans-serif" font-size="11">Claude &amp; CLI ready</text>
      <rect x="456" y="242" width="140" height="22" rx="4" fill="#101522"/>
      <text x="466" y="257" fill="#34D399" font-family="ui-monospace, monospace" font-size="10">0 errors · ship safe</text>
    `,
  }),

  'plate-vibe-os-pack.svg': frame({
    badge: 'VIBE OS · AUDIO & PROMPT KIT',
    code: 'PACKAGED · $24',
    title: 'State-to-Prompt Sonic Studio Pipeline',
    subtitle: '3 Claude skills, 4 Python audio utilities, and worked session scripts',
    footerLeft: 'SOURCE: frankxai/vibe-os · MIT · OWN SUNO ACCOUNT REQ.',
    footerRight: '3 SKILLS · 4 PYTHON TOOLS',
    body: `
      <rect x="28" y="134" width="584" height="142" rx="10" fill="#0A0C14" stroke="#1A1F2E"/>
      <rect x="46" y="154" width="126" height="102" rx="8" fill="#101522" stroke="#1A1F2E"/>
      <text x="60" y="176" fill="#F59E0B" font-family="ui-monospace, monospace" font-size="10">01 · TARGET</text>
      <text x="60" y="198" fill="#F1F3F9" font-family="system-ui, sans-serif" font-size="13" font-weight="600">Focus / Sprint</text>
      <text x="60" y="218" fill="#8A90A8" font-family="ui-monospace, monospace" font-size="10">BPM: 118-124</text>
      <text x="60" y="236" fill="#8A90A8" font-family="ui-monospace, monospace" font-size="10">Key: F# minor</text>

      <rect x="188" y="154" width="136" height="102" rx="8" fill="#101522" stroke="#10B981" stroke-opacity="0.65"/>
      <text x="202" y="176" fill="#10B981" font-family="ui-monospace, monospace" font-size="10">02 · COMPILER</text>
      <text x="202" y="198" fill="#F1F3F9" font-family="system-ui, sans-serif" font-size="13" font-weight="600">state_to_prompt</text>
      <text x="202" y="218" fill="#8A90A8" font-family="ui-monospace, monospace" font-size="10">Suno v4 tags</text>
      <text x="202" y="236" fill="#34D399" font-family="ui-monospace, monospace" font-size="10">Arrangement map</text>

      <rect x="340" y="154" width="126" height="102" rx="8" fill="#101522" stroke="#1A1F2E"/>
      <text x="354" y="176" fill="#06B6D4" font-family="ui-monospace, monospace" font-size="10">03 · LAYER</text>
      <text x="354" y="198" fill="#F1F3F9" font-family="system-ui, sans-serif" font-size="13" font-weight="600">stem_mixer.py</text>
      <text x="354" y="218" fill="#8A90A8" font-family="ui-monospace, monospace" font-size="10">Tone bed utility</text>
      <text x="354" y="236" fill="#8A90A8" font-family="ui-monospace, monospace" font-size="10">WAV / FLAC prep</text>

      <rect x="482" y="154" width="112" height="102" rx="8" fill="#101522" stroke="#1A1F2E"/>
      <text x="496" y="176" fill="#10B981" font-family="ui-monospace, monospace" font-size="10">04 · QC</text>
      <text x="496" y="198" fill="#F1F3F9" font-family="system-ui, sans-serif" font-size="13" font-weight="600">Release Gate</text>
      <text x="496" y="218" fill="#8A90A8" font-family="ui-monospace, monospace" font-size="10">Stem taxonomy</text>
      <text x="496" y="236" fill="#34D399" font-family="ui-monospace, monospace" font-size="10">Catalog row</text>
    `,
  }),

  'plate-abos-pack-bundle.svg': frame({
    badge: 'ABOS BUNDLE · 4 SKILL PACKS',
    code: 'BUNDLE · $99',
    title: 'Complete Agentic Business OS Skill Suite',
    subtitle: 'Four local skill folders + registry.json + install guide',
    footerLeft: 'SOURCE: frankxai/agentic-business-os · MIT',
    footerRight: '4 PACKS · NO SAAS LOCK-IN',
    body: `
      <rect x="28" y="128" width="284" height="68" rx="8" fill="#101522" stroke="#10B981" stroke-opacity="0.6"/>
      <text x="44" y="151" fill="#10B981" font-family="ui-monospace, monospace" font-size="10">PACK 01 · CLAIMS GUARD</text>
      <text x="44" y="173" fill="#F1F3F9" font-family="system-ui, sans-serif" font-size="13" font-weight="600">5-gate pre-publish copy &amp; disclosure check</text>

      <rect x="328" y="128" width="284" height="68" rx="8" fill="#0A0C14" stroke="#1A1F2E"/>
      <text x="344" y="151" fill="#06B6D4" font-family="ui-monospace, monospace" font-size="10">PACK 02 · BUSINESS INTELLIGENCE</text>
      <text x="344" y="173" fill="#F1F3F9" font-family="system-ui, sans-serif" font-size="13" font-weight="600">File-based decision, spend &amp; offer memory</text>

      <rect x="28" y="210" width="284" height="68" rx="8" fill="#0A0C14" stroke="#1A1F2E"/>
      <text x="44" y="233" fill="#F59E0B" font-family="ui-monospace, monospace" font-size="10">PACK 03 · DESIGN CONTRACT</text>
      <text x="44" y="255" fill="#F1F3F9" font-family="system-ui, sans-serif" font-size="13" font-weight="600">design.md + taste.md non-averaged locks</text>

      <rect x="328" y="210" width="284" height="68" rx="8" fill="#0A0C14" stroke="#1A1F2E"/>
      <text x="344" y="233" fill="#34D399" font-family="ui-monospace, monospace" font-size="10">PACK 04 · WEEKLY RHYTHM</text>
      <text x="344" y="255" fill="#F1F3F9" font-family="system-ui, sans-serif" font-size="13" font-weight="600">Founder Monday scope &amp; Friday receipt loop</text>
    `,
  }),

  'plate-agent-team-pro.svg': frame({
    badge: 'AGENT TEAM PRO · ROLE WORKFLOW',
    code: 'STAGED · $129',
    title: 'Maker + Independent Verifier Loop Topology',
    subtitle: 'Role constitutions, worktree isolation, budget caps, and human money gates',
    footerLeft: 'INCLUDES: 12 MONTHS OF UPDATES · PERSONAL LICENSE',
    footerRight: 'PAYLOAD IN ASSEMBLY · WAITLIST',
    body: `
      <rect x="28" y="142" width="132" height="124" rx="10" fill="#0A0C14" stroke="#1A1F2E"/>
      <text x="42" y="166" fill="#06B6D4" font-family="ui-monospace, monospace" font-size="10">01 · MAKER</text>
      <text x="42" y="188" fill="#F1F3F9" font-family="system-ui, sans-serif" font-size="13" font-weight="600">Isolated Branch</text>
      <text x="42" y="210" fill="#8A90A8" font-family="system-ui, sans-serif" font-size="11">Claimed path lane</text>
      <text x="42" y="228" fill="#8A90A8" font-family="system-ui, sans-serif" font-size="11">Tests + build</text>

      <line x1="160" y1="204" x2="184" y2="204" stroke="#10B981" stroke-width="1.5"/>

      <rect x="184" y="142" width="136" height="124" rx="10" fill="#101522" stroke="#10B981" stroke-opacity="0.7"/>
      <text x="198" y="166" fill="#10B981" font-family="ui-monospace, monospace" font-size="10">02 · VERIFIER</text>
      <text x="198" y="188" fill="#F1F3F9" font-family="system-ui, sans-serif" font-size="13" font-weight="600">Separate Context</text>
      <text x="198" y="210" fill="#8A90A8" font-family="system-ui, sans-serif" font-size="11">Exact git SHA audit</text>
      <text x="198" y="228" fill="#8A90A8" font-family="system-ui, sans-serif" font-size="11">No write overlap</text>

      <line x1="320" y1="204" x2="344" y2="204" stroke="#F59E0B" stroke-width="1.5"/>

      <rect x="344" y="142" width="128" height="124" rx="10" fill="#0A0C14" stroke="#F59E0B" stroke-opacity="0.65"/>
      <text x="358" y="166" fill="#F59E0B" font-family="ui-monospace, monospace" font-size="10">03 · HUMAN GATE</text>
      <text x="358" y="188" fill="#F1F3F9" font-family="system-ui, sans-serif" font-size="13" font-weight="600">Fail Closed</text>
      <text x="358" y="210" fill="#8A90A8" font-family="system-ui, sans-serif" font-size="11">Pricing &amp; spend</text>
      <text x="358" y="228" fill="#8A90A8" font-family="system-ui, sans-serif" font-size="11">External sends</text>

      <line x1="472" y1="204" x2="494" y2="204" stroke="#10B981" stroke-width="1.5"/>

      <rect x="494" y="142" width="118" height="124" rx="10" fill="#0A0C14" stroke="#1A1F2E"/>
      <text x="508" y="166" fill="#34D399" font-family="ui-monospace, monospace" font-size="10">04 · RECEIPT</text>
      <text x="508" y="188" fill="#F1F3F9" font-family="system-ui, sans-serif" font-size="13" font-weight="600">runs.jsonl</text>
      <text x="508" y="210" fill="#8A90A8" font-family="system-ui, sans-serif" font-size="11">SHA-256 proof</text>
      <text x="508" y="228" fill="#8A90A8" font-family="system-ui, sans-serif" font-size="11">Rollback SHA</text>
    `,
  }),

  'plate-private-intel.svg': frame({
    badge: 'PRIVATE INTEL · MONTHLY DOSSIER',
    code: 'SUB · $19/MO',
    title: 'Dated Payer-Term Drift & Watchlist Brief',
    subtitle: 'Monthly catalog diffs, program rule changes, and priority comparison opportunities',
    footerLeft: 'FORMAT: YYYY-MM-BRIEF.md + MEMBER Q&A WINDOW',
    footerRight: 'CANCEL ANYTIME · 1ST MO REFUND',
    body: `
      <rect x="28" y="130" width="584" height="150" rx="10" fill="#0A0C14" stroke="#1A1F2E"/>
      <line x1="28" y1="164" x2="612" y2="164" stroke="#1A1F2E"/>
      <text x="46" y="151" fill="#8A90A8" font-family="ui-monospace, monospace" font-size="10">SECTION</text>
      <text x="230" y="151" fill="#8A90A8" font-family="ui-monospace, monospace" font-size="10">VERIFIED SIGNAL</text>
      <text x="488" y="151" fill="#8A90A8" font-family="ui-monospace, monospace" font-size="10">NEXT ACTION</text>

      <text x="46" y="190" fill="#F1F3F9" font-family="ui-monospace, monospace" font-size="11">01 · Term Drift</text>
      <text x="230" y="190" fill="#8A90A8" font-family="system-ui, sans-serif" font-size="11.5">Commission &amp; cookie-window diffs</text>
      <text x="488" y="190" fill="#10B981" font-family="ui-monospace, monospace" font-size="10.5">Update /tools rows</text>

      <line x1="46" y1="204" x2="594" y2="204" stroke="#1A1F2E" stroke-opacity="0.7"/>
      <text x="46" y="226" fill="#F1F3F9" font-family="ui-monospace, monospace" font-size="11">02 · Watchlist</text>
      <text x="230" y="226" fill="#8A90A8" font-family="system-ui, sans-serif" font-size="11.5">High-switching-pain categories</text>
      <text x="488" y="226" fill="#34D399" font-family="ui-monospace, monospace" font-size="10.5">Ship comparison</text>

      <line x1="46" y1="240" x2="594" y2="240" stroke="#1A1F2E" stroke-opacity="0.7"/>
      <text x="46" y="262" fill="#F1F3F9" font-family="ui-monospace, monospace" font-size="11">03 · Audit Notes</text>
      <text x="230" y="262" fill="#8A90A8" font-family="system-ui, sans-serif" font-size="11.5">Programs failing trust check</text>
      <text x="488" y="262" fill="#F59E0B" font-family="ui-monospace, monospace" font-size="10.5">Route non-affiliate</text>
    `,
  }),

  'plate-implementation-sprint.svg': frame({
    badge: 'AGENT-AS-A-SERVICE · SCOPED SPRINT',
    code: 'SCOPE FIRST',
    title: 'Audit -> Architect -> Implement -> Verify',
    subtitle: 'Git-backed revenue workflow built on an isolated branch with Vercel preview',
    footerLeft: 'NO PAYMENT ON-SITE · WRITTEN ACCEPTANCE GATES FIRST',
    footerRight: 'BUYER OWNS REPO & CODE',
    body: `
      <rect x="28" y="138" width="136" height="128" rx="10" fill="#0A0C14" stroke="#1A1F2E"/>
      <text x="44" y="164" fill="#F59E0B" font-family="ui-monospace, monospace" font-size="10">STEP 01</text>
      <text x="44" y="188" fill="#F1F3F9" font-family="system-ui, sans-serif" font-size="14" font-weight="600">Audit</text>
      <text x="44" y="210" fill="#8A90A8" font-family="system-ui, sans-serif" font-size="11">Workflow &amp; model</text>
      <text x="44" y="228" fill="#8A90A8" font-family="system-ui, sans-serif" font-size="11">Stop conditions</text>

      <rect x="178" y="138" width="136" height="128" rx="10" fill="#0A0C14" stroke="#1A1F2E"/>
      <text x="194" y="164" fill="#06B6D4" font-family="ui-monospace, monospace" font-size="10">STEP 02</text>
      <text x="194" y="188" fill="#F1F3F9" font-family="system-ui, sans-serif" font-size="14" font-weight="600">Architect</text>
      <text x="194" y="210" fill="#8A90A8" font-family="system-ui, sans-serif" font-size="11">Offer &amp; path spec</text>
      <text x="194" y="228" fill="#8A90A8" font-family="system-ui, sans-serif" font-size="11">DESIGN.md lock</text>

      <rect x="328" y="138" width="136" height="128" rx="10" fill="#101522" stroke="#10B981" stroke-opacity="0.7"/>
      <text x="344" y="164" fill="#10B981" font-family="ui-monospace, monospace" font-size="10">STEP 03</text>
      <text x="344" y="188" fill="#F1F3F9" font-family="system-ui, sans-serif" font-size="14" font-weight="600">Implement</text>
      <text x="344" y="210" fill="#8A90A8" font-family="system-ui, sans-serif" font-size="11">Isolated git branch</text>
      <text x="344" y="228" fill="#8A90A8" font-family="system-ui, sans-serif" font-size="11">Lint + type + test</text>

      <rect x="478" y="138" width="134" height="128" rx="10" fill="#0A0C14" stroke="#1A1F2E"/>
      <text x="494" y="164" fill="#34D399" font-family="ui-monospace, monospace" font-size="10">STEP 04</text>
      <text x="494" y="188" fill="#F1F3F9" font-family="system-ui, sans-serif" font-size="14" font-weight="600">Verify</text>
      <text x="494" y="210" fill="#8A90A8" font-family="system-ui, sans-serif" font-size="11">Live preview URL</text>
      <text x="494" y="228" fill="#8A90A8" font-family="system-ui, sans-serif" font-size="11">Handoff receipt</text>
    `,
  }),
}

for (const [filename, svg] of Object.entries(plates)) {
  fs.writeFileSync(path.join(outDir, filename), svg, 'utf8')
}
console.log(`Generated ${Object.keys(plates).length} SVG product plates in ${outDir}`)
