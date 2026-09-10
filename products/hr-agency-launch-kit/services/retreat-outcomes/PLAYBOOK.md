# Retreat planning and outcome delivery

Version 0.2.0 · Original reusable service template · English

## Client job and acceptance

One team, 8–20 participants, up to two program days. Travel, venue, food and accommodation excluded.

- Outcome brief, comparable supplier assumptions and readiness packet
- Timed runbook with named decision owners and participation alternatives
- Reconciled service costs and accepted day-7/day-30 action handoff

Quality review: Compare every commitment to scope and receipt; track accepted actions due by day 30, not attendance alone.

## Three delivery choices

| Human service | Fee hypothesis, USD before tax | Human hours before additional quality review | Specific work |
| --- | ---: | ---: | --- |
| Managed preparation | 1,800 | 12 | Remote planning support; client supplies onsite host and facilitator. |
| Expert delivery | 4,500 | 30 | Adds one facilitated program day; named onsite host remains separately scoped. |
| Embedded partnership | 9,000 | 56 | Adds two facilitated program days and two integration sessions; qualified onsite support still separately budgeted. |

Fee basis: One event plus 30-day follow-through. These are hypotheses, not observed market rates. Vendor subscriptions and unscoped work are additional. Raise fees for defined expertise, depth, access and evidence of accepted work. Do not sell an unearned quality badge.

## Workflow order

### Prepare retreat decision packet

Inputs: Sponsor brief, Participant count, Dated estimates.

Deliverable: Outcome brief, readiness issues and runbook. Record source revision, accountable owner, acceptance test and destination.

### Commit venue or travel spend

Inputs: Current quote, Budget owner, Terms.

Deliverable: Human commitment decision. Record source revision, accountable owner, acceptance test and destination.

### Facilitate team work

Inputs: Agreed purpose, Facilitator, Participation alternatives.

Deliverable: Accepted working agreements. Record source revision, accountable owner, acceptance test and destination.

### Close costs and outcomes

Inputs: Source-linked costs, Accepted actions, Day-30 evidence.

Deliverable: Reconciliation exceptions and accepted outcome review. Record source revision, accountable owner, acceptance test and destination.

### Prepare invoice from accepted work

Inputs: Accepted milestone, Billing revision, Commercial terms.

Deliverable: Checked invoice draft for finance. Record source revision, accountable owner, acceptance test and destination.

## Run the example

From the kit root:

```bash
node tools/agency.mjs configure examples/retreat-outcomes.json
node tools/agency.mjs offer examples/retreat-outcomes.json
```

This fixture starts with unknown controls and no quality evidence. Its result must remain Q0 and at most A1. Completing a template does not connect a provider.

## Delivery rhythm

Day 1: agree scope, baseline, ownership and access. First delivery: review one complete artifact before increasing volume. Weekly: send one decision brief through the authorized channel; hold a meeting only for a decision or live human work. End of scope: compare accepted outcomes, correction minutes and total cost with the baseline.

## Exceptions and recovery

Unclear source rights: stop that source and ask its owner. Changed client criteria: revise scope and invalidate affected approval. Unknown external-action result: reconcile by provider ID before retry. Sensitive disclosure: route to the appropriate human with minimal detail. Capacity breach: rescope before accepting more work.

## Client-specific decisions

Name contracting parties, delivery owner, data owner, acceptance reviewer, support hours, required human contact, dates, payment milestones, cancellation terms and permitted tools. Client approval applies to the exact scope, not future expanded work.
