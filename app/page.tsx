import type { Metadata } from 'next'
import Link from 'next/link'
import { AgentWorkflowProof } from '@/components/AgentWorkflowProof'
import { verifiedEconomicsPrograms, verifiedRangeLabel } from '@/lib/affiliate'
import incomeModels from '@/data/income-models.json'
import catalog from '@/products/catalog.json'

export const metadata: Metadata = {
  title: 'Agentic Income — Agent-as-a-Service implementation, products, and disclosed research',
  description:
    'An operating system for Agent-as-a-Service delivery: productized implementation, digital products, and open-core proof. Clear scope, inspectable deliverables, and human-gated authority — zero income promises.',
  alternates: { canonical: '/' },
  openGraph: { url: '/' },
}

const MCP_TOOLS = [
  { name: 'list_income_models', desc: 'The three revenue delivery routes with customer jobs and deliverables.' },
  { name: 'get_income_model', desc: 'One route in full, including deliverables, scope, and next actions.' },
  { name: 'search_partner_programs', desc: 'The partner registry: rates, cookies, status, disclosed links.' },
  { name: 'get_partner_program', desc: 'Full record with commission note, source URL, verification date.' },
  { name: 'list_products', desc: 'The catalog with real availability — purchasable is false until checkout is live.' },
  { name: 'fit_check', desc: 'Deterministic recommendation: which route fits your hours, budget, audience, skills.' },
  { name: 'get_playbook', desc: 'The free starter kit and dated knowledge-track summaries.' },
]

type Product = {
  id: string
  name: string
  price_cents: number
  interval: string | null
  status: string
  delivery: { path: string }
}

function priceLabel(p: Product): string {
  if (p.price_cents === 0) return 'Free'
  const dollars = `$${(p.price_cents / 100).toFixed(0)}`
  return p.interval ? `${dollars}/${p.interval}` : dollars
}

