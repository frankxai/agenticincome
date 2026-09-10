# Team working agreements

Version 0.2.0 · Original reusable service template · English

## Client job and acceptance

One team of up to eight people. Workplace facilitation; no clinical service.

- Team-approved decision and communication agreements
- One implemented meeting experiment with a baseline
- 30-day review of agreements used and work completed

Quality review: Every agreement needs an owner and review date; private reflection never becomes an employee score.

## Three delivery choices

| Human service | Fee hypothesis, USD before tax | Human hours before additional quality review | Specific work |
| --- | ---: | ---: | --- |
| Managed preparation | 1,500 | 8 | Facilitator prepares and reviews one 60-minute agreement session. |
| Expert delivery | 3,500 | 18 | Adds a 90-minute facilitated session and two team check-ins. |
| Embedded partnership | 6,500 | 32 | Adds two 60-minute leadership sessions, structured dissent preparation and a 30-day review. |

Fee basis: 30-day team engagement. These are hypotheses, not observed market rates. Vendor subscriptions and unscoped work are additional. Raise fees for defined expertise, depth, access and evidence of accepted work. Do not sell an unearned quality badge.

## Workflow order

### Refresh authorized knowledge

Inputs: Authorized source IDs, Access scope, Review dates.

Deliverable: Source-linked brief and stale-record exceptions. Record source revision, accountable owner, acceptance test and destination.

### Facilitate team work

Inputs: Agreed purpose, Facilitator, Participation alternatives.

Deliverable: Accepted working agreements. Record source revision, accountable owner, acceptance test and destination.

### Prepare weekly decisions

Inputs: Work status, Decision owner, Due dates.

Deliverable: Decision brief and meeting-change proposals. Record source revision, accountable owner, acceptance test and destination.

## Run the example

From the kit root:

```bash
node tools/agency.mjs configure examples/team-practice.json
node tools/agency.mjs offer examples/team-practice.json
```

This fixture starts with unknown controls and no quality evidence. Its result must remain Q0 and at most A1. Completing a template does not connect a provider.

## Delivery rhythm

Day 1: agree scope, baseline, ownership and access. First delivery: review one complete artifact before increasing volume. Weekly: send one decision brief through the authorized channel; hold a meeting only for a decision or live human work. End of scope: compare accepted outcomes, correction minutes and total cost with the baseline.

## Exceptions and recovery

Unclear source rights: stop that source and ask its owner. Changed client criteria: revise scope and invalidate affected approval. Unknown external-action result: reconcile by provider ID before retry. Sensitive disclosure: route to the appropriate human with minimal detail. Capacity breach: rescope before accepting more work.

## Client-specific decisions

Name contracting parties, delivery owner, data owner, acceptance reviewer, support hours, required human contact, dates, payment milestones, cancellation terms and permitted tools. Client approval applies to the exact scope, not future expanded work.
