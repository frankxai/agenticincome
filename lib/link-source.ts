/**
 * Marks which of our surfaces sent a partner click, for exp-001 (vault/experiments.json):
 * agent traffic from the MCP server versus reader traffic from site pages.
 * A fixed two-value enum about our surface; it says nothing about the visitor.
 */
export type LinkSource = 'mcp' | 'page'

export const ROUTER_HOST = 'go.agenticincome.ai'

/** Adds `src` to a go.agenticincome.ai link; any other URL, or text that is not a URL, comes back unchanged. */
export function withSource(link: string, src: LinkSource): string {
  let url: URL
  try {
    url = new URL(link)
  } catch {
    return link
  }
  if (url.hostname !== ROUTER_HOST) return link
  url.searchParams.set('src', src)
  return url.toString()
}
