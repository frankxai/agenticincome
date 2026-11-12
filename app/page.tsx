import type { Metadata } from 'next'
import Link from 'next/link'
import { AgentWorkflowProof } from '@/components/AgentWorkflowProof'
import { CharacterPlate, type CharacterKind } from '@/components/motion/CharacterPlate'
import { CinematicMotion } from '@/components/motion/CinematicMotion'
import '@/components/motion/cinematic.css'
import { verifiedEconomicsPrograms, verifiedRangeLabel } from '@/lib/affiliate'
import incomeModels from '@/data/income-models.json'
import catalog from '@/products/catalog.json'
import { catalogRefusal, type CatalogProduct } from '@/lib/polar'
import { PACK_MANIFESTS } from '@/lib/pack-manifests'
import pkg from '@/package.json'

export const metadata: Metadata = {
  title: 'Agent-as-a-Service implementation and digital products',
  description:
    'Agent implementation sprints and digital packs, scoped first. Clear scope, inspectable deliverables, and human-gated authority — no income promises.',
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

type Product = CatalogProduct

// Only these products have a waitlist today (lib/offers.ts, components/ProductLadder.tsx); the rest are simply not on sale yet.
const WAITLIST_PRODUCT_IDS = new Set(['agent-team-pro', 'private-intel'])

function priceLabel(p: Product): string {
  if (p.price_cents === 0) return 'Free'
  const dollars = `$${(p.price_cents / 100).toFixed(0)}`
  return p.interval ? `${dollars}/${p.interval}` : dollars
}

type BuildStep = {
  kind: CharacterKind
  name: string
  line: string
  /** A file that exists in this repository. Cited, read at build time, never linked. */
  path: string
  rows: Array<{ label: string; value: string }>
}

const SOURCE_DATE = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
const formatDate = (iso: string) => SOURCE_DATE.format(new Date(`${iso}T00:00:00Z`))

function sourceHost(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

function ChapterMark({ index, label }: { index: string; label: string }) {
  return (
    <div className="cine-mark" aria-hidden="true">
      <span>{index}</span>
      <span>{label}</span>
    </div>
  )
}

export default function Home() {
  const models = incomeModels.models
  const verified = verifiedEconomicsPrograms()
  const products = catalog.products as Product[]

  // Every value in the build path is read from a repository file at build time.
  const paid = products.filter((product) => product.price_cents > 0)
  const permitted = paid.filter((product) => catalogRefusal(product) === null)
  const starterFile = PACK_MANIFESTS['starter-kit']?.files[0]
  const buildSteps: BuildStep[] = [
    {
      kind: 'auditor',
      name: 'Audit',
      line: 'Read what exists before proposing a change.',
      path: 'scripts/audit-affiliate.mjs',
      rows: [
        { label: 'run', value: 'pnpm run audit:affiliate' },
        { label: 'script', value: pkg.scripts['audit:affiliate'] },
      ],
    },
    {
      kind: 'architect',
      name: 'Architect',
      line: 'Pick one delivery route and write its boundary down.',
      path: 'data/income-models.json',
      rows: [
        { label: 'routes', value: models.map((model) => model.id).join(' · ') },
        { label: 'updatedAt', value: incomeModels.updatedAt },
      ],
    },
    {
      kind: 'implementer',
      name: 'Implement',
      line: 'Ship deliverables as files with sizes anyone can check.',
      path: 'lib/pack-manifests.ts',
      rows: starterFile
        ? [
            { label: 'file', value: starterFile.path },
            { label: 'size', value: `${starterFile.bytes} bytes · ${starterFile.totalLines} lines` },
          ]
        : [],
    },
    {
      kind: 'verifier',
      name: 'Verify',
      line: 'Run every check before anyone is asked to trust the result.',
      path: 'package.json',
      rows: [
        { label: 'run', value: 'pnpm run merge:gate' },
        { label: 'script', value: pkg.scripts['merge:gate'] },
      ],
    },
    {
      kind: 'human',
      name: 'Human gate',
      line: 'Checkout stays closed until a person changes the catalog status.',
      path: 'products/catalog.json',
      rows: [
        { label: 'catalog permits sale', value: permitted.length ? permitted.map((product) => product.name).join(' · ') : 'none' },
        { label: 'catalog refuses checkout', value: `${paid.length - permitted.length} of ${paid.length} paid products` },
        { label: 'updatedAt', value: catalog.updatedAt },
      ],
    },
  ]
  const stepCount = String(buildSteps.length).padStart(2, '0')

  return (
    <CinematicMotion>
      {/* SCENE 1 — opening stage: the literal offer plus real MCP output, staged on its sources */}
      <section className="cine-opening" data-scene="opening">
        <div className="cine-bleed" aria-hidden="true" />
        <div className="cine-opening-grid">
          <div>
            <div className="kicker">Agentic Income — Agent-as-a-Service Engine</div>
            <h1 className="assembly-title">
              Scoped agent builds with <span>human approval gates</span>
            </h1>
            <p className="assembly-sub">
              Productized implementation sprints, digital products and open reference systems.
              Scoped deliverables, inspectable code and partner rates dated to their source. No
              income promises.
            </p>
            <div className="assembly-actions">
              <Link href="/offers/implementation-sprint" className="cta">View the implementation sprint</Link>
              <Link href="/start" className="cta-secondary">Start free</Link>
            </div>
          </div>

          <div className="cine-object" data-cine="object">
            {/* The files the endpoint answers from (app/api/mcp imports all three). Decoration; the terminal carries the content. */}
            <div className="cine-sheet cine-sheet-3" data-cine="sheet" aria-hidden="true"><span>products/catalog.json</span></div>
            <div className="cine-sheet cine-sheet-2" data-cine="sheet" aria-hidden="true"><span>data/programs.json</span></div>
            <div className="cine-sheet cine-sheet-1" data-cine="sheet" aria-hidden="true"><span>data/income-models.json</span></div>
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
                <div className="t-cmd mt-3" data-cine="type">fit_check hours=10 budget=200 audience=no code=yes</div>
                <div className="t-out" data-cine="resolve">{'{'} &quot;model&quot;: &quot;services&quot;,</div>
                <div className="t-out" data-cine="resolve">  &quot;why&quot;: &quot;10 focused hours and working code</div>
                <div className="t-out" data-cine="resolve">    skills price you into agent-assisted</div>
                <div className="t-out" data-cine="resolve">    delivery work first.&quot;,</div>
                <div className="t-out" data-cine="resolve">  &quot;read&quot;: &quot;/start&quot; {'}'}<span className="t-caret ml-2" /></div>
              </div>
            </div>
          </div>
        </div>
        <div className="cine-opening-foot" aria-hidden="true">
          <span>01</span>
          <span>opening</span>
          <i />
          <span>scroll to run the tool call</span>
        </div>
      </section>

      {/* SCENE 2 — the build path: a technical spine, one step and one repository artifact at a time */}
      <section className="section-band cine-chapter" data-scene="build-path" aria-labelledby="build-path-title">
        <div className="cine-pin" data-cine="pin">
          <ChapterMark index="02" label="build path" />
          <div className="cine-spine">
            <div className="cine-spine-head">
              <div className="kicker">The build path</div>
              <h2 id="build-path-title" className="display-h2">Audit, architect, implement, verify. Then a person approves.</h2>
              <ol className="cine-rail" aria-hidden="true">
                <li className="cine-rail-progress" data-cine="rail-progress" />
                {buildSteps.map((step, index) => (
                  <li key={step.kind} className="cine-rail-node" data-cine="rail-node">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    {step.name}
                  </li>
                ))}
              </ol>
            </div>
            <ol className="cine-steps">
              {buildSteps.map((step, index) => (
                <li key={step.kind} className="cine-step" data-cine="step">
                  <CharacterPlate kind={step.kind} index={String(index + 1).padStart(2, '0')} />
                  <div className="cine-step-body">
                    <div className="cine-step-count">{String(index + 1).padStart(2, '0')} / {stepCount}</div>
                    <h3>{step.name}</h3>
                    <p>{step.line}</p>
                    {step.rows.length ? (
                      <div className="cine-artifact" translate="no">
                        <div className="cine-artifact-path">{step.path}</div>
                        <dl>
                          {step.rows.map((row) => (
                            <div key={row.label}>
                              <dt>{row.label}</dt>
                              <dd>{row.value}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <AgentWorkflowProof />

      {/* SCENE 3 — the three service & delivery routes, a stacking deck */}
      <section className="section-band cine-chapter" data-scene="routes">
        <div className="cine-pin" data-cine="pin">
          <ChapterMark index="03" label="delivery routes" />
          <div className="section-heading" data-cine-reveal>
            <div className="kicker">Revenue Engine · Customer-Facing Routes</div>
            <h2 className="display-h2">Three delivery routes for customer value.</h2>
          </div>
          <div className="cine-deck">
            {models.map((model, index) => (
              <div key={model.id} className="cine-route" data-cine="card">
                <div className="cine-route-main">
                  <div className="cine-route-meta">
                    <span className="path-stage">{model.id}</span>
                    <span className="cine-route-count">{String(index + 1).padStart(2, '0')} / {String(models.length).padStart(2, '0')}</span>
                  </div>
                  <h3>{model.name}</h3>
                  <p>{model.summary}</p>
                </div>
                <dl className="cine-route-fields">
                  <div>
                    <dt>Execution:</dt>
                    <dd>{model.laborProfile}</dd>
                  </div>
                  <div>
                    <dt>Timeframe:</dt>
                    <dd>{model.timeToFirstDollar}</dd>
                  </div>
                  <div className="is-boundary">
                    <dt>Risk boundary:</dt>
                    <dd>{model.failureMode}</dd>
                  </div>
                </dl>
                <div className="cine-route-source" translate="no">data/income-models.json · updated {formatDate(incomeModels.updatedAt)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCENE 4 — partner economics board */}
      <section className="section-band cine-chapter" data-scene="partners">
        <ChapterMark index="04" label="partner economics" />
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="section-heading" data-cine-reveal>
            <div className="kicker text-[color:var(--color-gold)]">The partner economics board</div>
            <h2 className="display-h2">We publish the rates and when we checked them.</h2>
          </div>
          <Link href="/tools" className="cta-secondary">Full catalog</Link>
        </div>
        <div className="cine-board mt-8">
          <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Partner economics comparison">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="text-left text-muted">
                  <th scope="col" className="px-5 py-4 font-medium">Program</th>
                  <th scope="col" className="px-5 py-4 font-medium">Commission</th>
                  <th scope="col" className="px-5 py-4 font-medium">Cookie window</th>
                  <th scope="col" className="px-5 py-4 font-medium">Status</th>
                  <th scope="col" className="px-5 py-4 font-medium">Verified</th>
                </tr>
              </thead>
              <tbody>
                {verified.map((program) => {
                  const host = program.commissionSourceUrl ? sourceHost(program.commissionSourceUrl) : null
                  return (
                    <tr key={program.tool}>
                      <td className="px-5 py-4 font-semibold text-ink">{program.tool}</td>
                      <td className="px-5 py-4 text-ink">
                        <span className="cine-rate">
                          {program.commission}
                          {program.commissionVerifiedAt ? <i data-cine="sweep" aria-hidden="true" /> : null}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-muted">{program.cookieDays ? `${program.cookieDays} days` : 'not published'}</td>
                      <td className="px-5 py-4 text-muted">{program.status}</td>
                      <td className="px-5 py-2 cine-verified">
                        {program.commissionVerifiedAt ? <time dateTime={program.commissionVerifiedAt}>{formatDate(program.commissionVerifiedAt)}</time> : null}
                        {program.commissionSourceUrl && host ? (
                          <a
                            href={program.commissionSourceUrl}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            aria-label={`${program.tool} program terms on ${host} (source, not an affiliate link)`}
                          >
                            {host}
                          </a>
                        ) : null}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-4 text-xs leading-6 text-muted">
          Affiliate links disclosed. Rates verified {verifiedRangeLabel(verified)} against each program&apos;s own terms.
        </p>
      </section>

      {/* SCENE 5a — the MCP server, staged as an inspector */}
      <section className="section-band cine-chapter" data-scene="mcp">
        <ChapterMark index="05" label="what your agent can query" />
        <div className="section-heading" data-cine-reveal>
          <div className="kicker">What your agent gets</div>
          <h2 className="display-h2">This site is an MCP server.</h2>
          <p className="mt-3 max-w-xl text-[color:var(--color-muted)]">
            Reading about agentic income is research. Querying it is leverage.
          </p>
        </div>
        <div className="cine-inspector mt-8" data-cine-reveal>
          <div className="cine-inspector-bar">
            <span>/api/mcp</span>
            <span>{MCP_TOOLS.length} tools</span>
          </div>
          <ol className="cine-rows" data-cine="inspector">
            {MCP_TOOLS.map((tool, index) => (
              <li key={tool.name} className="cine-row cine-row-tool">
                <span className="cine-row-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <div className="cine-row-name font-mono" translate="no">{tool.name}</div>
                <p className="cine-row-desc">{tool.desc}</p>
              </li>
            ))}
          </ol>
          <Link href="/mcp" className="cine-inspector-link">
            <span className="font-mono text-xs font-semibold text-gold">/mcp</span>
            <span>Connect snippets, tool reference, and the free-tools promise.</span>
          </Link>
        </div>
      </section>

      {/* the doctrine */}
      <section className="section-band manifesto-band cine-doctrine">
        <p className="manifesto-line" data-cine-reveal>Agents build. <span className="mline-emerald">Humans hold the gate.</span></p>
        <p className="manifesto-line" data-cine-reveal>Partner rates dated and sourced.</p>
        <p className="manifesto-line" data-cine-reveal>We sell machinery and education — <span className="mline-cyan">never outcomes.</span></p>
      </section>

      {/* SCENE 5b — products, status-honest from the catalog, staged as an inspector */}
      <section className="section-band cine-chapter" id="products" data-scene="catalog">
        <ChapterMark index="06" label="catalog" />
        <div className="section-heading" data-cine-reveal>
          <div className="kicker text-[color:var(--color-gold)]">Products · labeled honestly</div>
          <h2 className="display-h2">The catalog renders from reality.</h2>
          <p className="mt-3 max-w-xl text-[color:var(--color-muted)]">
            Availability follows the product catalog. Nothing says buy until checkout
            actually exists; today the free starter kit is the only live path. Paid prices and
            offer links appear only on products the catalog marks for sale.
          </p>
        </div>
        <div className="cine-inspector mt-8" data-cine-reveal>
          <div className="cine-inspector-bar">
            <span>products/catalog.json</span>
            <span>{products.length} products · updated {formatDate(catalog.updatedAt)}</span>
          </div>
          <ol className="cine-rows" data-cine="inspector">
            {products.map((product, index) => {
              const isFree = product.price_cents === 0
              // Same gate lib/polar.ts applies to checkout: no price or offer link on a product that cannot be sold.
              const isForSale = !isFree && catalogRefusal(product) === null
              return (
                <li key={product.id} className={`cine-row cine-row-product ${isFree ? '' : 'is-commercial'}`}>
                  <span className="cine-row-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="font-display text-lg font-bold">{product.name}</h3>
                    <div className="price-state">
                      {isFree || isForSale
                        ? product.status
                        : WAITLIST_PRODUCT_IDS.has(product.id)
                          ? 'Waitlist · not yet on sale'
                          : 'Not yet on sale'}
                    </div>
                  </div>
                  <div className="cine-row-price">
                    {isFree || isForSale ? (
                      <div className={`price-tag ${isFree ? 'free' : ''}`}>{priceLabel(product)}</div>
                    ) : null}
                  </div>
                  <div className="cine-row-action">
                    {isFree ? (
                      <Link href="/delivery/starter-kit" className="cta-secondary !px-4 !py-2 text-sm">
                        Open the starter kit
                      </Link>
                    ) : isForSale ? (
                      <Link href="/offers" className="cine-row-link">
                        Read the offer
                      </Link>
                    ) : (
                      <Link href={`/offers/${product.id}`} aria-label={`Inspect scope of ${product.name}`} className="cine-row-link">
                        Inspect scope
                      </Link>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
        <p className="mt-6 max-w-3xl font-mono text-[0.7rem] leading-relaxed text-[color:var(--color-muted)]" data-cine-reveal>
          NO INCOME PROMISES — we sell machinery and education, never outcomes. Some research links
          are commission links, always disclosed inline.
        </p>
      </section>

      {/* SCENE 6 — close: one calm frame with the next-step actions and the network handoff */}
      <section className="cine-close" data-scene="close" aria-labelledby="close-title">
        <ChapterMark index="07" label="next step" />
        <div className="cine-close-actions" data-cine-reveal>
          <h2 id="close-title" className="kicker">Next step</h2>
          <div className="assembly-actions">
            <Link href="/offers/implementation-sprint" className="cta">View the implementation sprint</Link>
            <Link href="/start" className="cta-secondary">Start free</Link>
          </div>
        </div>
        <div className="conversion-band" data-cine-reveal>
          <div>
            <div className="kicker text-[color:var(--color-accent-2)]">The network</div>
            <h2>Continue at agenticpassiveincome.com</h2>
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
              href="https://www.agenticpassiveincome.com/mcp"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-secondary"
            >
              Its MCP endpoint
            </a>
          </div>
        </div>
      </section>
    </CinematicMotion>
  )
}
