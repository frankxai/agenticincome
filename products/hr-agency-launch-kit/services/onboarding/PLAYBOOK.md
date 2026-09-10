# Onboarding and manager enablement

Version 0.2.0 · Original reusable service template · English

## Client job and acceptance

Up to three new hires and their managers; one role family.

- Role-specific 30-day plan with accepted learning artifacts
- Documented ownership and access requests
- Manager and new-hire review with unresolved blockers

Quality review: Verify every task has an owner, due date and acceptance test; measure accepted artifacts due by day 30.

## Three delivery choices

| Human service | Fee hypothesis, USD before tax | Human hours before additional quality review | Specific work |
| --- | ---: | ---: | --- |
| Managed preparation | 900 | 6 | Owner reviews plans and weekly blockers. |
| Expert delivery | 2,000 | 12 | Adds a 45-minute kickoff and two 30-minute manager sessions. |
| Embedded partnership | 4,000 | 24 | Adds up to three 45-minute individual role-transition sessions and a cohort integration review. |

Fee basis: 30-day cohort. These are hypotheses, not observed market rates. Vendor subscriptions and unscoped work are additional. Raise fees for defined expertise, depth, access and evidence of accepted work. Do not sell an unearned quality badge.

## Workflow order

### Refresh authorized knowledge

Inputs: Authorized source IDs, Access scope, Review dates.

Deliverable: Source-linked brief and stale-record exceptions. Record source revision, accountable owner, acceptance test and destination.

### Maintain onboarding tasks

Inputs: Accepted plan, Task owner, Approved workspace.

Deliverable: Verified task updates and unresolved blockers. Record source revision, accountable owner, acceptance test and destination.

### Prepare weekly decisions

Inputs: Work status, Decision owner, Due dates.

Deliverable: Decision brief and meeting-change proposals. Record source revision, accountable owner, acceptance test and destination.

## Run the example

From the kit root:

```bash
node tools/agency.mjs configure examples/onboarding.json
node tools/agency.mjs offer examples/onboarding.json
```

This fixture starts with unknown controls and no quality evidence. Its result must remain Q0 and at most A1. Completing a template does not connect a provider.

## Delivery rhythm

Day 1: agree scope, baseline, ownership and access. First delivery: review one complete artifact before increasing volume. Weekly: send one decision brief through the authorized channel; hold a meeting only for a decision or live human work. End of scope: compare accepted outcomes, correction minutes and total cost with the baseline.

## Exceptions and recovery

Unclear source rights: stop that source and ask its owner. Changed client criteria: revise scope and invalidate affected approval. Unknown external-action result: reconcile by provider ID before retry. Sensitive disclosure: route to the appropriate human with minimal detail. Capacity breach: rescope before accepting more work.

## Client-specific decisions

Name contracting parties, delivery owner, data owner, acceptance reviewer, support hours, required human contact, dates, payment milestones, cancellation terms and permitted tools. Client approval applies to the exact scope, not future expanded work.
