# Tool decisions and dated evidence

Reviewed 10 September 2026. Vendor capability below means documentation reviewed, not an account connected or an independent performance result. Source code, installed plugin, authenticated access, configured workflow and successful client delivery are different states.

## Recommended selection

Keep the current ATS and office suite. Add one proven missing capability. For a new agency, evaluate an agency-oriented ATS/CRM; for delivery inside a client's hiring organization, retain its established ATS. Choose one orchestration engine only after native handoffs are insufficient.

| Job | Candidate tooling | What was verified | Selection test |
| --- | --- | --- | --- |
| Agency ATS and client CRM | Recruit CRM | Remote OAuth MCP; candidate, company and task operations; role permissions. [Official product](https://recruitcrm.io/recruit-crm-mcp/) | Verify plan entitlement, least-privilege account, reads, explicit writes and action history in a test tenant |
| Existing in-house ATS | Ashby | Official MCP is documented as Open Beta, with user OAuth, recruiting reads and selected writes. Its native AI is recommended for work entirely within Ashby. [Official release](https://www.ashbyhq.com/product-updates/mcp) | Preserve client permissions; test notes and stage changes with real authorization before broader use |
| AI interviewing | Metaview Screening | Role-specific voice screening, preview, transcript and rubric output; provider states final advance/reject decision is human. [Official product](https://www.metaview.ai/screening) | Compare synthetic answer sets and human review; test interruptions, language, access needs, export and recovery |
| Sourcing and candidate engagement | Metaview / existing ATS | Metaview documents sourcing and outreach; [platform](https://www.metaview.ai/), [sourcing](https://www.metaview.ai/sourcing) | Check evidence, relevance, duplicates and recipient experience before enabling sending |
| Client development research | Clay | Official coding-agent plugin, shared skills and CLI for company/people research and enrichment. [Official repository](https://github.com/clay-run/agent-plugins) | Use approved business sources and small reviewed lists; confirm credit costs and suppression behavior |
| Cross-tool orchestration | n8n | Official MCP can discover, run, build and edit exposed workflows; access and feature availability vary by version. [Official docs](https://docs.n8n.io/connect/connect-to-n8n-mcp-server) | Test credential scope, exposed workflows, duplicate events, revocation and manual recovery |

Clay's coding-agent plugin is not automatically a ChatGPT-installed app. Metaview's published screening workflow does not establish a public MCP endpoint. Use each provider's documented integration; do not invent connector manifests or API methods.

The 9 September [Ana connector audit](https://github.com/frankxai/ana-ai-business-kit/blob/7d31e527c0c5b45968b57443f55412c9db94a7a1/docs/CONNECTOR-RESEARCH-2026-09-09.md) records a Recruit CRM MCP write-audit gap. Its help article could not be re-read during this update; resolve that question in the tenant before write activation.

## What to qualify before purchase

Ask each shortlisted vendor to demonstrate the exact workflow using synthetic records: authorized source retrieval, role-specific screening, a human alternative, evidence export, approved write, duplicate retry and revoked access. Confirm retention/deletion behavior and who can see records. Compare the proposed plan's actual limits and total cost at the intended volume.

Do not buy every tool above. Avoid paying for overlapping ATS outreach, sequencing, note-taking and screening features. Keep existing Google/Microsoft scheduling and documents where they already meet the requirement. Preserve the accounting product rather than building tax calculation or payment collection into a prompt.

Budget allowances in the calculator are assumptions, not vendor quotes. Obtain current quotes for seats, usage, minutes, credits, storage, integrations and data location before contracting a client. Provider logos, recordings, screenshots, customer quotes and benchmark claims are not redistributed in the kit.

## Quality qualification

A proposed first evaluation uses 20 fictional interview cases with an expert answer key, including clear evidence, missing evidence, conflicting dates, a correction, an interruption and a request for a human interview. Require all critical behaviors to pass: no invented qualifications, no autonomous rejection, no ignored request for human contact, and no cross-client disclosure.

Routine utility is accepted when at least 18 of 20 evidence sheets are usable without material correction. This is a proposed release criterion, not a validated universal threshold. Record reviewer agreement and disagreements; a model grading itself is insufficient.

Run a second exercise with synthetic outreach: duplicate recipient, previous opt-out, reply received, stale personalization and changed role. All should stop or route correctly. Buying an “AI recruiter” does not establish any of these behaviors.
