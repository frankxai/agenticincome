# Source-to-Brief Lab

**One useful outcome:** turn approved notes into a source-linked production brief, export it, then record a human review against the exact artifact.

Version 2026-10-11.1 · free original reference lab · Node.js 22 or newer · no dependencies, account, model key, network request or telemetry.

This is executable document assembly and validation. It does not autonomously research, verify factual truth, call an AI model or sell a product. The source inventory and rights states are supplied by you. A local review attestation is not authenticated customer activation or payment evidence.

## Get the files

Download the [original executable](workflow-lab.mjs) and [complete synthetic input](workflow-lab-sample.json) into one new local directory. Inspect the executable before running it. Keep the names shown below.

The sample is an authored studio scenario with reserved `example.com` references, not actual source pages or customer evidence. Its purpose is to demonstrate the complete structure. Replace those references with your real, reviewed, rights-cleared notes before using the output in work.

## Run the complete journey

```sh
node workflow-lab.mjs build workflow-lab-sample.json > draft.json
node workflow-lab.mjs markdown draft.json > brief.md
```

The first command returns the input, assembled Markdown and manifest. The second verifies that the bundle is intact before exporting the brief. Use a new directory: shell redirection overwrites a file of the same name. The program itself writes only to stdout and never publishes anything.

Open `brief.md`. You now have the buyer and job, five source-linked claims, a dated rights inventory, four production actions and an explicit release boundary. Inspect `draft.json`: it binds the input and artifact with SHA-256 fingerprints.

## Review the exact result

Copy `manifest.artifactSha256` from `draft.json` into a new `review.json` file. Fill every field yourself after inspection; the example values are illustrative.

```json
{
  "artifactSha256": "COPY_THE_ACTUAL_64_CHARACTER_ARTIFACT_HASH",
  "decision": "accept",
  "reviewerId": "local-reviewer",
  "reviewedAt": "2026-10-11T06:00:00Z",
  "checkedSourceLinks": true,
  "checkedRights": true,
  "checkedOutput": true,
  "notes": "Synthetic structure checked; not customer or market evidence."
}
```

Use the actual UTC time of your inspection and a local pseudonymous identifier; no email is needed. For the fixture, checking links means recognising that they are reserved examples, not asserting that pages exist. A real input requires checking the actual pages and permissions.

```sh
node workflow-lab.mjs review draft.json review.json > review-receipt.json
```

Acceptance fails if a review check is false, a claim still requires review, rights are unverified, open questions remain, the hash differs or any bundle content has changed. Use `"decision": "revise"` to record an incomplete review. Rebuild the draft after changing its input; never edit its generated manifest to force acceptance.

The receipt always says `customerEvidenceEligible: false`. Local identity is not independently authenticated. A real growth measurement requires a separate consented event contract, eligible denominator and actual customer acceptance. Fixture runs, staff checks and downloads must be excluded.

## Adapt it to your own work

Keep all input fields. Sources require unique short IDs, titles, HTTPS URLs without credentials/query data/fragments, valid recorded dates and one of `owned`, `licensed`, `public-domain`, `unverified`. Every claim references existing source IDs and declares `approved` or `review-required`.

Approved means you assert that your reviewer approved the supplied text; this validator cannot check truth. When a source is uncertain, use `review-required`, `unverified` or an open question. The lab preserves that uncertainty and blocks acceptance.

Inputs are limited to 24 KiB; read files and generated bundles are limited to 128 KiB. Single-line bounded text and Markdown escaping prevent supplied markup from becoming executable presentation. JSON, source-reference and review errors fail closed without echoing the input.

Keep confidential records out of public demos. The lab retains no server-side record, sends nothing and deletes nothing. You control the local input, exports and their retention; do not include keys or unnecessary personal data.

## Your agent's next instruction

Supply your own notes and the input schema above to the assistant you already use:

> Assemble this input using only the supplied notes. Cite each claim by source ID. Mark missing evidence as review-required and unresolved rights as unverified. Do not research, invent claims, expose personal data, purchase, publish or promise performance. Return schema-compatible JSON plus a short explanation of anything that a human must resolve. Do not change fixture to false until these are actual reviewed sources. Then run the local validator and report the artifact hash and remaining blockers. The human reviews the original sources and output before use.

Using an external model can incur its provider's charges and terms. This lab makes no such call. For comparing models, use the existing [identical shared protocol](brief.md) and record exact versions, permissions, baseline, elapsed time and actual costs; this ordinary lab work is not a scored competition run.

## The cinematic demonstration

Show the real sequence in four chapters: **Gather → Shape → Inspect → Own**. Gather shows the approved source inventory; Shape shows the real CLI and assembled brief; Inspect shows source references and failed/revised review; Own shows the portable Markdown and receipt. Keep synthetic labels visible.

Use readable artifact close-ups, deliberate cuts, captions, pause/skip controls and a complete static transcript. Audio begins only after consent. Original or properly licensed visual/audio material is required. Motion should reveal the transformation and its human decision, with the complete result available under reduced motion.

## Licence and scope

Original executable, sample and this guide: MIT licence. Third-party inputs, marks, media, datasets and model services remain subject to their own rights. This grant covers this lab, not external source material or a future paid Workflow Edition. No support subscription, earnings, factual verification or compatibility beyond the stated runtime is promised.

Copyright (c) 2026 Frank Riemer

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
