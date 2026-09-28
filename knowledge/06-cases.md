---
title: "Attested Cases — proof with provenance"
last_verified: 2026-09-28
review_cycle: quarterly
---

# Attested cases: proof with provenance

Marketing testimonials are dead weight in this category — everyone has fake ones, so real ones read as fake. Our replacement is the **attested case**: a build documented with enough provenance that a skeptical operator can audit it. Fewer, heavier, verifiable.

## The case format (SIP-attested)

Every case file carries:

```yaml
case: <slug>
date_shipped: YYYY-MM-DD
model: service | product | system        # which income model (see 02)
patterns_used: [team, pipeline, loop]    # fulfillment patterns (see 03)
runtime: claude-code | codex | mixed
build_cost:
  human_hours: <n>          # honest, including discovery and review
  agent_spend_usd: <n>      # token/tool cost, measured not guessed
artifacts:                  # public or sanitized links — the audit trail
  - repo/PR/preview/handover links
outcome:                    # what exists now, stated without projection
  - "client workflow X runs on weekly loop with approval gate"
revenue_note: disclosed | private | n/a   # if disclosed, costs shown too
consent: recorded YYYY-MM-DD              # for client cases
attestation: sip-1.0                      # provenance stamp
```

Rules: no case without artifacts; no revenue figure without its cost figure; no client case without recorded consent; sanitize identity on request but never sanitize *method*.

## The standing library

| Case | Model | What it proves |
|---|---|---|
| **This trinity itself** | System | Three properties + packs + pipelines, built and operated by agent teams — every repo, workflow, and design decision in version control, to be published at launch (private as of 2026-09-28). The permanent Exhibit A. |
| **The `go.` redirector** | System | A production affiliate-link router (security model, catalog sync, disclosure headers) built as a weekend-scale agent delivery — repo `frankxai/go-agenticincome` (private as of 2026-09-28). |
| *Sprint cases* | Service | Sanitized implementation-sprint write-ups land here as they clear consent — format above, artifacts included. |
| *Pack-user cases* | Product/System | Opt-in submissions from creators who shipped with `/ai`, `/api`, or `/dpi` — submission via issue template `case-submission.yml`, verified before publication. |

An empty slot in this table stays visibly empty until a real case fills it. A library that admits "two entries, both ours" is worth more than a wall of stock-photo praise — that's the whole thesis of this file.

## Submitting a case

Shipped something with the packs? Open an issue with the `case-submission` template: what you built, artifacts we can verify, what it costs to run, whether we may name you. We verify before publishing, we never pay for cases, and we publish honest failures too — a documented dead end with a clean post-mortem teaches more than a highlight reel.

*Back to the [index](00-INDEX.md) · or install the pack and go build: [README](../README.md#run-the-public-system).*
