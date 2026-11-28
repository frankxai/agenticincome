import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from '@/components/ArrowUpRight'
import { IncomeChat } from '@/components/IncomeChat'
import { AgentWorkflowProof } from '@/components/AgentWorkflowProof'
import './income-home.css'

const title = 'Agentic Income | AI business studio'
const description = 'Ask about building an AI business. Explore income models, check partner terms and work through your offer economics with the Agentic Income tools.'
export const metadata: Metadata = {
  title: { absolute: title }, description, alternates: { canonical: '/' },
  openGraph: { title, description, url: '/', images: [{url:'/brand/income-orbital-studio.webp',alt:'An original Starlight android in an orbital studio.'}] },
  twitter: { card: 'summary_large_image', title, description, images: ['/brand/income-orbital-studio.webp'] },
}

const MCP_TOOLS = [
  { name: 'draft_offer_experiment', desc: 'Calculate what one sale contributes and export your brief.' },
  { name: 'minimum_offer_price', desc: 'Find the lowest price that covers your target margin.' },
  { name: 'draft_income_graph', desc: 'Identify what your idea still needs to prove.' },
  { name: 'export_income_system_tasks', desc: 'Take the experiment checklist into your own assistant.' },
  { name: 'list_income_models', desc: 'Compare the three delivery routes.' },
  { name: 'get_income_model', desc: 'Inspect one route and its scope.' },
  { name: 'search_partner_programs', desc: 'Find programs with published terms.' },
  { name: 'get_partner_program', desc: 'Read the commission, source and last check.' },
  { name: 'list_products', desc: 'Check pack contents and purchase status.' },
  { name: 'fit_check', desc: 'Match available time, budget and skills to a route.' },
  { name: 'get_playbook', desc: 'Read a playbook or starter kit.' },
]

export default function Home() {
  return <div className="income-home">
    <section className="income-atrium" aria-labelledby="income-welcome">
      <div className="income-scene" aria-hidden="true">
        <Image src="/brand/income-orbital-studio.webp" alt="" fill preload unoptimized sizes="100vw" />
      </div>
      <div className="income-entrance">
        <div className="income-intro">
          <h1 id="income-welcome">What do you want<br />to <em>build?</em></h1>
          <p>Shape an AI business idea, see what you keep on a sale, or find a partner with published terms.</p>
        </div>
        <div className="income-conversation"><IncomeChat /></div>
        <noscript><p className="income-nojs">For options without chat, <Link href="/delivery/starter-kit">download the starter kit</Link> or <Link href="/mcp">connect your assistant</Link>.</p></noscript>
      </div>
    </section>

    <section className="income-resources" aria-label="Research and tools">
      <Link href="/blog/pricing-ai-work">
        <div className="income-resource-image"><Image src="/brand/decision-instrument.webp" alt="" fill unoptimized sizes="(max-width: 700px) 100vw, 33vw" /></div>
        <small>Research</small><h2>How to price AI work <ArrowUpRight /></h2><p>Four business models and what their customers actually buy.</p>
      </Link>
      <Link href="/delivery/starter-kit">
        <div className="income-resource-image"><Image src="/brand/revenue-desk-guitarist.webp" alt="" fill unoptimized sizes="(max-width: 700px) 100vw, 33vw" /></div>
        <small>Free toolkit</small><h2>Build your first offer <ArrowUpRight /></h2><p>Take the starter files into your own studio.</p>
      </Link>
      <Link href="/workbench/quote-review">
        <div className="income-resource-image"><Image src="/brand/income-desk-hero-poster.webp" alt="" fill unoptimized sizes="(max-width: 700px) 100vw, 33vw" /></div>
        <small>Interactive case</small><h2>Test the margin <ArrowUpRight /></h2><p>See what four more delivery hours do to a €1,500 pilot.</p>
      </Link>
    </section>

    <section className="income-connect" aria-labelledby="connect-heading">
      <div><h2 id="connect-heading">Use your own assistant.</h2><p>Connect to the same Agentic Income research, playbooks and economics tools over MCP.</p></div>
      <Link href="/mcp">Connect via MCP <ArrowUpRight /></Link>
    </section>
    <div className="income-library">
      <details><summary>Explore the MCP tools</summary><ul>{MCP_TOOLS.map(tool => <li key={tool.name}><code>{tool.name}</code><span>{tool.desc}</span></li>)}</ul><Link href="/mcp">Connection instructions</Link></details>
      <details><summary>See the open-source workflow</summary><AgentWorkflowProof /></details>
      <p>Working on a custom implementation? <Link href="/offers/implementation-sprint">Build it with Frank <ArrowUpRight /></Link></p>
    </div>
  </div>
}
