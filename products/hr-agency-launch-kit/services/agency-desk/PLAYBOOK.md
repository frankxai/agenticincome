# Agency knowledge and delivery desk

Version 0.2.0 · Original reusable service template · English

## Client job and acceptance

One client; up to five active roles and twenty delivery milestones. Recruiting interviews excluded.

- Source register with access owners and review dates
- Weekly decisions brief with proposed meeting changes
- Accepted milestone to invoice-preparation handoff

Quality review: Check twenty source-to-output links and every invoice total against accepted milestones.

## Three delivery choices

| Human service | Fee hypothesis, USD before tax | Human hours before additional quality review | Specific work |
| --- | ---: | ---: | --- |
| Managed preparation | 900 | 6 | Named owner reviews the weekly brief and invoice drafts. |
| Expert delivery | 1,800 | 12 | Adds two 45-minute client decision sessions and source cleanup. |
| Embedded partnership | 3,000 | 20 | Adds one 90-minute operating-design session and a 30-day adoption review. |

Fee basis: 30-day client workspace. These are hypotheses, not observed market rates. Vendor subscriptions and unscoped work are additional. Raise fees for defined expertise, depth, access and evidence of accepted work. Do not sell an unearned quality badge.

## Workflow order

### Refresh authorized knowledge

Inputs: Authorized source IDs, Access scope, Review dates.

Deliverable: Source-linked brief and stale-record exceptions. Record source revision, accountable owner, acceptance test and destination.

### Prepare weekly decisions

Inputs: Work status, Decision owner, Due dates.

Deliverable: Decision brief and meeting-change proposals. Record source revision, accountable owner, acceptance test and destination.

### Prepare invoice from accepted work

Inputs: Accepted milestone, Billing revision, Commercial terms.

Deliverable: Checked invoice draft for finance. Record source revision, accountable owner, acceptance test and destination.

## Run the example

From the kit root:

```bash
node tools/agency.mjs configure examples/agency-desk.json
node tools/agency.mjs offer examples/agency-desk.json
```

This fixture starts with unknown controls and no quality evidence. Its result must remain Q0 and at most A1. Completing a template does not connect a provider.

## Delivery rhythm

Day 1: agree scope, baseline, ownership and access. First delivery: review one complete artifact before increasing volume. Weekly: send one decision brief through the authorized channel; hold a meeting only for a decision or live human work. End of scope: compare accepted outcomes, correction minutes and total cost with the baseline.

## Exceptions and recovery

Unclear source rights: stop that source and ask its owner. Changed client criteria: revise scope and invalidate affected approval. Unknown external-action result: reconcile by provider ID before retry. Sensitive disclosure: route to the appropriate human with minimal detail. Capacity breach: rescope before accepting more work.

## Client-specific decisions

Name contracting parties, delivery owner, data owner, acceptance reviewer, support hours, required human contact, dates, payment milestones, cancellation terms and permitted tools. Client approval applies to the exact scope, not future expanded work.
