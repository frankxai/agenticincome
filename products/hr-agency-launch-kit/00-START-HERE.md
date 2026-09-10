# AI-native HR Agency Launch Kit
Version 0.1.0 · English review edition · 10 September 2026

Build an agency that uses AI for preparation and coordination, and charges for the human judgment its clients need.

This is an editable digital product: a business blueprint, workflow playbook, client-service ladder, tool-selection guide, reusable templates, fictional practice case and a working economics calculator. It is not a hosted HR platform or an account-connected agent team. No vendor subscription is included.

## Your first useful result

Use the fictional case to produce one bounded client offer, a role brief, an interview evidence sheet and a costed delivery plan. The acceptance standard is a reviewed set of usable artifacts, not how many prompts you ran.

1. Read [the business blueprint](01-BUSINESS-BLUEPRINT.md) and select one niche and service.
2. Choose the human service level in [the service model](02-HUMAN-SERVICE-LAYERS.md).
3. Work through [the operating playbook](03-WORKFLOW-PLAYBOOK.md) with the templates.
4. Run the included scenario calculator. Node.js 20+ is the only requirement:

```bash
node tools/economics.mjs examples/economics-scenarios.json
node --test tools/economics.test.mjs
```

No coding is required to use the Markdown and CSV templates. Open Markdown in your document workspace, import CSVs into your spreadsheet, and use [the formula reference](templates/economics-formulas.md) when you prefer a spreadsheet.

## Included

| Asset | Useful output |
| --- | --- |
| Business blueprint | Buyer, niche, offer, acquisition experiment and operating model |
| Human service layers | Three scoped client services with explicit human work |
| Workflow playbook | Eight workflows with inputs, outputs, decisions and recovery |
| Tool guide | Dated vendor evidence and a qualification exercise |
| Practice case | Fictional brief, interview excerpt, outreach and acceptance checks |
| Templates | Client scope, role brief, interview evidence, outreach review, knowledge register, weekly decisions, onboarding and measurement |
| Economics tool | Contribution, break-even, capacity and stressed scenarios |
| Architecture mapping | Reuse of the existing IncomeSystem contract and Ana HR kit |

The case and all financial numbers are synthetic. Local arithmetic checks cannot establish client demand, hiring quality or a live vendor integration.

## Review edition and delivery

The proposed product price is US$149 once, before applicable tax; it is a test hypothesis. Checkout is closed. The proposed license allows one purchasing agency and up to five internal users to adapt templates into client deliverables; resale of the source kit is excluded. See [license and support](LICENSE-AND-SUPPORT.md).

The full kit belongs in private file delivery. The separate public sample is intentionally limited. Updating this kit does not publish private company or candidate records.

Ana-inspired human practice is a proposed collaboration direction. This edition does not claim Ana's authorship, endorsement, training credentials or approval, and contains none of her private clinical material. A separately approved method module can follow.

Start with one completed practice engagement. Use the acceptance checklist in the case before using real client data.
