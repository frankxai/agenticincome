# Claims Guard Pack · Product Specification

- **Product ID:** `claims-guard-pack`
- **Price:** `$39` one-time (packaged edition; checkout gated pending Polar upload)
- **Upstream Source:** `github.com/frankxai/agentic-business-os` (`packs/claims-guard-pack/`, MIT licensed)
- **Delivery Path:** `/delivery/claims-guard-pack`

## Five Verification Gates Inside the Pack

1. **Gate 1 · Regulated & Earnings Claims (Zero Tolerance):** Flags unsupported earnings promises, unattributed market forecasts, and unverified customer outcome statements.
2. **Gate 2 · Citation & Date Freshness:** Checks that vendor prices, commission percentages, and benchmark figures carry an `as of YYYY-MM` verification date and primary source URL.
3. **Gate 3 · Brand Voice & Editorial Restraint:** Flags em-dashes, rhetorical contrast clichés, ungrounded promotional adjectives, and `ALL CAPS` badge shouting.
4. **Gate 4 · Disclosure Completeness:** Confirms FTC/EU inline material-connection disclosures appear above the first monetized link alongside a named non-affiliate alternative.
5. **Gate 5 · Page Structure & Action Clarity:** Audits first-120-word clarity, single-primary-CTA discipline, and candid `"Who should skip this"` boundaries.

## Included Files

- `SKILL.md`: Drop-in skill file for Claude Code, Codex, OpenCode, Grok, and Cursor.
- `rules/claims-guard-rules.json`: 30 machine-readable regex and structural patterns with severity levels (`error`, `warn`).
- `blocks/disclosure-snippets.md`: Plain-language inline disclosure templates for comparison posts, tool directories, and pack pages.
- `manifest.json` & `PRODUCT.md`: Versioned SHA-256 package manifest and usage runbook.

## Who Should Skip This

Skip this if you need formal legal review from a licensed attorney (this pack is an editorial checklist, never legal advice) or if you prefer cloning the MIT repo directly from GitHub.
