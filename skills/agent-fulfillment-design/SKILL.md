---
name: agent-fulfillment-design
description: Use when designing how agents deliver an offer — choosing the fulfillment pattern, designing the agent team and quality gates, and writing runbooks that run without their author.
---

# Agent Fulfillment Design

Delegation without structure is the failure mode. This skill turns an offer into a delivery machine.

## Pattern selection (by delivery risk)

| Offer shape | Pattern | Why |
|---|---|---|
| First-time / client-facing / irreversible | **Session** (human-in-loop) | Trust is built watching; errors are cheap to catch live |
| Multi-workstream delivery (site+copy+data) | **Team** (parallel specialists + adversarial reviewer) | Wall-clock compression; reviewer sets the floor |
| Recurring bounded job (refresh, audit, brief) | **Loop** (scheduled, capped, observable) | Consistency beats heroics |
| Public-facing on a schedule | **Pipeline** (generate→verify→PR→human gate→publish) | The gate before publish is non-negotiable |
| Glue/notifications/kickoffs | **Operator** (always-on, minimal blast radius) | Reactive layer only — never owns delivery |

## Team design rules

- Every role gets: a name, a one-paragraph brief, an artifact contract (what it returns), and a quality gate (how its work is judged).
- **Always include the adversarial reviewer** — a role whose only job is to break the others' work before the buyer sees it. The reviewer's prompt defines your quality floor.
- Verification is a stage, not a hope: typecheck/build/link-check for code, source-check for claims, render-check for content.

## Runbook contract

A runbook is done when a competent agent runtime can execute it without its author: intake brief template → stages with owner-roles → verification stage → handover artifact spec → provenance stamp (date+method+reviewer) → cost telemetry line (log agent spend next to revenue).

## Loop safety (hard rules)

Idempotent (same inputs → same result, safe to re-run) · capped (spend + volume ceilings) · observable (run log auditable in 60s) · gated (nothing publishes without human approval). A loop missing any of these is a liability, not automation.
