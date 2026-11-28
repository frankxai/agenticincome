import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from '@/components/ArrowUpRight'
import { BusinessStudio } from '@/components/BusinessStudio'
import { AgentWorkflowProof } from '@/components/AgentWorkflowProof'
import './product-home.css'

const title = 'Agentic Income | Build your next business with AI'
const description = 'Turn your expertise into an AI service, a digital product or a research business. Build a plan, explore practical tools and take your work into your own AI setup.'
export const metadata: Metadata = {
  title: { absolute: title }, description, alternates: { canonical: '/' },
  openGraph: { title, description, url: '/', images: [{url:'/brand/revenue-desk-listening-room.webp',alt:'Original Starlight androids in an Amsterdam studio, with orbital glass and a view into space.'}] },
  twitter: { card: 'summary_large_image', title, description, images: ['/brand/revenue-desk-listening-room.webp'] },
}

const MCP_TOOLS = [
  { name: 'list_income_models', desc: 'Compare the three delivery routes.' },
  { name: 'get_income_model', desc: 'Inspect one route and its scope.' },
  { name: 'search_partner_programs', desc: 'Find programs with published terms.' },
  { name: 'get_partner_program', desc: 'Read the commission, source and last check.' },
  { name: 'list_products', desc: 'Check pack contents and purchase status.' },
  { name: 'fit_check', desc: 'Match available time, budget and skills to a route.' },
  { name: 'get_playbook', desc: 'Read a playbook or starter kit.' },
]

export default function Home() {
  return <div className="product-home">
    <section className="product-opening" aria-labelledby="product-title">
      <div className="product-world" aria-hidden="true">
        <Image src="/brand/revenue-desk-listening-room.webp" alt="" fill preload unoptimized sizes="100vw" />
      </div>
      <div className="product-opening-inner">
        <div className="product-intro">
          <p className="product-eyebrow">A business of your own. Built with AI.</p>
          <h1 id="product-title">Build your next<br />business<br /><span>with AI.</span></h1>
          <p className="product-intro-copy">Turn what you know into a service, a digital product or a research business. Find your starting point and build a plan you can take into your AI tools.</p>
          <div className="product-hero-actions"><a href="#studio" className="product-button">Start building <ArrowUpRight /></a><Link href="/delivery/starter-kit" className="product-text-link">Get the free toolkit</Link></div>
          <p className="product-intro-foot">For independent founders, creators and ambitious teams.</p>
        </div>
        <div className="product-studio-position"><BusinessStudio /></div>
      </div>
      <div className="product-world-caption"><span>Made with Starlight Intelligence</span><span>Original characters. Human imagination.</span></div>
    </section>

    <section className="product-paths product-width" aria-labelledby="paths-title">
      <div className="product-section-title"><p className="product-eyebrow">Choose your way in</p><h2 id="paths-title">Start with what<br />you want to create.</h2></div>
      <div className="product-path-list">
        <Link href="/workbench/offer-brief"><span className="product-path-type">Build</span><div><h3>Shape your first offer.</h3><p>Define the buyer, deliverable, cost and first test. Leave with an editable brief.</p></div><ArrowUpRight /></Link>
        <Link href="/delivery/starter-kit"><span className="product-path-type">Learn</span><div><h3>Take the tools with you.</h3><p>Open the starter kit, inspect the files and use them in your own workflow.</p></div><ArrowUpRight /></Link>
        <Link href="/blog"><span className="product-path-type">Discover</span><div><h3>Find your next advantage.</h3><p>Research on AI business models, useful tools and the economics behind an offer.</p></div><ArrowUpRight /></Link>
        <Link href="/offers/implementation-sprint"><span className="product-path-type">Commission</span><div><h3>Build it with Frank.</h3><p>Bring a business problem. Agree the scope for a custom AI implementation.</p></div><ArrowUpRight /></Link>
      </div>
    </section>

    <section className="product-team-scene" aria-labelledby="team-title">
      <div className="product-team-art"><Image src="/brand/revenue-desk-guitarist.webp" alt="An original brass and porcelain android plays a guitar in a mahogany studio." fill unoptimized sizes="(max-width: 760px) 100vw, 50vw" /></div>
      <div className="product-team-copy"><p className="product-eyebrow">An extension of your imagination</p><h2 id="team-title">You bring<br />the vision.</h2><p>Give your AI tools the context that makes the work yours. A clear customer. A useful outcome. Your standards for what ships.</p><p>The plans and skills here are portable. Use the web workbench, download the files, or connect your assistant through MCP.</p><div className="product-hero-actions"><Link href="/mcp" className="product-button">Connect your AI <ArrowUpRight /></Link><Link href="/pack" className="product-text-link">Explore the skills</Link></div></div>
    </section>

    <section className="product-research product-width" aria-labelledby="research-title">
      <div className="product-section-title"><p className="product-eyebrow">Inside the research</p><h2 id="research-title">Know what<br />you’re building.</h2><p>Explore the business model as deeply as the technology.</p></div>
      <div className="product-research-links">
        <Link href="/blog/pricing-ai-work"><span>Pricing &amp; value</span><h3>What are people actually buying?</h3><p>How AI products, education and research businesses define their value.</p><b>Read the research ↗</b></Link>
        <Link href="/workbench/quote-review"><span>Interactive worked case</span><h3>Does the delivery make economic sense?</h3><p>Change the price and review time on a fictional service. See the tradeoffs.</p><b>Open the model ↗</b></Link>
      </div>
    </section>

    <section className="product-close product-width"><div><p className="product-eyebrow">From a first idea to your own system</p><h2>What will you build?</h2></div><a className="product-button" href="#studio">Start with your idea <ArrowUpRight /></a></section>
    <details className="product-proof product-width"><summary>Connect from your AI assistant</summary><p>Use the MCP connection to explore income models, partner terms and available products.</p><ul>{MCP_TOOLS.map(tool => <li key={tool.name}><code>{tool.name}</code> — {tool.desc}</li>)}</ul><Link className="product-text-link" href="/mcp">Open connection instructions</Link></details>
    <details className="product-proof product-width"><summary>Explore the working open-source example</summary><AgentWorkflowProof /></details>
  </div>
}
