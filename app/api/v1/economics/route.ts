import { costEvidence, marketEvidence } from '@/lib/public-economics'

/** Public, cacheable GET projection of the same dated evidence returned by MCP. */
export function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const dataset = params.get('dataset')
  const failure = (message: string) => Response.json({ error: message }, {
    status: 400, headers: { 'Cache-Control': 'no-store' },
  })
  if (dataset !== 'markets' && dataset !== 'costs') return failure('Choose dataset=markets or dataset=costs.')
  const allowed = dataset === 'markets' ? ['dataset', 'sector', 'query'] : ['dataset', 'category']
  for (const [key, value] of params) {
    if (!allowed.includes(key) || params.getAll(key).length !== 1 || !value.trim() || value.length > 120) {
      return failure('Use one nonempty value of up to 120 characters for each supported filter.')
    }
  }
  const result = dataset === 'markets'
    ? marketEvidence(params.get('sector')?.trim(), params.get('query')?.trim())
    : costEvidence(params.get('category')?.trim())
  return Response.json(result, {
    headers: { 'Cache-Control': 'public, max-age=300, s-maxage=3600', 'Access-Control-Allow-Origin': '*' },
  })
}
