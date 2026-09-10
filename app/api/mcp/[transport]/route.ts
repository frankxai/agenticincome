import { readFileSync } from 'node:fs'
import path from 'node:path'
import { createMcpHandler } from 'mcp-handler'
import { z } from 'zod'
import incomeModels from '@/data/income-models.json'
import programsData from '@/data/programs.json'
import { site } from '@/lib/site'
import { fitCheck, AUTOMATION_POINTER } from '@/lib/fit-check'
import { programSlug, type Program } from '@/lib/affiliate'
import { catalogRefusal, isPolarConfigured, type CatalogProduct } from '@/lib/polar'
import catalog from '@/products/catalog.json'
import { freePlaybookSlugs, getFreePlaybook } from '@/lib/free-playbooks'

export const maxDuration = 60

const AFFILIATE_DISCLOSURE =
  'Links marked ourLink are affiliate links; Agentic Income may earn a commission.'

const PROGRAMS = programsData.programs as Program[]
const MODELS = incomeModels.models

const KNOWLEDGE_SLUGS = [
  '00-INDEX',
  '01-landscape',
  '02-income-models',
  '03-agent-fulfillment',
  '04-tool-stack',
  '05-honest-marketing',
  '06-cases',
  '07-field-dossier',
] as const

function json(data: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] }
}

function priceLabel(product: CatalogProduct): string {
  if (product.price_cents === 0) return 'Free'
  const dollars = `$${(product.price_cents / 100).toFixed(0)}`
  return product.interval ? `${dollars}/${product.interval}` : dollars
}

function isRecurring(p: Program): boolean {
  const r = (p.recurring ?? '').toLowerCase()
  return r !== '' && r !== 'one-time' && r !== 'n/c' && !r.startsWith('one-time')
}

function publicProgram(p: Program) {
  return {
    slug: programSlug(p),
    name: p.tool,
    category: p.category,
    commission: p.commission ?? null,
    cookieDays: p.cookieDays ?? null,
    status: p.status ?? 'active',
    ...(p.status === 'active' && p.ourLink ? { ourLink: p.ourLink } : {}),
  }
}

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      'list_income_models',
      { description: 'The three operator income models — services, products, systems — with honest economics.' },
      async () => json({ updatedAt: incomeModels.updatedAt, models: MODELS }),
    )

    server.registerTool(
      'get_income_model',
      {
        description: 'One income model in full, including which playbook to read first.',
        inputSchema: { id: z.enum(['services', 'products', 'systems']) },
      },
      async ({ id }) => {
        const model = MODELS.find((m) => m.id === id)
        if (!model) return json({ error: `Unknown model: ${id}` })
        return json(model)
      },
    )

    server.registerTool(
      'search_partner_programs',
      {
        description:
          'Search the verified AI-tool partner program registry. Filter by category or recurring-only.',
        inputSchema: {
          category: z.string().optional().describe('e.g. video, writing, image, llm, creator-stack'),
          recurringOnly: z.boolean().optional().describe('Only programs whose payout recurs'),
        },
      },
      async ({ category, recurringOnly }) => {
        let results = PROGRAMS.filter(
          (p) => p.hasProgram && p.status !== 'dead-end' && p.status !== 'closed',
        )
        if (category) {
          const c = category.trim().toLowerCase()
          results = results.filter((p) => p.category.toLowerCase() === c)
        }
        if (recurringOnly) results = results.filter(isRecurring)
        return json({
          disclosure: AFFILIATE_DISCLOSURE,
          updatedAt: programsData.updatedAt,
          count: results.length,
          programs: results.map(publicProgram),
        })
      },
    )

    server.registerTool(
      'get_partner_program',
      {
        description:
          'Full record for one partner program by slug, including commission note, source URL, and verification date.',
        inputSchema: { slug: z.string().describe('e.g. systeme-io, elevenlabs, heygen') },
      },
      async ({ slug }) => {
        const p = PROGRAMS.find((prog) => programSlug(prog) === slug.trim().toLowerCase())
        if (!p) return json({ error: `Unknown program slug: ${slug}` })
        return json({
          disclosure: AFFILIATE_DISCLOSURE,
          ...publicProgram(p),
          recurring: p.recurring ?? null,
          network: p.network ?? null,
          commissionNote: p.commissionNote ?? null,
          sourceUrl: p.commissionSourceUrl ?? p.signupUrl ?? null,
          verifiedAt: p.commissionVerifiedAt ?? p.verifiedAt ?? null,
          note: p.note ?? null,
        })
      },
    )

    server.registerTool(
      'list_products',
      {
        description:
          'The product catalog with honest availability. purchasable=false means checkout is not live yet.',
      },
      async () =>
        json({
          products: (catalog.products as CatalogProduct[]).map((product) => ({
            id: product.id,
            name: product.name,
            price: priceLabel(product),
            status: product.status,
            purchasable:
              catalogRefusal(product) === null && isPolarConfigured(product.id),
            url: `${site.url}${product.delivery.path}`,
          })),
        }),
    )

    server.registerTool(
      'fit_check',
      {
        description:
          'Deterministic recommendation: which income model fits your hours, budget, audience, and code skills.',
        inputSchema: {
          hoursPerWeek: z.number().min(0).max(168),
          upfrontBudgetUsd: z.number().min(0),
          hasAudience: z.boolean(),
          canCode: z.boolean(),
        },
      },
      async (input) => {
        const result = fitCheck(input)
        return {
          content: [
            { type: 'text' as const, text: JSON.stringify(result, null, 2) },
            { type: 'text' as const, text: AUTOMATION_POINTER },
          ],
        }
      },
    )

    server.registerTool(
      'get_playbook',
      {
        description:
          "Free playbooks: 'starter-kit' or 'hr-agency-sample'. Knowledge slugs (e.g. '02-income-models') return dated summaries. Paid product files are not exposed.",
        inputSchema: { slug: z.string() },
      },
      async ({ slug }) => {
        const clean = slug.trim().toLowerCase()
        const freePlaybook = getFreePlaybook(clean)
        if (freePlaybook) return json(freePlaybook)
        const known = KNOWLEDGE_SLUGS.find((s) => s.toLowerCase() === clean)
        if (!known) {
          return json({
            error: `Unknown playbook slug: ${slug}`,
            available: [...freePlaybookSlugs, ...KNOWLEDGE_SLUGS],
          })
        }
        const full = readFileSync(path.join(process.cwd(), 'knowledge', `${known}.md`), 'utf8')
        const truncated = full.length > 2400
        return json({
          slug: known,
          format: 'markdown',
          summary: truncated ? `${full.slice(0, 2400)}\n\n[…truncated summary — full track ships with the free pack]` : full,
        })
      },
    )
  },
  {
    serverInfo: { name: 'agentic-income', version: '1.0.0' },
  },
  {
    basePath: '/api',
    maxDuration: 60,
    verboseLogs: false,
    disableSse: true,
  },
)

export { handler as GET, handler as POST }
