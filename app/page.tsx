import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { AgentWorkflowProof } from '@/components/AgentWorkflowProof'
import { ArrowUpRight } from '@/components/ArrowUpRight'
import { HomeWaitlist } from '@/components/HomeWaitlist'
import { PilotDecisionDesk } from '@/components/PilotDecisionDesk'
import { RevenueScenario } from '@/components/RevenueScenario'
import incomeModels from '@/data/income-models.json'
import { verifiedEconomicsPrograms } from '@/lib/affiliate'
import { checkoutUrl, getOffer } from '@/lib/offers'
import { checkoutRelease, isCheckoutLive, type CatalogProduct } from '@/lib/polar'
import { pilot, contribution, downside } from '@/lib/quote-review-case'
import catalog from '@/products/catalog.json'
import './revenue-desk.css'

const title = 'Agentic Income | The Revenue Desk'
const description = 'A research and pricing workbench for AI services. Test a quote-review pilot, inspect the costs and take an editable brief into a buyer conversation.'
const artwork = '/brand/decision-instrument.webp'
const coverImage = { url: artwork, alt: 'An articulated hand adjusts an orbital glass instrument on a mahogany worktable.' }

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: '/' },
  openGraph: { title, description, url: '/', images: [coverImage] },
  twitter: { card: 'summary_large_image', title, description, images: [coverImage] },
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

const paths: Record<string, { title: string; description: string; href: string }> = {
  services: {
    title: 'Commission a pilot',
    description: 'Bring one workflow, a budget owner and an acceptance test. Scope the build with Frank.',
    href: '/offers/implementation-sprint',
  },
  products: {
    title: 'Build it yourself',
    description: 'Download the starter kit. Work through the checklist and keep the files.',
    href: '/delivery/starter-kit',
  },
  systems: {
    title: 'Connect your agent',
    description: 'Query partner terms, delivery models and product availability over MCP.',
    href: '/mcp',
  },
}

const currency = new Intl.NumberFormat('en-IE', {
  style: 'currency', currency: 'EUR', maximumFractionDigits: 0,
})
const sourceDate = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
})

function accessLabel(product: CatalogProduct) {
  if (product.price_cents === 0) return 'Free download'
  const offer = getOffer(product.id)
  if (isCheckoutLive(product.id) || (offer && checkoutUrl(offer))) {
    return checkoutRelease() === 'sandbox' ? 'Test checkout' : 'Checkout open'
  }
  return 'Checkout closed'
}

