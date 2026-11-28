// Keep the browser and external MCP clients on the very same registered tools.
// Dispatch the HTTP Request in-process; preview protection and network routing don't apply.
import { POST as transport } from '../../app/api/mcp/[transport]/route.ts'

export const toolLabels = {
  minimum_offer_price: 'Calculate the price floor for your target margin',
  list_supply_costs: 'Inspect sourced infrastructure costs',
  search_digital_economies: 'Look up sourced market economics',
  draft_income_graph: 'Identify what the offer still needs to prove',
  export_income_system_tasks: 'Export the experiment checklist',
  draft_offer_experiment: 'Calculate contribution from your assumptions',
  search_partner_programs: 'Search the partner research catalog',
  get_partner_program: 'Read the dated partner terms',
  list_products: 'Read the product catalog',
} as const
export type Tool = keyof typeof toolLabels

export async function callTool(name: Tool, args: Record<string, unknown>, signal: AbortSignal): Promise<unknown> {
  const req = new Request('http://localhost/api/mcp', {
    method: 'POST', signal, headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }),
  })
  const response = await transport(req)
  if (!response.ok || !response.body) throw Error('MCP unavailable')
  const stream = response.headers.get('content-type')?.includes('text/event-stream')
  const reader = response.body.getReader()
  const stop = () => { void reader.cancel().catch(() => {}) }
  signal.addEventListener('abort', stop, { once: true })
  try {
    let bytes = 0, buffer = ''
    const decoder = new TextDecoder()
    for (;;) {
      signal.throwIfAborted()
      const { value, done } = await reader.read()
      if (value) { bytes += value.byteLength; buffer += decoder.decode(value, { stream: true }) }
      if (bytes > 256_000) throw Error('MCP result too large')
      const json = stream ? buffer.match(/^data:\s*([^\r\n]+)\r?\n/m)?.[1] : done ? buffer : null
      if (json) {
        const rpc = JSON.parse(json)
        if (rpc.id !== 1 || rpc.error || rpc.result?.isError || !rpc.result) throw Error('MCP tool failed')
        return rpc.result.structuredContent ?? JSON.parse(rpc.result.content[0].text)
      }
      if (done) throw Error('Incomplete MCP response')
    }
  } finally {
    signal.removeEventListener('abort', stop)
    await reader.cancel().catch(() => {})
  }
}
