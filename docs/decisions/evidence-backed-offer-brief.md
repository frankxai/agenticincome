# Agentic Income • Evidence-backed offer briefs

Decision as of 19 November 2026. The first release candidate serves a founder or independent consultant deciding whether a specific customer observation justifies an offer. The unit of value is an editable experiment brief that can be taken back to a buyer. Commercial acceptance requires a paid order, a delivered file and a buyer who finds it useful.

## Product decision

Relative judgments about this audience, distribution and the current codebase follow. Willingness to pay for the new workflow is unmeasured. The alternatives describe potential businesses.

| Decision criterion | A · Economic intelligence | B · Venture builder | C · Business control center | D · Evidence-backed offer briefs |
|---|---|---|---|---|
| Urgency and payment | A research question is episodic. Ongoing data must earn renewal. | Founders need a launch, but implementation varies by business. | An operating company can budget for failures and reconciliation. | A sales conversation creates an immediate deadline. Test the existing one-off pack. |
| Advantage over a general assistant | Dated, rights-cleared research creates value. | Generic business plans are easy to substitute. | Integrations and correct approval state matter more than chat quality. | Attach each claim to an inspectable source, recompute economics and export a test. |
| Distribution | FrankX research, site search and existing editorial. | Founder workshops and existing skills. | Requires access to operational teams and accounts. | Existing challenge, workbench, Blueprint preview and founder sessions reach the same buyer. |
| Engineering and cost | Recurring acquisition, rights checks and curation. | Sandbox, connectors, recovery and support expand with scope. | Tenant isolation, migrations, monitoring and incident response. | Browser computation and one stateless MCP tool reuse current delivery infrastructure. |
| First value | Fast to read, harder to act. | Time depends on integrations. | Value starts after connecting systems. | One source and one downloadable brief in a session. |
| Repeat use | Market changes create a return reason. | Launches are intermittent. | Daily as long as the business depends on it. | Revise after the next buyer conversation. Repeat demand still needs measurement. |
| Defensible data or workflow | Verify an accumulating evidence archive. | Vertical delivery and acceptance history. | Longitudinal operational evidence, costly to obtain. | Consented observations linking hypotheses, actual tests and accepted purchases. Browser drafts alone create no proprietary dataset. |
| Starlight fit | Private curation already exists. | Portable skills and scoped tools fit. | Shared infrastructure exists, customer access policies need work. | A portable procedure and versioned tool compose with the existing graph without a new runtime. |
| Long-term economics | Research subscriptions need unique coverage and renewal. | Services can monetize early with a substantial support floor. | Potential retention comes with continuing operating liabilities. | Sell reusable implementation depth, measure support cost, then test demand for repeat runs. |

A supplies research inputs. B becomes the implementation service for customers who need it. C becomes worthwhile when repeated paid work produces records to reconcile. D earns the first position because it connects an immediate decision to the site's existing commercial asset with a bounded support obligation. A generic news feed or venture chat would add a second destination before demonstrating better decisions.

