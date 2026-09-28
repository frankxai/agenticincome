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
import referenceGraph from '@/data/income-graph-request-to-quote.json'
import {
  draftIncomeGraph,
  exportTasks,
  projectToIncomeSystem,
  reviewIncomeGraph,
  tasksToMarkdown,
  CURRENT_API_VERSION,
  EVIDENCE_KINDS,
  NODE_TYPES,
  EDGE_RULES,
  SCHEMA_ID,
  SUPPORTED_API_VERSIONS,
  type IncomeGraph,
} from '@/lib/income-graph'
import { incomeGraphSchema } from '@/lib/income-graph/zod'

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
          "Playbook content by slug: 'starter-kit' returns the full free starter kit; knowledge slugs (e.g. '02-income-models') return dated track summaries.",
        inputSchema: { slug: z.string() },
      },
      async ({ slug }) => {
        const clean = slug.trim().toLowerCase()
        if (clean === 'starter-kit') {
          const text = readFileSync(
            path.join(process.cwd(), 'public', 'downloads', 'agentic-income-starter-kit.md'),
            'utf8',
          )
          return json({ slug: 'starter-kit', format: 'markdown', content: text })
        }
        const known = KNOWLEDGE_SLUGS.find((s) => s.toLowerCase() === clean)
        if (!known) {
          return json({
            error: `Unknown playbook slug: ${slug}`,
            available: ['starter-kit', ...KNOWLEDGE_SLUGS],
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

    server.registerTool(
      'describe_income_graph_schema',
      {
        description:
          'The IncomeGraph.v1 vocabulary: the 18 node types, the legal edges between them, the fields every node and edge must carry, and the settlement rails. Read this before drafting a graph.',
      },
      async () =>
        json({
          schema: SCHEMA_ID,
          apiVersion: CURRENT_API_VERSION,
          acceptedApiVersions: SUPPORTED_API_VERSIONS,
          kind: 'IncomeGraph',
          schemaUrl: `${site.url}/schemas/income-graph.v1.schema.json`,
          nodeTypes: NODE_TYPES,
          edges: EDGE_RULES,
          requiredOnEveryNodeAndEdge: [
            'owner',
            'provenance.source',
            'provenance.date',
            'version',
            'visibility',
            'evaluation',
          ],
          rulesThatSurpriseDrafters: [
            'Every workflow step needs an explicit irreversible boolean. A v1 step without one is migrated to true.',
            'A HumanGate approver must resolve to a Human node or to metadata.principal; an AgentRole is rejected.',
            `Evidence.provenance.source must be an http(s) URL, a file path, or "interview:<name> <YYYY-MM-DD>", and data.kind should be one of: ${EVIDENCE_KINDS.join(', ')}.`,
            'A Customer or Offer carrying a price or a volume assumption needs an evidences edge, and demand language in notes or description needs one too.',
            'An offer that mentions an NFT, a token, a mint, a smart contract, x402, or MPP must set data.settlement.rail. machine-payment is x402 or mpp, in usdc or eurc, per request or session, on base, solana, or tempo, inside a human spend cap, with a facilitator cost. on-chain-right is a license, a royalty split, or resaleable access a stranger enforces after the seller is gone. A collection, a coin, a yield, an agent identity sold as an NFT, or an agent that can mint is refused.',
          ],
          documentContract:
            'The IncomeSystem.v1 manifest contract is owned by github.com/frankxai/agentic-income-skills. This graph drafts it; that repository validates it.',
        }),
    )

    server.registerTool(
      'get_reference_income_graph',
      {
        description:
          'A complete worked IncomeGraph for the request-to-quote desk. Use it as the shape to copy — it is a live thesis with no revenue yet, not a success story.',
      },
      async () => json(referenceGraph),
    )

    server.registerTool(
      'review_income_graph',
      {
        description:
          'Run the workbench over an IncomeGraph: structure, completeness, honest economics, four adversarial checks, and the settlement rail. A chain offer is refused unless it is a right a stranger must enforce after the seller is gone. Returns findings, an activation verdict, one settlement verdict per offer, and cost and founder-hour arithmetic. It never predicts revenue.',
        inputSchema: {
          graph: incomeGraphSchema,
          today: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/)
            .describe('ISO date used for future-dating checks, so results are reproducible.'),
        },
      },
      async ({ graph, today }) => json(reviewIncomeGraph(graph as unknown as IncomeGraph, today)),
    )

    server.registerTool(
      'draft_income_graph',
      {
        description:
          'Start here. Turn a plain-text business thesis into the smallest well-formed IncomeGraph, and lead with the refusal: which claims in the founder’s own sentence nothing supports, what evidence would settle each one, and what that evidence costs in founder hours. Invents no evidence, no revenue, and no buyer — every assumed value is returned in `assumptions`.',
        inputSchema: {
          thesis: z
            .string()
            .min(12)
            .describe('One or two sentences: who has the problem, what you would sell them, and why they would pay.'),
          today: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/)
            .describe('ISO date. Used for provenance and the kill-review date, so the draft is reproducible.'),
          principal: z
            .string()
            .optional()
            .describe('The named person accountable for the system. Becomes the Human node and the gate approver.'),
        },
      },
      async ({ thesis, today, principal }) => {
        const draft = draftIncomeGraph(thesis, { today, principal })
        return json({ ...draft, review: reviewIncomeGraph(draft.graph, today) })
      },
    )

    server.registerTool(
      'draft_income_system_manifest',
      {
        description:
          'Project an IncomeGraph into a draft IncomeSystem.v1 manifest and list every required field the graph cannot know. The draft is not valid until the open-core validator in frankxai/agentic-income-skills passes it.',
        inputSchema: { graph: incomeGraphSchema },
      },
      async ({ graph }) => json(projectToIncomeSystem(graph as IncomeGraph)),
    )

    server.registerTool(
      'export_income_system_tasks',
      {
        description:
          'Export the installable operating tasks for an IncomeGraph — workflow steps with their human gates, maintenance cadences, kill-criterion review dates, and experiment decisions — as JSON and as a markdown checklist.',
        inputSchema: { graph: incomeGraphSchema },
      },
      async ({ graph }) => {
        const typed = graph as IncomeGraph
        const tasks = exportTasks(typed)
        return json({ tasks, markdown: tasksToMarkdown(typed, tasks) })
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
