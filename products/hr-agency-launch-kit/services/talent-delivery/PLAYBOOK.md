# Structured talent delivery

Version 0.2.0 · Original reusable service template · English

## Client job and acceptance

One open role; up to 25 completed screens. No guaranteed hire.

- Accepted role criteria and sourcing brief
- Reviewed outreach and source-linked interview evidence
- Human hiring decision handoff and agreed next steps

Quality review: Blind-review twenty evidence statements against transcripts; sample candidate experience separately.

## Three delivery choices

| Human service | Fee hypothesis, USD before tax | Human hours before additional quality review | Specific work |
| --- | ---: | ---: | --- |
| Managed preparation | 1,500 | 8 | Recruiter reviews screens; employer conducts selection interviews. |
| Expert delivery | 3,500 | 16 | Adds up to six 45-minute structured human interviews and calibration. |
| Embedded partnership | 7,500 | 30 | Adds a 90-minute team agreement session, two check-ins and a 30-day integration review. |

Fee basis: 30-day role engagement. These are hypotheses, not observed market rates. Vendor subscriptions and unscoped work are additional. Raise fees for defined expertise, depth, access and evidence of accepted work. Do not sell an unearned quality badge.

## Workflow order

### Agree role evidence

Inputs: Client brief, Role criteria, Reviewer.

Deliverable: Role brief and unknowns. Record source revision, accountable owner, acceptance test and destination.

### Research role-relevant evidence

Inputs: Approved brief, Authorized sources.

Deliverable: Source-linked research for recruiter review. Record source revision, accountable owner, acceptance test and destination.

### Send a reviewed outreach batch

Inputs: Approved audience, Exact message digest, Opt-out check.

Deliverable: Provider receipt or reconciliation exception. Record source revision, accountable owner, acceptance test and destination.

### Run disclosed optional screening

Inputs: Role-specific rubric, Reviewed invitation, Human alternative.

Deliverable: Transcript and job-related evidence for review. Record source revision, accountable owner, acceptance test and destination.

### Advance or reject a candidate

Inputs: Reviewed evidence, Accountable decision maker.

Deliverable: Human decision and rationale. Record source revision, accountable owner, acceptance test and destination.

## Run the example

From the kit root:

```bash
node tools/agency.mjs configure examples/talent-delivery.json
node tools/agency.mjs offer examples/talent-delivery.json
```

This fixture starts with unknown controls and no quality evidence. Its result must remain Q0 and at most A1. Completing a template does not connect a provider.

## Delivery rhythm

Day 1: agree scope, baseline, ownership and access. First delivery: review one complete artifact before increasing volume. Weekly: send one decision brief through the authorized channel; hold a meeting only for a decision or live human work. End of scope: compare accepted outcomes, correction minutes and total cost with the baseline.

## Exceptions and recovery

Unclear source rights: stop that source and ask its owner. Changed client criteria: revise scope and invalidate affected approval. Unknown external-action result: reconcile by provider ID before retry. Sensitive disclosure: route to the appropriate human with minimal detail. Capacity breach: rescope before accepting more work.

## Client-specific decisions

Name contracting parties, delivery owner, data owner, acceptance reviewer, support hours, required human contact, dates, payment milestones, cancellation terms and permitted tools. Client approval applies to the exact scope, not future expanded work.
