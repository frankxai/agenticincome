import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from '@/components/ArrowUpRight'
import Image from 'next/image'
import { RevenueScenario } from '@/components/RevenueScenario'
import './revenue-desk.css'
import { AgentWorkflowProof } from '@/components/AgentWorkflowProof'
import { HomeWaitlist } from '@/components/HomeWaitlist'
import { CharacterPlate, type CharacterKind } from '@/components/motion/CharacterPlate'
import { CinematicMotion } from '@/components/motion/CinematicMotion'
import '@/components/motion/cinematic.css'
import '@/components/motion/depth/depth.css'
import { GlassDefs } from '@/components/motion/depth/GlassDefs'
import { verifiedEconomicsPrograms, verifiedRangeLabel } from '@/lib/affiliate'
import incomeModels from '@/data/income-models.json'
import catalog from '@/products/catalog.json'
import { checkoutUrl, getOffer } from '@/lib/offers'
import { catalogRefusal, checkoutRelease, isCheckoutLive, type CatalogProduct } from '@/lib/polar'
import { PACK_MANIFESTS } from '@/lib/pack-manifests'
import mcpManifest from '@/public/.well-known/mcp.json'
import pkg from '@/package.json'

export const metadata: Metadata = {
  title: 'Agentic Income | The revenue desk for AI-enabled offers',
  description:
    'Turn a customer observation into a costed offer and one market test. Keep the evidence and the editable brief, or scope an agent implementation.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Agentic Income | The revenue desk for AI-enabled offers',
    description: 'Price a workflow, model delivery costs and take a decision brief into your next buyer conversation.',
    url: '/',
    images: [{ url: '/brand/revenue-desk-guitarist.webp', width: 1536, height: 1024, alt: 'A porcelain and brass guitarist in an Amsterdam studio.' }],
  },
}

const MCP_TOOLS = [
  { name: 'list_income_models', desc: 'The three revenue delivery routes with customer jobs and deliverables.' },
  { name: 'get_income_model', desc: 'One route in full, including deliverables, scope, and next actions.' },
  { name: 'search_partner_programs', desc: 'The partner registry: rates, cookies, status, disclosed links.' },
  { name: 'get_partner_program', desc: 'Full record with commission note, source URL, verification date.' },
  { name: 'list_products', desc: 'The product catalogue, current purchase status and delivery routes.' },
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
  const checkoutAvailable = (product: Product) => {
    const offer = getOffer(product.id)
    return isCheckoutLive(product.id) || Boolean(offer && checkoutUrl(offer))
  }
  const available = paid.filter(checkoutAvailable)
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
      line: 'Review the current purchase status before offering a paid pack.',
      path: 'products/catalog.json',
      rows: [
        { label: checkoutRelease() === 'sandbox' ? 'test checkout' : 'checkout available', value: available.map(product => product.name).join(' · ') || 'none' },
        { label: 'paid packs without checkout', value: `${paid.length - available.length} of ${paid.length}` },
        { label: 'updatedAt', value: catalog.updatedAt },
      ],
    },
  ]
  const stepCount = String(buildSteps.length).padStart(2, '0')

  return (
    <CinematicMotion>
      <GlassDefs />
      <section className="desk-cover" aria-labelledby="desk-title">
        <div className="desk-cover-bleed">
          <div className="desk-cover-art" aria-hidden="true">
            <Image src="/brand/revenue-desk-guitarist.webp" alt="" fill preload sizes="(max-width: 700px) 100vw, 73vw" unoptimized />
          </div>
        </div>
        <div className="desk-cover-copy">
          <p className="desk-eyebrow"><span aria-hidden="true" /> The revenue desk</p>
          <h1 id="desk-title">What is one<br /><em>sale worth?</em></h1>
          <p className="desk-cover-lede">Price an AI-enabled offer against the work it takes to deliver. Take the evidence, the margin and a buyer test into your next conversation.</p>
          <div className="desk-actions">
            <Link href="/workbench/offer-brief" className="desk-primary">Open the workbench <ArrowUpRight /></Link>
            <a href="#unit-economics" className="desk-text-action">Test the economics <span aria-hidden="true">↓</span></a>
          </div>
        </div>
      </section>
      <div className="desk-strip">
        <p>Published by <a href="https://www.frankx.ai/frank-riemer">Frank Riemer</a></p>
        <Link href="/blog">Research journal <ArrowUpRight /></Link>
        <Link href="/mcp">Connect an agent <ArrowUpRight /></Link>
      </div>

      <RevenueScenario />

      <article className="desk-feature" aria-labelledby="desk-feature-title">
        <div className="desk-feature-art">
          <Image src="/brand/revenue-desk-listening-room.webp" width={1536} height={1024} sizes="(max-width: 700px) 100vw, 52vw" unoptimized alt="Two mechanical musicians at a mahogany mixing desk beneath an orbital glass window." />
        </div>
        <div className="desk-feature-copy">
          <p className="desk-eyebrow"><span aria-hidden="true" /> Field research</p>
          <h2 id="desk-feature-title">Inside a quote-review pilot.</h2>
          <p>Follow a worked example from a buyer’s request to a priced review. Inspect the assumptions and download the brief to run your own test.</p>
          <Link className="desk-inline-link" href="/blog/quote-review-pilot">Read the field note <ArrowUpRight /></Link>
        </div>
      </article>

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

      {/* Demand capture: one waitlist block after the proof, closed unless the store is configured */}
      <HomeWaitlist />

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
            Connect your assistant to inspect offers, partner terms and the data behind a revenue model.
          </p>
        </div>
        <div className="cine-inspector mt-8" data-cine-reveal>
          <div className="cine-inspector-bar">
            <span>/api/mcp</span>
            <span>{MCP_TOOLS.length} of {mcpManifest.tools.length} tools</span>
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
          <div className="kicker text-[color:var(--color-gold)]">Products</div>
          <h2 className="display-h2">Choose a field guide or toolkit.</h2>
          <p className="mt-3 max-w-xl text-[color:var(--color-muted)]">
            Download the free starter kit or inspect a paid pack’s contents and checkout availability.
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
              const catalogAdmitsSale = catalogRefusal(product) === null
              const availableForPurchase = checkoutAvailable(product)
              const accessLabel = isFree
                ? 'Free download'
                : availableForPurchase
                  ? checkoutRelease() === 'sandbox' ? 'Test checkout' : 'Checkout available'
                  : catalogAdmitsSale || WAITLIST_PRODUCT_IDS.has(product.id)
                    ? 'Preview · checkout closed'
                    : 'Preview only'
              return (
                <li key={product.id} className={`cine-row cine-row-product ${isFree ? '' : 'is-commercial'}`}>
                  <span className="cine-row-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="font-display text-lg font-bold">{product.name}</h3>
                    <div className="price-state">
                      {accessLabel}
                    </div>
                  </div>
                  <div className="cine-row-price">
                    {isFree || catalogAdmitsSale ? (
                      <div className={`price-tag ${isFree ? 'free' : ''}`}>{priceLabel(product)}</div>
                    ) : null}
                  </div>
                  <div className="cine-row-action">
                    {isFree ? (
                      <Link href="/delivery/starter-kit" className="cta-secondary !px-4 !py-2 text-sm">
                        Open the starter kit
                      </Link>
                    ) : availableForPurchase ? (
                      <Link href={`/offers/${product.id}`} className="cine-row-link">
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
        <div className="cine-bleed cine-bleed-close" aria-hidden="true" />
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
