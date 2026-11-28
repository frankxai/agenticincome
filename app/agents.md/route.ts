export const revalidate = 3600

const AGENTS_MD = `# Agentic Income — Agent Surface Guide (AX)

> Brand: **Agentic Income** (\`https://www.agenticincome.ai\`)
> Author: Frank Riemer
> Scope: Operating system, partner-program registry, economics workbench, and public MCP server for builders of AI-assisted income systems. No income promises.

## Canonical discovery & MCP endpoints

- [\`/llms.txt\`](https://www.agenticincome.ai/llms.txt) — Machine-readable overview of pages, workbench routes, and disclosures.
- [\`/llms-full.txt\`](https://www.agenticincome.ai/llms-full.txt) — Extended public documentation for agents.
- [\`/.well-known/agent.json\`](https://www.agenticincome.ai/.well-known/agent.json) — Agent discovery descriptor linking \`/.well-known/mcp.json\`, \`/api/mcp\`, and \`/api/v1/economics\`.
- [\`/.well-known/mcp.json\`](https://www.agenticincome.ai/.well-known/mcp.json) — Canonical MCP tool manifest listing the 17 registered tools and \`source_to_offer\` prompt.
- [\`/api/mcp\`](https://www.agenticincome.ai/api/mcp) — Streamable HTTP MCP server (\`/mcp\` documents setup and examples).
- [\`/api/v1/economics\`](https://www.agenticincome.ai/api/v1/economics) and [\`/economics.openapi.json\`](https://www.agenticincome.ai/economics.openapi.json) — Public machine-readable economics API and OpenAPI schema.

## Core human & agent workbenches

- [\`/build\`](https://www.agenticincome.ai/build), [\`/operate\`](https://www.agenticincome.ai/operate), [\`/proof\`](https://www.agenticincome.ai/proof) — Inspectable build, operations, and evidence surfaces.
- [\`/workbench/quote-review\`](https://www.agenticincome.ai/workbench/quote-review) and [\`/workbench/offer-brief\`](https://www.agenticincome.ai/workbench/offer-brief) — Interactive thesis, offer, and quote-review workbenches.
- [\`/offers\`](https://www.agenticincome.ai/offers), [\`/start\`](https://www.agenticincome.ai/start), [\`/pack\`](https://www.agenticincome.ai/pack) — Public Starter Kit and checkout-gated product catalog.
- [\`/trust\`](https://www.agenticincome.ai/trust) and [\`/disclosure\`](https://www.agenticincome.ai/disclosure) — Partner-program verification dates, affiliate disclosures, and editorial boundaries.

## Boundaries & honesty rules

1. **No outcome or passive-income guarantees:** Tooling evaluates unit margins, partner terms, and offer structure; results depend on execution and market demand.
2. **Dated partner terms:** Partner commissions carry verification dates and primary source URLs in \`data/programs.json\`.
3. **Explicit affiliate disclosure:** Links marked \`ourLink\` in registry or MCP responses are affiliate links and may earn a commission.
4. **Checkout gate discipline:** Paid items report \`purchasable\` based on the live \`isCheckoutLive\` release gate rather than hardcoded availability.
`

export function GET() {
  return new Response(AGENTS_MD, {
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
