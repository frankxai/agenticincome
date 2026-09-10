# Architecture and reuse

The commercial product ID is `hr-agency-launch-kit`. It belongs to Agentic Income's existing product catalog. Do not create a competing business-system schema.

## Existing operating contract

Use the public [IncomeSystem v1 contract](https://github.com/frankxai/agentic-income-skills/blob/main/schemas/income-system.v1.schema.json) and [request-to-quote reference](https://github.com/frankxai/agentic-income-skills/blob/main/examples/request-to-quote-desk/income-system.json) when implementing a client service.

| Kit artifact | Existing IncomeSystem destination |
| --- | --- |
| Agency, accountable owner, niche | metadata; spec.principal; spec.buyer |
| Accepted scope and deliverables | spec.outcome; spec.offer |
| Task recipes and actual tools | spec.agent; spec.interfaces |
| Human decisions, denied actions, budgets | spec.authority |
| Source and retention register | spec.dataPolicy |
| Eight workflow definitions and recovery | operations |
| Synthetic cases and expert acceptance | evaluations |
| Scenario inputs and actual cost events | economics |
| Review and execution receipts | proof |

This is a mapping, not a prevalidated or production-ready IncomeSystem. Actual entity details, verified domains, schemas, permissions and evidence must come from the implementing agency. Do not fill unknown identity or evaluation fields with invented assertions.

## Reuse the Ana HR work

[Public HR kit draft PR #9](https://github.com/frankxai/ana-ai-business-kit/pull/9), reviewed head `7d31e527c0c5b45968b57443f55412c9db94a7a1`, already contains local invoice preparation, billing-revision tracking, agency planning and team-practice work.

Reuse those artifacts where appropriate. This digital product supplies the buyer/business model and learning sequence around them. It does not relabel draft local tools as a live recruiting service, and does not bundle or resell public source as exclusive proprietary software. Inspect upstream license terms and pin a reviewed version before distribution.

A future hosted edition can use Starlight context/work records, GenCreator's approved content production and the agency's existing ATS. Keep tenant identity, permission boundaries and source authority explicit. A shared runtime does not create a shared pool of candidate records.

## Connection order

First demonstrate the task with fictional files. Then authenticate a restricted test tenant and verify actual tool names/permissions. Enable reads, then individual reversible writes, then approved external actions only after receipt and recovery checks.

A proposed flow is:
approved role brief → draft sourcing/outreach → reviewed candidate evidence → human decision → onboarding handoff → accepted milestone → finance preparation.

Implement a durable action identity from tenant, engagement, task and source revision. Record attempted, confirmed, failed and reconciled states separately. Provider timeouts require reconciliation before retrying irreversible work. An orchestration retry setting is not permanent duplicate protection.

Candidate-selected interview format, unresolved evidence and requests for human contact are first-class workflow fields. They are not negative candidate signals.

## Commercial extension

Sell a provider-specific automation add-on only after its own tested export, configuration guide, permissions contract, failure behavior and maintenance owner exist. An importable workflow that depends on a buyer's accounts is still distinct from an installed service.

Ana's method module has separate author/rights review. The base kit can launch on its own original material without promising her time, approval or participation.
