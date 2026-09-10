# People operations improvement

Version 0.2.0 · Original reusable service template · English

## Client job and acceptance

One company, up to 30 employees and two defined process improvements. Payroll, legal advice and employee investigations excluded.

- Accepted process baseline and source register
- Two implemented process artifacts with accountable owners
- Service review covering effort, exceptions and accepted improvements

Quality review: Verify process outputs against their signed acceptance checks; retain an explicit human escalation route.

## Three delivery choices

| Human service | Fee hypothesis, USD before tax | Human hours before additional quality review | Specific work |
| --- | ---: | ---: | --- |
| Managed preparation | 1,500 | 10 | Operations lead reviews outputs weekly. |
| Expert delivery | 4,000 | 24 | Adds two 60-minute manager workshops and process coaching. |
| Embedded partnership | 8,000 | 44 | Adds four 60-minute leadership working sessions and facilitated implementation follow-through. |

Fee basis: 30-day improvement cycle. These are hypotheses, not observed market rates. Vendor subscriptions and unscoped work are additional. Raise fees for defined expertise, depth, access and evidence of accepted work. Do not sell an unearned quality badge.

## Workflow order

### Refresh authorized knowledge

Inputs: Authorized source IDs, Access scope, Review dates.

Deliverable: Source-linked brief and stale-record exceptions. Record source revision, accountable owner, acceptance test and destination.

### Prepare weekly decisions

Inputs: Work status, Decision owner, Due dates.

Deliverable: Decision brief and meeting-change proposals. Record source revision, accountable owner, acceptance test and destination.

### Maintain onboarding tasks

Inputs: Accepted plan, Task owner, Approved workspace.

Deliverable: Verified task updates and unresolved blockers. Record source revision, accountable owner, acceptance test and destination.

### Prepare invoice from accepted work

Inputs: Accepted milestone, Billing revision, Commercial terms.

Deliverable: Checked invoice draft for finance. Record source revision, accountable owner, acceptance test and destination.

## Run the example

From the kit root:

```bash
node tools/agency.mjs configure examples/people-operations.json
node tools/agency.mjs offer examples/people-operations.json
```

This fixture starts with unknown controls and no quality evidence. Its result must remain Q0 and at most A1. Completing a template does not connect a provider.

## Delivery rhythm

Day 1: agree scope, baseline, ownership and access. First delivery: review one complete artifact before increasing volume. Weekly: send one decision brief through the authorized channel; hold a meeting only for a decision or live human work. End of scope: compare accepted outcomes, correction minutes and total cost with the baseline.

## Exceptions and recovery

Unclear source rights: stop that source and ask its owner. Changed client criteria: revise scope and invalidate affected approval. Unknown external-action result: reconcile by provider ID before retry. Sensitive disclosure: route to the appropriate human with minimal detail. Capacity breach: rescope before accepting more work.

## Client-specific decisions

Name contracting parties, delivery owner, data owner, acceptance reviewer, support hours, required human contact, dates, payment milestones, cancellation terms and permitted tools. Client approval applies to the exact scope, not future expanded work.
