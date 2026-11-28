import { quoteReviewBrief, quoteReviewMarkdown } from '@/lib/quote-review-case'

export const dynamic = 'force-static'
export const dynamicParams = false
export function generateStaticParams() {
  return [{ format: 'brief.json' }, { format: 'case.md' }]
}

export async function GET(_request: Request, context: { params: Promise<{ format: string }> }) {
  const { format } = await context.params
  if (format !== 'brief.json' && format !== 'case.md') return new Response(null, { status: 404 })
  const isJson = format === 'brief.json'
  return new Response(isJson ? JSON.stringify(quoteReviewBrief(), null, 2) : quoteReviewMarkdown(), {
    headers: {
      'Content-Type': (isJson ? 'application/json' : 'text/markdown') + '; charset=utf-8',
      'Content-Disposition': 'attachment; filename="quote-review-' + format + '"',
    },
  })
}
