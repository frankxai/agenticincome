import type { Metadata } from 'next'
import Link from 'next/link'
import { McpPlayground } from '@/components/McpPlayground'

export const metadata: Metadata = {
  title: 'MCP Server',
  description:
    'agenticincome.ai is an MCP server. Connect Claude Code, Claude Desktop, or any streamable-HTTP client and query income models, partner economics, products, and playbooks directly.',
  alternates: { canonical: '/mcp' },
  openGraph: { url: '/mcp' },
}

const ENDPOINT = 'https://www.agenticincome.ai/api/mcp'

const TOOLS = [
  {
    name: 'list_income_models',
    args: '—',
    returns: 'The three operator income models with honest economics: time-to-first-dollar, labor profile, failure mode.',
  },
  {
    name: 'get_income_model',
    args: '{ id: "services" | "products" | "systems" }',
    returns: 'One model in full, including which playbook to read first.',
  },
  {
    name: 'search_partner_programs',
    args: '{ category?, recurringOnly? }',
    returns: 'The partner-program registry: slug, commission, cookie window, status, tracked link where one exists. Affiliate links are disclosed in the response.',
  },
  {
    name: 'get_partner_program',
    args: '{ slug }',
    returns: 'Full record for one program: commission note, source URL, verification date.',
  },
  {
    name: 'list_products',
    args: '—',
    returns: 'The product catalog with honest availability. purchasable is false until checkout is actually live.',
  },
  {
    name: 'fit_check',
    args: '{ hoursPerWeek, upfrontBudgetUsd, hasAudience, canCode }',
    returns: 'Deterministic recommendation of one income model, why, and what to read first.',
  },
  {
    name: 'get_playbook',
    args: '{ slug }',
    returns: 'The free starter kit in full markdown (slug "starter-kit") or dated knowledge-track summaries (e.g. "02-income-models").',
  },
  {
    name: 'describe_income_graph_schema',
    args: '—',
    returns: 'The IncomeGraph.v1.1 vocabulary: 18 node types, the legal edges between them, the fields every node and edge must carry, and the rules that surprise drafters, including when a chain is refused.',
  },
  {
    name: 'draft_income_graph',
    args: '{ thesis, today, principal? }',
    returns:
      'Start here. A plain-text thesis becomes the smallest well-formed graph, led by the claims in it that nothing supports, what evidence would settle each one, and what that costs in founder hours. Invents nothing; every assumption is returned.',
  },
  {
    name: 'get_reference_income_graph',
    args: '—',
    returns: 'The worked request-to-quote graph. A live thesis with costs and no revenue yet — the shape to copy, not a success story.',
  },
  {
    name: 'review_income_graph',
    args: '{ graph, today }',
    returns: 'Findings, activation verdict, one settlement verdict per offer, and cost and founder-hour arithmetic. Adversarial checks plus the rail: merchant account, signed receipt, a narrow on-chain right, or refuse.',
  },
  {
    name: 'draft_income_system_manifest',
    args: '{ graph }',
    returns: 'A draft IncomeSystem.v1 manifest plus every required field the graph cannot know. The open-core validator remains the gate.',
  },
  {
    name: 'export_income_system_tasks',
    args: '{ graph }',
    returns: 'Installable operating tasks: workflow steps with their human gates, maintenance cadences, kill-review dates, experiment decisions.',
  },
]

const DESKTOP_CONFIG = `{
  "mcpServers": {
    "agentic-income": {
      "type": "http",
      "url": "${ENDPOINT}"
    }
  }
}`

export default function McpPage() {
  return (
    <div className="py-16">
      <div className="max-w-3xl">
        <div className="kicker">Agent interface · streamable HTTP</div>
        <h1 className="mt-3 text-5xl font-semibold leading-tight text-ink">This site is an MCP server.</h1>
        <p className="mt-4 text-lg leading-8 text-muted">
          Everything the site teaches, your agent can query: income models with honest economics,
          the verified partner-program registry, the product catalog with real availability, a
          deterministic fit check, and the playbooks. No account, no key, no scraping.
        </p>
      </div>

      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="display-h2">Connect</h2>
          <p className="mt-3 text-muted">Claude Code — one command:</p>
          <div className="terminal mt-3">
            <div className="terminal-bar">
              <i /><i /><i />
              <span className="ml-2">shell</span>
            </div>
            <div className="terminal-body">
              <div className="t-cmd">claude mcp add --transport http agentic-income \</div>
              <div className="t-out">    {ENDPOINT}</div>
            </div>
          </div>

          <p className="mt-6 text-muted">Claude Desktop — add to your MCP settings:</p>
          <div className="terminal mt-3">
            <div className="terminal-bar">
              <i /><i /><i />
              <span className="ml-2">claude_desktop_config.json</span>
            </div>
            <div className="terminal-body">
              <pre className="t-out whitespace-pre-wrap">{DESKTOP_CONFIG}</pre>
            </div>
          </div>

          <p className="mt-6 text-sm leading-6 text-muted">
            Cursor and any other streamable-HTTP MCP client: point it at{' '}
            <code className="text-ink">{ENDPOINT}</code>. Discovery metadata lives at{' '}
            <code className="text-ink">/.well-known/mcp.json</code>. No SSE-only transport, no auth
            required for the free tools.
          </p>
        </div>

        <div>
          <h2 className="display-h2">The promise</h2>
          <div className="card mt-4">
            <ul className="grid gap-3 text-sm leading-6 text-muted">
              <li>Free tools stay free.</li>
              <li>
                Paid capabilities, if they ever exist, will be announced on the{' '}
                <Link href="/offers" className="text-accent underline underline-offset-2">catalog</Link>{' '}
                — never enabled silently.
              </li>
              <li>Affiliate links in tool responses are disclosed in the response itself.</li>
              <li>No income promises anywhere in the data. Every economic claim carries a source or a date.</li>
            </ul>
          </div>
          <p className="mt-6 text-sm leading-6 text-muted">
            Automation-first models live with our sister site:{' '}
            <a
              href="https://www.agenticpassiveincome.com/api/mcp"
              className="text-accent underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              agenticpassiveincome.com/api/mcp
            </a>{' '}
            is its own MCP server for systems that run without you.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <McpPlayground />
      </section>

      <section className="mt-14">
        <h2 className="display-h2">Tool reference</h2>
        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-surface/80">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted">
                  <th className="px-5 py-4 font-medium">Tool</th>
                  <th className="px-5 py-4 font-medium">Arguments</th>
                  <th className="px-5 py-4 font-medium">Returns</th>
                </tr>
              </thead>
              <tbody>
                {TOOLS.map((tool) => (
                  <tr key={tool.name} className="border-t border-border/70">
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-accent">{tool.name}</td>
                    <td className="px-5 py-4 font-mono text-xs text-muted">{tool.args}</td>
                    <td className="px-5 py-4 leading-6 text-muted">{tool.returns}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link href="/start" className="cta">Start free</Link>
        <Link href="/workbench" className="cta-secondary">Income system workbench</Link>
        <Link href="/tools" className="cta-secondary">Partner economics</Link>
      </div>
    </div>
  )
}
