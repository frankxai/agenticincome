# Pilot, quality review and success measures

All numerical goals here are test hypotheses. Current customer count, revenue and measured time savings for Studio are unknown; the shipped examples are fictional.

## First practice engagement

Use `examples/talent-delivery.json`. Run configuration and offer generation. Explain why the result is Q0 and A1 despite requesting A3/Q2. Complete the role and interview evidence artifacts in the original practice case. A practitioner checks whether the output is usable and what needs correction. Do not edit evidence to claim an observed result that has not occurred.

Then repeat with `examples/retreat-outcomes.json` and the fictional team day in the retreat module. Produce the outcome brief, runbook, action handoff and cost exception list. The first goal is one complete reusable service, not all six operating simultaneously.

## Evidence collection protocol

Write the task, input set, workflow version, expected output and rubric before the run. Keep a fixed held-out evaluation set separate from examples used to revise prompts. Compare the practitioner’s current method and the product on equivalent briefs, with order varied when practical. Blind the output labels for independent review where feasible. Record failed and abandoned runs as well as successes.

An accepted case must meet every material criterion. “Accepted with minor edits” is allowed only if the rubric explicitly defines minor edits; track those minutes. Material failures include invented job evidence, wrong invoice amounts, private-data exposure, wrong recipients, missing source authority or an output that cannot serve the contracted purpose. Critical incidents remain visible and require remediation; do not remove them from the denominator.

For candidate-facing workflows, review job-related validity, language and accessibility issues with a competent practitioner. Any fairness assessment needs an appropriate method and lawful data basis; this kit's assurance level is not a fairness score. Do not infer protected or sensitive attributes to populate a dashboard.

## Measures that decide whether to continue

| Measure | Definition and denominator | Initial target | Owner / source |
| --- | --- | --- | --- |
| Digital product demand | Paying pilot agencies / qualified agencies invited after checkout validation | 5 / 20 | Product owner; invitation and purchase receipts |
| Practice utility | Agencies completing one practitioner-accepted case / activated pilot agencies | At least 4 / 5 within 14 days | Independent reviewer; artifact rubric |
| Product support | Logged support minutes / activated agency; report median and range | Median ≤90 minutes for Studio | Support owner; time log |
| Source accuracy | Accepted factual assertions / assertions reviewed on the fixed task | At least 95%; zero material errors before Q2 | Reviewer; source-to-output evidence |
| Coordination effort | Active coordination minutes per comparable engagement | 25% lower than recorded baseline | Agency lead; time log and scope record |
| Meeting burden | Meeting duration × attendees, per comparable week; include extra async work separately | 30% lower status-meeting burden without added total effort | Client owner; authorized calendar and work log |
| Delivery acceptance | Accepted deliverables / deliverables due by review date | At least 90% during pilot; investigate each miss | Client reviewer; accepted artifacts |
| Retreat follow-through | Accepted completed actions / actions due by day 30 | At least 80% | Sponsor; action receipts |
| External-action reliability | Confirmed intended effects / authorized attempted effects; unknown results reported separately | Zero unapproved or duplicate effects | Operations owner; provider receipts |
| Commercial sustainability | Collected service fees minus delivery labor, tools, refunds, acquisition and maintenance | Positive contribution at agreed human capacity | Agency owner; actual cost records |

Use `templates/studio-metrics.csv` for records. Baseline zero means a percentage change is undefined, not 100% improvement. Missing observations stay missing. Report sample size and scope; small pilots guide design and do not prove general superiority. Never treat employee participation in optional activities as a success target.

## Six-week release sequence

Week 1: Ana reviews method/roles and one practitioner completes the fictional hiring case. Week 2: finish one revised case, choose one connected architecture and qualify its first read-only adapter in a test tenant. Weeks 3–4: five scoped agency pilots, only after commerce and delivery work. Weeks 5–6: fix repeated defects, review support economics and consider a second service or higher autonomy.

These are relative stages, not booked appointments or promised dates. Keep one flagship workflow active per pilot. Add a second only when the first has accepted evidence and support capacity.

Continue if at least four pilot agencies finish useful work and contribution remains viable after actual support. Redesign if acceptance fails or support repeatedly exceeds the budget. Pause the affected workflow immediately for privacy exposure, unapproved external action, duplicate financial effect or a harmful employment decision error. Stop expanding the portfolio if it takes recurring founder intervention to complete the core exercise.
