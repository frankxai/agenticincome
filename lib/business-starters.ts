import { buildOfferBrief, type OfferBriefInput } from './offer-brief.ts'

export const businessStarters = [
  {
    id: 'service', label: 'An AI service', title: 'Turn your expertise into a service.',
    description: 'Package work you understand into a repeatable result for a customer.',
    buyer: 'Independent businesses that need a better onboarding experience',
    offer: 'An AI-assisted onboarding kit with welcome emails, a customer guide and a handover checklist.',
    price: 1500, cost: 900,
    experiment: 'Show one completed sample to three business owners. Ask what they would change and whether they would pay for a scoped pilot.',
    criterion: 'One buyer agrees a written scope, price and acceptance checklist.',
    roles: [
      ['Research', 'Find the customer’s recurring questions and existing onboarding materials.'],
      ['Create', 'Draft the emails, guide and checklist from approved source material.'],
      ['Review', 'Check accuracy with the buyer and record what an accepted delivery includes.'],
    ],
  },
  {
    id: 'product', label: 'A digital product', title: 'Make something people can keep.',
    description: 'Turn a useful method into a toolkit a buyer can open, apply and reuse.',
    buyer: 'Freelance designers preparing to hand a website to a client',
    offer: 'A website handover kit with editable templates, a worked example and a practical delivery checklist.',
    price: 79, cost: 15,
    experiment: 'Give a sample to three designers finishing a real project. Watch them use it and ask what they would pay for the complete edition.',
    criterion: 'One designer uses the sample in a handover and agrees to buy the complete edition.',
    roles: [
      ['Research', 'Identify the files, access and instructions clients ask for after delivery.'],
      ['Create', 'Build an editable kit and demonstrate it on one complete example.'],
      ['Review', 'Test the download and first use with a designer on a real handover.'],
    ],
  },
  {
    id: 'research', label: 'Paid research', title: 'Make your knowledge useful to others.',
    description: 'Build a recurring publication around a decision your audience needs to make.',
    buyer: 'Small creative studios selecting AI production tools',
    offer: 'A monthly research edition comparing three creative AI tools, with tested workflows, source links and an editable cost model.',
    price: 29, cost: 8,
    experiment: 'Publish a sample comparing three tools you have tested. Ask five studio owners which decision it helped them make and whether they would subscribe.',
    criterion: 'One studio pays for the next edition after reviewing the sample and publication schedule.',
    roles: [
      ['Research', 'Collect primary sources, current pricing and a representative test task.'],
      ['Create', 'Run the task, record the results and explain the tradeoffs.'],
      ['Review', 'Verify the sources, disclose incentives and date every comparison.'],
    ],
  },
] as const

export function starterInput(index: number, buyer: string, offer: string): OfferBriefInput {
  const start = businessStarters[index] ?? businessStarters[0]
  return {
    sourceTitle: 'Editable business starting point',
    sourceDate: '2026-11-28',
    excerpt: 'An illustrative starting point selected in Agentic Income. The buyer, offer, price and costs are assumptions to replace with firsthand research.',
    buyer, offer, currency: 'EUR', unitPrice: start.price, unitCost: start.cost,
    experiment: 'Show one complete sample of the offer to three prospective buyers matching this description: ' + buyer + '. Ask what they would change, whether they would use it and what they would pay.',
    successCriterion: 'One prospective buyer agrees a written scope, price and acceptance criteria after using the sample.',
  }
}

export function starterBriefHref(input: OfferBriefInput) {
  return '/workbench/offer-brief#business=' + encodeURIComponent(JSON.stringify(input))
}

export function starterFromFragment(fragment: string): OfferBriefInput | null {
  if (!fragment.startsWith('#business=') || fragment.length > 16000) return null
  try {
    const candidate = JSON.parse(decodeURIComponent(fragment.slice('#business='.length)))
    buildOfferBrief(candidate)
    return candidate
  } catch {
    return null
  }
}
