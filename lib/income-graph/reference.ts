import { draftIncomeGraph } from './draft.ts'
import type { IncomeGraph } from './model.ts'

/** Creates an educational scenario. Its review window is relative to the reader's copy. */
export function createReferenceIncomeGraph(today: string): IncomeGraph {
  const thesis = 'Hypothesis: offer a written scope brief for renovation firms. The buyer might pay per brief.'
  const { graph } = draftIncomeGraph(thesis, { today, principal: 'Example owner' })
  graph.metadata.id = 'request-to-quote-desk'
  graph.metadata.name = 'Illustrative request-to-quote desk'
  const provenance = {
    source: 'example:request-to-quote-desk',
    method: 'Fictional planning example. Effort and review dates are sample assumptions. No customer evidence is included.',
    date: today,
  }
  for (const item of [...graph.nodes, ...graph.edges]) item.provenance = provenance
  return graph
}
