# Operating manual

This edition runs locally with Node.js 20 or later. Markdown and CSV templates can be used without Node. No API key, subscription, provider login or network access is needed for its practice cases.

## First five minutes

Unzip the review archive, open a terminal in its root folder and run:

```bash
node tools/agency.mjs catalog
node tools/agency.mjs configure examples/talent-delivery.json
node tools/agency.mjs offer examples/talent-delivery.json
node --test tools/agency.test.mjs tools/economics.test.mjs
```

To save the offer, redirect its text to a file you choose:

```bash
node tools/agency.mjs offer examples/talent-delivery.json > my-offer-draft.md
```

The CLI reads one explicit local JSON file and writes its result to standard output. It never calls a provider, sends a message, changes permissions or records an authenticated approval. Invalid input returns a clear rejection and nonzero exit code. Opaque IDs keep names and free-form sensitive content out of configuration output.

## Configure a service

Copy a service example. Preserve `version: 0.2.0`. Choose a service, architecture, H1/H2/H3 human level, requested autonomy 0–4 and quality target Q1/Q2/Q3. Enter current costs and capacity. Do not assume automation reduces labor; enter observed changes only after measuring them. Additional quality-review hours are added to the human delivery budget.

Use one `asOf` date for configuration and quality evidence. Evidence scope must equal the service ID. Match its workflow version to the implementation reviewed. A control marked verified needs a dated evidence reference. References must resolve in the agency's private evidence system; this local tool does not fetch or authenticate them.

The tool returns service scope, human work, architecture, proposed autonomy, current evidence level, missing controls, workflow decisions, fee hypothesis, base economics, a doubled-human-time stress case and warnings. The fee is a catalog hypothesis; it is not computed from an alleged employee quality score. For custom fees use the original economics calculator and document a revised client scope.

## Assess a quality record

`examples/quality-rehearsal.json` is a fictional independent benchmark record for testing the evaluator. It intentionally has no live evidence. Run:

```bash
node tools/agency.mjs assess examples/quality-rehearsal.json
```

Expected result: Q2 from supplied fictional benchmark records, with `syntheticOnly: true` and an explicit authenticity limitation. This is a test of the assessment rule, not an actual Q2 achievement by the product. Never submit the fixture as customer evidence.

## Weekly operating rhythm

Before the weekly review, produce one brief per engagement: accepted work, overdue decisions, source changes, upcoming commitments and unresolved exceptions. Proposed meeting changes must identify purpose, decision owner, required participants and the equivalent async artifact. Keep meetings for difficult decisions, collaboration and human support; cancel or change them only with the relevant authority.

At the review, resolve decisions requiring the owner. Afterward, update only approved task scopes and collect provider receipts. Invoices start from accepted milestones and current commercial terms; a completed task or draft invoice is not proof of payment.

## Installing connected capabilities later

Pin and inspect the existing Ana HR plugin and Retreat OS versions in the architecture records. Discover host capabilities and exact permissions. Follow each upstream installation contract; this archive does not silently install plugins or expose an MCP endpoint. Qualify one read-only connection and one reversible write before proposing broader execution.

Use [connector qualification](09-ARCHITECTURES-AND-CONNECTORS.md), `templates/connector-acceptance.csv` and the agency's existing source and approval records. A test-tenant pass does not establish production authority. Public catalog/MCP delivery continues to expose only the free sample, never this paid archive.

## Troubleshooting

- Unknown field or ID: compare with `catalog` and a shipped example; do not suppress validation.
- Lower autonomy than requested: read missing controls and evidence reasons; the tool is showing a gap, not connecting the missing system.
- Evidence expired: rerun the real review on the current scope/version before updating its date.
- Negative contribution: change scope, fee or delivery design; do not erase human review hours.
- Unknown provider result: pause that action and reconcile in the provider before retrying.
- Wrong scope or data disclosure: use the agency's incident process and stop affected processing.
