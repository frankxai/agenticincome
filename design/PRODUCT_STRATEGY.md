# Agentic Income Product Strategy

## Product Thesis

Agentic Income is an operating desk for the AI-tool economy. It turns search demand into trusted recommendations, trusted recommendations into recurring routes, and recurring routes into owned products.

The product is not "content plus affiliate links." The product is the repeatable trust system behind the content.

## Transformation Promise

Before Agentic Income:

- scattered AI-tool opinions
- one-off affiliate clicks
- weak disclosure discipline
- no owned relationship
- no reusable catalog memory

After Agentic Income:

- one search-intent map
- citable comparisons with clear tradeoffs
- recurring-payer routing only when the recommendation earns it
- email capture and direct product ladder
- a shared catalog that makes every future page smarter

## Primary Audience

- AI builders who want revenue without losing credibility.
- Creator operators who need real tool stacks, not tool hype.
- Founder-led publishers building owned distribution and durable product assets.

## Offer Ladder

1. Starter Kit: free path, shortlist, checklist, and first comparison shape.
2. Agentic Income Blueprint: paid operating system with templates, catalog model, and implementation walkthrough.
3. Private Intel: monthly payer intelligence, audit notes, stack opportunities, and direct updates.
4. Partner/portfolio layer: future licensing, templates, and verified tool-intelligence packages.

## Delivery Architecture

The offer ladder resolves through internal product pages and one checkout redirect route:

- `/offers/starter-kit` -> `/api/checkout?offer=starter-kit` -> `/delivery/starter-kit`
- `/offers/blueprint` -> `/api/checkout?offer=blueprint` -> payment provider URL when `AGENTIC_INCOME_BLUEPRINT_CHECKOUT_URL` exists, otherwise request-access; provider success redirect should land at `/delivery/blueprint`
- `/offers/private-intel` -> `/api/checkout?offer=private-intel` -> payment provider URL when `AGENTIC_INCOME_PRIVATE_INTEL_CHECKOUT_URL` exists, otherwise request-access; provider success redirect should land at `/delivery/private-intel`

This keeps links working today without pretending paid checkout is live before provider links are configured.

## Page Architecture

- Homepage: show the mechanism, the transformation, the trust model, the flywheel, and the next move.
- Start: turn a cold visitor into an operator with one specific first loop.
- Tools: make the payer catalog inspectable and disclosure-safe.
- Blog: win high-intent search with honest comparisons and citable structure.
- Offers: convert trust into the direct product ladder.
- Trust: make the recommendation policy, affiliate disclosure, checkout fallback, support, and refund boundaries public.
- Delivery: prove each product has a post-click handoff route before checkout promotion.
- Design: prove the brand is built with operating discipline, not generic AI polish.

## Language Strategy

Use:

- research desk
- catalog
- comparison
- payer route
- recurring ledger
- owned audience
- product ladder
- trust architecture
- income desk

Avoid:

- get rich
- passive income fantasy
- autopilot money
- unlock your potential
- AI magic
- vague transformation claims without mechanism

## Visual And Motion Strategy

The signature visual is "chaos becoming a routed desk." Generated media may carry mood and transformation, but exact words, labels, comparisons, and claims must remain coded in React/MDX.

Motion should show causality:

- demand enters
- comparison filters
- payer route opens
- audience/product asset compounds

GSAP is reserved for the hero, signal traces, transformation image settle, flywheel line draw, and proof meters. Reduced motion preserves every relationship statically.

## Quality Gate

Ship only when:

- the first viewport names Agentic Income and shows the mechanism
- the transformation is visible without reading every paragraph
- generated images have no readable fake text or broken UI
- CTAs point to Start, Tools, Blog, or Offers with clear intent
- `/design` documents the operating standard
- type-check, links, build, visual QA, reduced-motion QA, and Vercel preview checks pass
- every primary offer button has a verified destination and no product card points at a generic placeholder funnel