[Owner's offer-workbench decision and self-service preference](https://github.com/frankxai/agenticincome/issues/70) · [Prior Source-to-Brief candidate](https://github.com/frankxai/agenticincome/pull/52) · [Commerce dependency](https://github.com/frankxai/agenticincome/issues/48) · [Shared recipe](https://github.com/frankxai/starlightintelligence.ai/pull/128)

## Product and route map

| Access | Routes and capabilities | Acceptance |
|---|---|---|
| Public discovery, existing | /, /start, /blog and its articles, /tools, /gifts, /trust, /disclosure, /privacy, /design | Discover an offer, open its sample, inspect source or disclosure. |
| Public execution, candidate | /workbench/offer-brief, linked from /, /workbench and /challenge | Supply source material and assumptions, inspect cited evidence and economics, export an editable experiment. |
| Public execution, existing | /workbench, /challenge, /build, /build/request-to-quote, /pack, /mcp, /.well-known/mcp.json, /api/mcp | Model a venture, inspect a scope, install the existing pack, call domain tools or download local work. |
| Product and implementation | /offers, /offers/[slug], /offers/implementation-sprint | Inspect exact files and service scope. The existing Blueprint lists at $67. Other displayed prices are proposals or staged catalog offers. |
| Fulfillment | /api/checkout, /checkout/success, /delivery/starter-kit and gated /delivery/[slug] | Free retrieval is public. A genuine paid checkout must grant the private benefit, support recovery and honor revocation. A delivery page visit proves neither payment nor acceptance. |
| Operations and proof, existing | /operate, /proof, /command, /readiness and /api/readiness | Documentation, illustrative command screen, system and launch status. The command screen has no customer account or live fleet. |
| Affiliate and adjacent properties | /atlas redirect; go.agenticincome.ai; agenticpassiveincome.com | Preserve disclosed routing and the separate owned-asset business. |
| Registered, proposed | Workspace with saved brief revisions, team review and deletion/export | Introduce after repeat users request cross-device recovery. Two isolated tenants must pass before holding private briefs. |
| Paid intelligence, proposed | Licensed source packs and dated updates attached to a specific offer decision | Release individually after a paid, accepted edition establishes demand and update costs. |
| Metered execution, proposed | User-approved jobs with atomic budget reservation, trace, idempotent retries, terminal receipt and private delivery | Adopt after measured accuracy gains cover hosted inference and support. |
| Advanced and enterprise, proposed | Reviewer roles, organization-level limits, audit export, partner-operated validation cohorts | A named buyer, contractual scope and successful isolation and revocation tests precede activation. |

No new SKU, trial, subscription or public income claim is authorized by this decision. Use the existing one-time Blueprint to validate depth. For the first five consenting users, record whether they export, run their experiment within seven days, buy, receive the private pack and return with buyer evidence. Interview users who abandon the offer after preview. Continue a paid experiment once one buyer pays and accepts. Treat five fulfilled and useful purchases with positive contribution as a reason to test more distribution. These are proposed decision thresholds, not customer results.

## Runtime and data architecture

| Layer | Choice for this increment | Decision to revisit |
|---|---|---|
| App and distribution | Keep Next.js App Router, Vercel native Git, current design primitives, catalog and purchase flow. A dedicated workbench route is reachable from the homepage. | Separate runtime only after evidence of a separate isolation or availability requirement. |
| Intelligence | The browser and MCP call one typed domain function. The browser has no model bill. An external MCP-capable model can synthesize an offer from supplied evidence and call the tool to ground, calculate and draft. The model's assumptions remain visible. | A hosted model earns its place by outperforming the local path on blinded source-grounding and revision-effort tests. |
| Providers | Retain the caller's choice of OpenAI, Anthropic or Gemini. Benchmark them on the same redacted corpus. Consider Workers AI for inexpensive extraction after measuring factuality. No named provider is presumed cheaper or more accurate for this task. | Vercel AI SDK is a reasonable single server adapter when tenant and spend admission are ready. No duplicate agent framework in the browser. |
| Persistence | User-owned exports for this release. Do not send a brief or its economics to analytics. MCP clients choose what they transmit and retain. | Supabase Auth and Postgres for saved briefs only after authenticated ownership, tested RLS, recovery and deletion exist. Existing service-only entitlements and private research tables are not user workspaces. |
| Long-running work | No shared queue or persistent agent needed to compile one brief. | Cloudflare Workers and Agents SDK with Durable Objects fit an agent that must survive reconnects. Workflows fit multi-step fulfillment. Pick one owner for each job and its retries. |
| Structured interfaces | Render the typed brief as an artifact with evidence, figures and a decision. CopilotKit/AG-UI adds little to a single local action. | Consider AG-UI when a user needs to inspect or interrupt a multi-step remote run. |
| Money and measurement | Polar remains merchant of record. Preserve free delivery and the closed paid path until verified. Keep the existing first-party event adapter. The workflow event contract permits a route and timestamp only. | Use a verified merchant order, idempotent fulfillment and customer acceptance to establish revenue. An export or analytics event cannot grant access. |

Canonical app source is frankxai/agenticincome. Its native Git deployment serves www.agenticincome.ai. Agentic-Income/agenticincome is a separate, fast-forward mirror. frankxai/go-agenticincome owns the referral router. The November inspection found shared Cloudflare Workers, Durable Objects and Workflows and shared Starlight Postgres infrastructure. None is a prerequisite for issuing a local brief.

[Site deployment contract](../../SYSTEM.md) · [Git mirror contract](../../.github/workflows/org-mirror.yml) · [Vercel AI SDK](https://vercel.com/docs/ai-sdk) · [Cloudflare Agents](https://developers.cloudflare.com/agents/) · [AG-UI](https://docs.ag-ui.com/introduction) · [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) · [Polar sandbox](https://polar.sh/docs/integrate/sandbox)

## Interface research

| Reference | Design decision |
|---|---|
| Koyfin financial workspace | Show units and assumptions together and let the user inspect what changed the result. Keep headline economics reproducible. |
| Linear | One experiment has one identity and explicit next action. Keep status readable at small sizes. |
| Our World in Data | Carry sources and units into the export. Give each visualization a question and a readable textual equivalent. |
| Elicit | Keep citations beside the individual assertion. Distinguish an observation from the commercial hypothesis it inspired. |
| Agentic Income's existing design system | Preserve its dark neutral work surface, restrained signal color, numeric type and pinned references. The editor and artifact carry the composition. |

[Koyfin](https://www.koyfin.com/help/getting-started-with-koyfin/) · [Linear](https://linear.app/docs/conceptual-model) · [Our World in Data](https://ourworldindata.org/redesigning-our-interactive-data-visualizations) · [Elicit](https://elicit.com/solutions/research-agent) · [Site design contract](../../DESIGN.md) · [Refero workspace reference](https://refero.design/pages/cdafc3c4-560e-4d35-a4ad-274c5b807fa9)

## Rollout, evaluation and ownership

Preview the isolated branch, compare the actual browser export with the entered source, verify MCP discovery and a real call, and test the same source with changed economics. Require 100% literal source references, correct arithmetic including unfavorable scenarios, valid output shape and no unauthorized side effects in release fixtures. A small synthetic fixture pass establishes deterministic behavior. Model-wide factuality needs a held-out corpus, blinded review and observed runs by provider. Do not make a field performance claim from a lab run.

Leave production on the last accepted revision until the tested head passes release checks and Frank approves promotion. The existing merchant remains separately gated. Reverting the feature commit removes the new public surface and leaves customer exports in their owners' hands. The independent checkout privacy change can be evaluated and reverted separately.