export default function Home() {
  const models = incomeModels.models
  const verified = verifiedEconomicsPrograms()
  const products = catalog.products as Product[]

  return (
    <>
      {/* SECTION 1 — hero: the literal offer plus real MCP output */}
      <section className="section-band">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="kicker">Agentic Income — Agent-as-a-Service Engine</div>
            <h1 className="assembly-title">
              Agent-as-a-Service.
            </h1>
            <p className="assembly-sub">
              An operating system for productized implementation sprints, digital
              products, and open-core reference systems. Scoped deliverables, inspectable code, and
              human approval gates — zero outcome promises.
            </p>
            <div className="assembly-actions">
              <Link href="/offers" className="cta">View implementation scope</Link>
              <Link href="/start" className="cta-secondary">Start free</Link>
            </div>
          </div>

          <div
            className="terminal"
            role="img"
            aria-label="Terminal: connecting the agentic-income MCP server with Claude Code and running the fit_check tool, which returns a services-model recommendation"
          >
            <div className="terminal-bar">
              <i /><i /><i />
              <span className="ml-2">shell — live endpoint /api/mcp</span>
            </div>
            <div className="terminal-body">
              <div className="t-out"><span className="t-accent">$</span> <span className="text-ink">claude mcp add --transport http agentic-income \</span></div>
              <div className="t-out">    https://www.agenticincome.ai/api/mcp</div>
              <div className="t-cmd mt-3">fit_check hours=10 budget=200 audience=no code=yes</div>
              <div className="t-out">{'{ "model": "services",'}</div>
              <div className="t-out">{'  "why": "10 focused hours and working code'}</div>
              <div className="t-out">    skills price you into agent-assisted</div>
              <div className="t-out">{'    delivery work first.",'}</div>
              <div className="t-out">{'  "read": "/start" }'}<span className="t-caret ml-2" /></div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — the three service & delivery routes */}
      <section className="section-band">
        <div className="section-heading motion-reveal">
          <div className="kicker">Delivery routes</div>
          <h2 className="display-h2">Three delivery routes for customer value.</h2>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {models.map((model) => (
            <div key={model.id} className="path-card motion-reveal">
              <div className="path-stage">{model.id}</div>
              <h3>{model.name}</h3>
              <p className="text-sm leading-relaxed text-[color:var(--color-muted)]">{model.summary}</p>
              <div className="path-econ">
                <b>Execution:</b> {model.laborProfile}
                <br />
                <b>Timeframe:</b> {model.timeToFirstDollar}
                <br />
                <b>Risk boundary:</b> {model.failureMode}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3 — partner economics board */}
      <section className="section-band">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="section-heading motion-reveal">
            <div className="kicker text-[color:var(--color-gold)]">The partner economics board</div>
            <h2 className="display-h2">Recurring beats one-time. We publish the rates.</h2>
          </div>
          <Link href="/tools" className="cta-secondary">Full catalog</Link>
        </div>
        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface/80 motion-reveal">
          <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Partner economics comparison">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted">
                  <th className="px-5 py-4 font-medium">Program</th>
                  <th className="px-5 py-4 font-medium">Commission</th>
                  <th className="px-5 py-4 font-medium">Cookie window</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {verified.map((program) => (
                  <tr key={program.tool} className="border-t border-border/70">
                    <td className="px-5 py-4 font-semibold text-ink">{program.tool}</td>
                    <td className="px-5 py-4 text-ink">{program.commission}</td>
                    <td className="px-5 py-4 text-muted">{program.cookieDays ? `${program.cookieDays} days` : 'not published'}</td>
                    <td className="px-5 py-4 text-muted">{program.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-4 text-xs leading-6 text-muted">
          Affiliate links disclosed. Rates verified {verifiedRangeLabel(verified)} against each program{"'"}s own terms.
        </p>
      </section>

      {/* SECTION 4 — the MCP server */}
      <section className="section-band">
        <div className="section-heading motion-reveal">
          <div className="kicker">What your agent gets</div>
          <h2 className="display-h2">This site is an MCP server.</h2>
          <p className="mt-3 max-w-xl text-[color:var(--color-muted)]">
            Reading about agentic income is research. Querying it is leverage.
          </p>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MCP_TOOLS.map((tool) => (
            <div key={tool.name} className="card motion-reveal">
              <div className="font-mono text-xs font-semibold text-accent">{tool.name}</div>
              <p className="mt-2 text-sm leading-6 text-muted">{tool.desc}</p>
            </div>
          ))}
          <Link href="/mcp" className="card motion-reveal flex flex-col justify-between border-[color:color-mix(in_oklab,var(--color-border)_60%,var(--color-accent)_30%)]">
            <div className="font-mono text-xs font-semibold text-gold">/mcp</div>
            <p className="mt-2 text-sm font-semibold leading-6 text-ink">
              Connect snippets, tool reference, and the free-tools promise.
            </p>
          </Link>
        </div>
      </section>

      <AgentWorkflowProof />

      {/* SECTION 5 — the doctrine */}
      <section className="section-band manifesto-band">
        <p className="manifesto-line">Agents build. <span className="mline-emerald">Humans hold the gate.</span></p>
        <p className="manifesto-line">Every claim dated, costed, sourced.</p>
        <p className="manifesto-line">We sell machinery and education — <span className="mline-cyan">never outcomes.</span></p>
      </section>

      {/* SECTION 6 — products, status-honest from the catalog */}
      <section className="section-band" id="products">
        <div className="section-heading motion-reveal">
          <div className="kicker text-[color:var(--color-gold)]">Products · labeled honestly</div>
          <h2 className="display-h2">The catalog renders from reality.</h2>
          <p className="mt-3 max-w-xl text-[color:var(--color-muted)]">
            Status strings come straight from the product catalog. Nothing says buy until checkout
            actually exists; today the free starter kit is the only live path.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className={`price-card motion-reveal ${product.price_cents === 0 ? '' : 'is-commercial'}`}>
              <div className={`price-tag ${product.price_cents === 0 ? 'free' : ''}`}>{priceLabel(product)}</div>
              <h3 className="font-display text-lg font-bold">{product.name}</h3>
              <div className="price-state">{product.status}</div>
              {product.price_cents === 0 ? (
                <Link href="/delivery/starter-kit" className="cta-secondary mt-2 !min-h-0 !px-4 !py-2 text-sm">
                  Open the starter kit
                </Link>
              ) : (
                <Link href="/offers" className="mt-2 text-sm font-semibold text-muted underline decoration-[color:var(--color-border)] underline-offset-2 hover:text-ink">
                  Read the offer
                </Link>
              )}
            </div>
          ))}
        </div>
        <p className="motion-reveal mt-6 max-w-3xl font-mono text-[0.7rem] leading-relaxed text-[color:var(--color-muted)]">
          NO INCOME PROMISES — we sell machinery and education, never outcomes. Some research links
          are commission links, always disclosed inline.
        </p>
      </section>

      {/* SECTION 7 — network handoff */}
      <section className="conversion-band motion-reveal">
        <div>
          <div className="kicker text-[color:var(--color-accent-2)]">The network</div>
          <h2>Want systems that run without you?</h2>
          <p>
            That discipline lives at agenticpassiveincome.com — including its own MCP server your
            agent can query.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
          <a
            href="https://www.agenticpassiveincome.com"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-secondary"
          >
            agenticpassiveincome.com
          </a>
          <a
            href="https://www.agenticpassiveincome.com/api/mcp"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-secondary"
          >
            Its MCP endpoint
          </a>
        </div>
      </section>
    </>
  )
}