export default function Home() {
  const programs = verifiedEconomicsPrograms()
  const casePath = '/blog/' + pilot.slug

  return (
    <div className="revenue-edition">
      <section className="edition-cover" aria-labelledby="edition-title">
        <div className="edition-cover-copy">
          <p className="edition-kicker"><span className="edition-rule" aria-hidden="true" />The Revenue Desk</p>
          <h1 id="edition-title">The price of<br /><em>a second look.</em></h1>
          <p className="edition-lede">
            A {currency.format(pilot.price)} AI quote-review pilot leaves {currency.format(contribution)} after variable
            costs. Four extra hours of human review cut that to {currency.format(downside)}.
          </p>
          <a className="edition-action" href="#unit-economics">
            Test the pilot <span className="edition-down" aria-hidden="true">↓</span>
          </a>
          <p className="edition-byline">A modeled case for sales and finance teams</p>
        </div>
        <figure className="edition-plate">
          <div className="edition-plate-image">
            <Image src={artwork} alt={coverImage.alt} fill preload unoptimized sizes="(max-width: 720px) 100vw, 57vw" />
          </div>
          <figcaption><span>Orbital glass &amp; mahogany</span><span>Starlight material study</span></figcaption>
        </figure>
      </section>

      <div className="edition-console">
        <PilotDecisionDesk />
      </div>

      <section className="edition-studio edition-width" aria-labelledby="edition-studio-title">
        <figure className="edition-studio-plate">
          <Image src="/brand/revenue-desk-guitarist.webp" alt="A brass and porcelain guitarist in a mahogany recording studio." width={1536} height={1024} loading="lazy" unoptimized sizes="(max-width: 720px) 100vw, 44vw" />
        </figure>
        <div className="edition-studio-copy">
          <p className="edition-kicker"><span className="edition-rule" aria-hidden="true" />From the studio</p>
          <h2 id="edition-studio-title">What would make this pilot worth funding?</h2>
          <p>A sales lead can hand over ten redacted quotes. Finance can name the discrepancies that matter. Those two decisions give the team something concrete to build and test.</p>
          <Link className="edition-link" href={casePath}>Read the field note <ArrowUpRight /></Link>
          <p className="edition-credit">Edited by <a href="https://www.frankx.ai/frank-riemer">Frank Riemer</a> <span aria-hidden="true">/</span> <Link href="/blog">Research journal</Link></p>
        </div>
      </section>

      <section className="edition-routes" aria-labelledby="edition-routes-title">
        <div className="edition-width edition-routes-grid">
          <div className="edition-routes-intro">
            <p className="edition-kicker"><span className="edition-rule" aria-hidden="true" />Work with the desk</p>
            <h2 id="edition-routes-title">Take it<br /><em>further.</em></h2>
          </div>
          <ul className="edition-route-list">
            {incomeModels.models.map(model => {
              const route = paths[model.id]
              if (!route) return null
              return (
                <li key={model.id}>
                  <Link href={route.href}>
                    <div><h3>{route.title}</h3><p>{route.description}</p></div>
                    <span className="edition-route-arrow"><ArrowUpRight /></span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="edition-index edition-width" aria-labelledby="edition-index-title">
        <div className="edition-index-heading">
          <h2 id="edition-index-title">Desk reference</h2>
          <Link className="edition-link" href="/workbench/offer-brief">Open the workbench <ArrowUpRight /></Link>
        </div>
        <details>
          <summary>Partner economics<span>Dated terms &amp; sources</span></summary>
          <div className="edition-reference-body">
            <p>Programs may pay a commission on referred purchases. Each figure below links to the provider’s terms.</p>
            <dl className="edition-ledger">
              {programs.map(program => (
                <div key={program.tool}>
                  <dt>{program.tool}</dt>
                  <dd>{program.commission}</dd>
                  <dd>{program.commissionVerifiedAt && (
                    <a href={program.commissionSourceUrl} rel="nofollow">
                      <time dateTime={program.commissionVerifiedAt}>{sourceDate.format(new Date(program.commissionVerifiedAt + 'T00:00:00Z'))}</time> <ArrowUpRight />
                    </a>
                  )}</dd>
                </div>
              ))}
            </dl>
            <Link className="edition-link" href="/tools">Explore the partner catalog <ArrowUpRight /></Link>
          </div>
        </details>
        <details id="products">
          <summary>Digital editions<span>Prices &amp; availability</span></summary>
          <div className="edition-reference-body">
            <dl className="edition-ledger">
              {catalog.products.map(product => (
                <div key={product.id}>
                  <dt><Link href={product.price_cents === 0 ? '/delivery/starter-kit' : '/offers/' + product.id}>{product.name} <ArrowUpRight /></Link></dt>
                  <dd>{product.price_cents === 0 ? 'Free' : '$' + product.price_cents / 100 + (product.interval ? '/' + product.interval : '')}</dd>
                  <dd>{accessLabel(product)}</dd>
                </div>
              ))}
            </dl>
            <HomeWaitlist />
          </div>
        </details>
        <details>
          <summary>Agent access &amp; evidence<span>MCP tools &amp; source</span></summary>
          <div className="edition-reference-body">
            <Link className="edition-link" href="/mcp">Connect to the MCP server <ArrowUpRight /></Link>
            <dl className="edition-ledger edition-tool-ledger">
              {MCP_TOOLS.map(tool => <div key={tool.name}><dt><code>{tool.name}</code></dt><dd>{tool.desc}</dd></div>)}
            </dl>
            <AgentWorkflowProof />
          </div>
        </details>
        <details>
          <summary>Studio review calculator<span>Price your own offer</span></summary>
          <div className="edition-reference-body"><RevenueScenario id="studio-unit-economics" /></div>
        </details>
      </section>
    </div>
  )
}
