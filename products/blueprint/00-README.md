# Agentic Income Operating Desk Blueprint

> **Personal commercial license: purchased copies are for the buyer's own business repositories and workflows. Not for resale or public redistribution.**

- **Product ID:** `blueprint`
- **Version:** `3.0.0` · **Released:** `2026-11-03` · **Price:** `$67` one-time
- **Merchant of record:** Polar.sh (handles VAT and sales tax at checkout; 30-day no-questions refund)
- **Public companion skills (MIT):** [github.com/frankxai/agentic-income-skills](https://github.com/frankxai/agentic-income-skills)

---

## What this operating desk builds

This package turns firsthand tool testing and technical comparison writing into a structured, git-backed commercial system: one workspace layout, one scored comparison workflow with non-affiliate integrity, one verified recurring-payer ledger, one 4-stage offer and waitlist ladder, and one fail-closed Polar.sh checkout setup.

Every file in this archive is plain Markdown, CSV, or JSON so you can drop it directly into a repository, version it in git, and run it with Claude Code, OpenAI Codex, Gemini CLI, Cursor, or any standard text editor.

## Package file map (install in order)

| Step | File | Format | Job |
|---|---|---|---|
| `01` | `00-README.md` | Markdown | 60-minute install sequence, integrity verification, and license boundaries |
| `02` | `operating-desk-architecture.md` | Markdown | Repository folder structure, daily 45-minute and weekly 60-minute cadence, scenario economics, and 30-day / 90-day kill criteria |
| `03` | `coding-tool-comparison-matrix.md` | Markdown | Primary-sourced matrix across Claude Code, OpenAI Codex, Gemini CLI, and Cursor (as of September 2026) plus reusable comparison page template and disclosure blocks |
| `04` | `recurring-payer-catalog.csv` | CSV | 12-row verified partner ledger with commission terms, cookie windows, primary source URLs, verification dates, and named non-affiliate alternatives |
| `05` | `offer-and-waitlist-ladder.md` | Markdown | 4-stage offer architecture (`$0` starter to `$19-$149` self-serve packs and continuity), waitlist validation protocol, and copyable TypeScript/JSON offer schema |
| `06` | `polar-fulfillment-checklist.md` | Markdown | Self-serve Polar.sh merchant-of-record setup, 3-gate fail-closed checkout pattern, attribution passthrough, and 12-point live purchase and refund rehearsal |
| `07` | `MANIFEST.json` | JSON | Machine-readable manifest with exact byte sizes, line counts, and SHA-256 digests for every delivered file |

## 60-minute first-day install sequence

### Minutes 00 to 10: Verify package integrity and create your desk folder

Copy this package into `docs/operating-desk/` or `products/operating-desk/` inside your repository and verify SHA-256 checksums against `MANIFEST.json`:

```bash
node -e '
const fs = require("node:fs");
const crypto = require("node:crypto");
const path = require("node:path");
const manifest = JSON.parse(fs.readFileSync("MANIFEST.json", "utf8"));
for (const item of manifest.files) {
  const buf = fs.readFileSync(path.basename(item.path));
  const actual = crypto.createHash("sha256").update(buf).digest("hex");
  if (actual !== item.sha256) throw new Error(`Hash mismatch: ${item.path}`);
  console.log(`OK  ${actual.slice(0, 12)}  ${path.basename(item.path)} (${buf.length} B)`);
}
'
```

### Minutes 10 to 25: Set your cadence and stop rules

Open `operating-desk-architecture.md`. Select the weekly time budget that matches your real calendar (`Under 5 hours`, `5 to 10 hours`, or `10+ hours`), create the workspace folders, and fill out the 30-day seed kill-criterion block before publishing a single page.

### Minutes 25 to 45: Score your first comparison and verify partner routes

Open `coding-tool-comparison-matrix.md` and `recurring-payer-catalog.csv`. Pick one category you use weekly in real work, score at least three tools against explicit criteria, name the strongest non-affiliate or open-source option first-class, and place the FTC/EU disclosure block above the first monetized link.

### Minutes 45 to 60: Wire your waitlist-first offer rung

Open `offer-and-waitlist-ladder.md` and `polar-fulfillment-checklist.md`. Attach one workflow-specific lead magnet (`$0`) and one gated `#request-access` product specification so readers can inspect what you are building while checkout stays fail-closed until your Polar test purchase passes.

## Explicit boundaries and who should skip this

- **Zero income promises:** Every financial table in this package is an illustrative arithmetic scenario under named assumptions. Traffic, conversion rates, partner terms, and refund rates vary widely and often start near zero during early indexing months.
- **Editorial discipline, not legal or tax advice:** The FTC 16 CFR Part 255, 16 CFR Part 465, and EU AI Act Article 50 checklists summarize primary regulatory guidance as of September 2026 to keep editorial standards high. Consult a qualified attorney or accountant for jurisdiction-specific counsel.
- **Self-serve files, not done-for-you consulting:** Template-level support covers broken files, checksum mismatches, and version errata. Scoped repository implementation is a separate engagement on [agenticincome.ai/offers](https://www.agenticincome.ai/offers).

## Support and 30-day refund policy

If this package is not useful for your workflow, reply to your Polar.sh receipt within 30 days of purchase for a full, no-questions refund processed back to your original payment method.

---

Copyright Frank Riemer · [agenticincome.ai](https://www.agenticincome.ai) · Personal commercial license.
