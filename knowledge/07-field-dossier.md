---
title: "Research Dossier — Agentic AI Income Properties"
last_verified: 2026-07-11
review_cycle: quarterly
---

# Research Dossier — Agentic AI Income Properties
**Compiled:** 2026-07-11 · **Method:** live web search + direct page fetches, July 11, 2026. Every claim carries a source URL. Items that could not be confirmed against a primary source are marked **UNVERIFIED**. Conflicting sources are flagged.

---

## 1. AGENT RUNTIMES & TOOLING (state as of July 2026)

### Claude Code (Anthropic)
- Anthropic's terminal-first agentic coding tool; GA since May 2025. Install: `npm install -g @anthropic-ai/claude-code` (native installer now the recommended path). https://www.morphllm.com/install-claude-code
- Usage is included in Claude Pro ($20/mo), Max 5x ($100/mo), Max 20x ($200/mo), Team/Enterprise; API pay-as-you-go also works. https://www.ssdnodes.com/blog/claude-code-pricing-in-2026-every-plan-explained-pro-max-api-teams/
- Plugin system: plugins bundle skills, agents, hooks, and MCP servers; skills are the content, plugins the distribution format. Official marketplace `anthropics/claude-plugins-official` lists 200+ plugins as of July 2026 (~20 first-party incl. 11 language servers, 11 knowledge-work roles); community marketplace `anthropics/claude-plugins-community` uses automated validation/safety screening. https://github.com/anthropics/claude-plugins-official · https://code.claude.com/docs/en/discover-plugins · https://designrevision.com/blog/official-claude-code-plugins
- Model family: Claude Fable 5 + Claude Mythos 5 announced June 9, 2026 — Fable 5 is Anthropic's first publicly available "Mythos-class" model, SOTA on nearly all tested benchmarks; API price $10/M input, $50/M output (90% prompt-cache discount). https://www.anthropic.com/news/claude-fable-5-mythos-5 · https://techcrunch.com/2026/06/09/anthropic-released-claude-fable-5-its-most-powerful-model-publicly-days-after-warning-ai-is-getting-too-dangerous/
- June 12, 2026: US export controls on Fable 5/Mythos 5 forced a temporary access suspension; redeployed with guardrails (queries on some bio/chem topics fall back to Claude Opus 4.8, <5% of sessions), globally available again from July 1, 2026 on Claude.ai, Claude Code, Cowork, API. https://www.anthropic.com/news/redeploying-fable-5 · https://www.infoq.com/news/2026/06/claude-5-release/

### OpenAI Codex / Codex CLI
- Open-source (Apache-2.0) local coding agent in Rust; repo `openai/codex` at 97.1k stars; latest release v0.144.1 (July 9, 2026); CLI + IDE extension + cloud + desktop app surfaces. https://github.com/openai/codex
- Install: `curl -fsSL https://chatgpt.com/codex/install.sh | sh` (also `npm i -g @openai/codex`, Homebrew). https://github.com/openai/codex
- Included in every ChatGPT plan (Free, Go $8, Plus $20, Pro from $100 with 5x/20x tiers, Business/Enterprise); April 2, 2026 pricing moved from per-message to token-based credits aligned with API usage. https://developers.openai.com/codex/pricing · https://uibakery.io/blog/openai-codex-pricing
- With a raw API key, gpt-5.3-codex is $1.75/M input, $0.175/M cached input, $14.00/M output. https://inventivehq.com/blog/codex-cli-pricing-explained

### OpenClaw (formerly Clawdbot → Moltbot)
- Self-hosted open-source personal AI assistant ("Your own personal AI assistant. Any OS. Any Platform. The lobster way."); repo `openclaw/openclaw`, MIT license, **383k stars** (checked 2026-07-11) — most-starred software repo on GitHub. https://github.com/openclaw/openclaw · https://www.the180i.com/openclaw-hits-100k-github-stars-and-signals-a-shift-in-how-ai-assistants-are-built/
- Renamed twice after a trademark dispute with Anthropic: Clawdbot → Moltbot → OpenClaw (CNBC, Feb 2, 2026). https://www.cnbc.com/2026/02/02/openclaw-open-source-ai-agent-rise-controversy-clawdbot-moltbot-moltbook.html
- Install: `npm install -g openclaw@latest` then `openclaw onboard --install-daemon`. Channels: WhatsApp, Telegram, Slack, Discord, Signal, iMessage, Teams, Matrix, Google Chat, IRC, LINE, WeChat, QQ + more; Canvas UI; ClawHub skill registry. https://github.com/openclaw/openclaw
- Security cautions are material: SecurityScorecard found 40,214 internet-exposed instances (Feb 2026, 35.4% flagged vulnerable); one-click RCE CVE-2026-25253 (CVSS 8.8, patched v2026.1.29); 341→800+ malicious skills found on ClawHub; China's MIIT issued a formal risk alert (Feb 5, 2026); Microsoft Security Blog (Feb 19, 2026): "not appropriate to run it on a standard personal or corporate machine." https://www.bitsight.com/blog/openclaw-ai-security-risks-exposed-instances · https://www.betterclaw.io/blog/openclaw-security-2026 · https://blog.cyberdesserts.com/openclaw-malicious-skills-security/
- Ecosystem politics: OpenAI opened ChatGPT subscription auth to OpenClaw's ~3.2M users; Anthropic blocked Claude subscription access to the agent platform. https://thenextweb.com/news/openai-openclaw-chatgpt-subscription-agent

### Nous Research — Hermes Agent
- Open-source "self-improving" agent (MIT), released Feb 2026; repo `NousResearch/hermes-agent` at **213k stars**, v0.18.2 (July 8, 2026). Python. https://github.com/NousResearch/hermes-agent
- Install: `curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash` (Windows: `iex (irm .../install.ps1)`); runs on Linux/macOS/WSL2/Windows/Termux/Docker; "runs on a $5 VPS." https://github.com/NousResearch/hermes-agent
- Differentiator: five-stage learning loop that extracts reusable skills from completed tasks; GEPA self-improvement mechanism (ICLR 2026 Oral) — agents with 20+ self-generated skills reported ~40% faster on repeated tasks. https://www.innobu.com/en/articles/hermes-agent-self-improvement-open-source-2026.html
- Channels: Telegram, Discord, Slack, WhatsApp, Signal, CLI; 300+ LLMs via OpenAI/Anthropic/OpenRouter/Nous Portal; cron scheduler + subagents. Desktop app public preview shipped June 2, 2026 (v0.15.2). https://github.com/NousResearch/hermes-agent · https://medium.com/@tentenco/hermes-agent-desktop-app-everything-you-need-to-know-about-nous-researchs-self-improving-ai-agent-3cb59bd31e5f

### Google Gemini CLI
- Open-source (Apache-2.0) terminal agent; repo `google-gemini/gemini-cli`, npm `@google/gemini-cli`; free tier offered 60 req/min, 1,000 req/day with a personal Google account, Gemini 3 models, 1M-token context. https://github.com/google-gemini/gemini-cli · https://geminicli.com/docs/resources/quota-and-pricing/
- Major 2026 change: on June 18, 2026 Google stopped serving the hosted backend for free users, AI Pro/Ultra subscribers, and individual Code Assist users, steering them to the closed-source Antigravity CLI (Go binary, announced at I/O May 19, 2026). Gemini CLI keeps working with a paid Gemini API key or Vertex AI auth. https://www.techtimes.com/articles/317056/20260523/google-accepted-6000-gemini-cli-contributions-then-closed-tool-enterprise-only.htm · https://ofox.ai/blog/gemini-cli-free-tier-shutdown-fix-2026/

### OpenCode (Anomaly, formerly SST)
- Open-source AI coding agent (CLI/TUI); ~160k GitHub stars, 900 contributors; repo moved to `anomalyco/opencode` after the SST→Anomaly rebrand. https://opencode.ai/ · https://www.developersdigest.tech/blog/opencode-developer-guide-2026
- Install: `curl -fsSL https://opencode.ai/install | bash`. Provider-agnostic: 75+ LLM providers via Models.dev incl. local models; claims no code/context storage. https://opencode.ai/
- Paid plans: OpenCode "Go" $10/mo (curated open-model access; "Zen" = benchmarked model set). Jan 2026: Anthropic forced removal of Claude Pro/Max subscription login (API key still works); OpenAI now partners so ChatGPT subscriptions work natively. https://grokipedia.com/page/opencode · https://aiwiki.ai/wiki/opencode

### MCP (Model Context Protocol) adoption
- Introduced by Anthropic Nov 25, 2024; now stewarded under the Linux Foundation's Agentic AI Foundation; spec release candidate dated 2026-07-28 is published. https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/ · https://www.digitalapplied.com/blog/mcp-adoption-statistics-2026-model-context-protocol
- Scale: 97M monthly SDK downloads (TS+Python, Anthropic figure, March 2026); official registry (registry.modelcontextprotocol.io) ~10k servers; Glama indexes 19,831+, MCP.so 16,000+ (March 2026). https://www.digitalapplied.com/blog/mcp-97-million-downloads-model-context-protocol-mainstream · https://registry.modelcontextprotocol.io/
- Cross-vendor: OpenAI shipped full MCP client support in ChatGPT (late 2025); Google ships official MCP support + managed remote server for Gemini (mid-2026). 2026 roadmap: stateless Streamable HTTP, MCP Server Cards, governance/enterprise readiness. https://workos.com/blog/everything-your-team-needs-to-know-about-mcp-in-2026 · https://www.digitalapplied.com/blog/mcp-adoption-statistics-2026-model-context-protocol

---

## 2. AFFILIATE PROGRAMS — AI / creator tools

| Program | Commission | Recurring? | Cookie window | Direct or network | Source |
|---|---|---|---|---|---|
| Kit (ConvertKit) | 50% for first 12 mo; then tiered 10/15/20% (Bronze 10+/Silver 50+/Gold 100+ referrals/yr) | Yes (indefinite via tiers) | Not stated on official page (3rd parties: 60–90d) | PartnerStack | https://kit.com/affiliates |
| Beehiiv | 50% of referred revenue for 12 mo (cap $15,000/customer) | Yes (12 mo) | 60d, first-touch | Direct (app.beehiiv.com/partner_program) | https://www.beehiiv.com/support/article/23352219299095-getting-started-with-the-beehiiv-partner-program |
| Notion | Up to $50/activated signup + 20% of year-one revenue | Year-one only | 180d, last-click | PartnerStack | https://www.notion.com/affiliates — **program currently closed to new affiliates (verified 2026-07-11)** |
| ElevenLabs | 22% for first 12 mo (11% on Business plan) | Yes (12 mo) | 90d | PartnerStack | https://elevenlabs.io/affiliates · https://market.partnerstack.com/program/elevenlabsinc |
| Semrush | $200/sale + $10/trial (tiers to $450) | No (CPA) | 120d, last-click | Impact | https://www.semrush.com/lp/affiliate-program/en/ · https://wecantrack.com/programs/semrush-affiliate-program/ |
| Hostinger | 40–60% per sale | No (one-time) | 30d | Direct + networks | https://www.hostinger.com/affiliates · https://hostadvice.com/blog/monetization/affiliate-marketing/hostinger-affiliate-program-review/ |
| GoHighLevel | 40% MRR on $97/$297/$497 plans + 5% tier-2 | Yes (while customer active) | 30d first-click (some sources say 90d — **conflicting**) | Direct (own portal) | https://www.gohighlevel.ai/blog/gohighlevel-affiliate-program |
| Skool | 40% MRR for life ($39.60/mo per $99 referral) | Yes (lifetime) | 60d | Direct (via FirstPromoter) | https://www.skool.com/affiliate-program · https://commissiondex.com/programs/skool/ |
| Circle.so | $100 one-time + 10–20% recurring (tiered by volume) | Partially (tiered recurring) | 90d | Direct | https://circle.so/affiliate-program · https://circle.so/affiliate-faqs |
| Make.com | 35% of payments for 12 mo (needs 3 customers to unlock; $100 min payout via Wise) | Yes (12 mo) | Not stated (**UNVERIFIED**) | Direct | https://www.make.com/en/affiliate · https://help.make.com/affiliate-program |
| Zapier | No public affiliate program; Solution Partner/Ambassador tracks via PartnerStack, comp not public | — | — | PartnerStack (invite/apply) | https://community.zapier.com/show-tell-5/does-zapier-have-an-affiliate-program-13950 |
| Descript | $25 flat per new subscription (was 15% recurring; changed early 2024) | No | 90d | PartnerStack | https://www.descript.com/affiliate-terms |
| HeyGen | 25% recurring | Yes | 30d | Network not confirmed (**UNVERIFIED**) | https://aiaffiliateprograms.ai/program/heygen · https://www.affililist.com/affiliate/heygen |
| Gamma | 30% of payments for first 12 mo | Yes (12 mo) | 90d | PartnerStack | https://help.gamma.app/en/articles/11048092-how-do-i-join-the-gamma-affiliate-program · https://openaffiliate.dev/programs/gamma |
| SurferSEO | 25% recurring (some 2026 sources report shift to tiered CPA — **conflicting**) | Yes | 60d | PartnerStack | https://surferseo.com/affiliate-program/ · https://commissiondex.com/programs/surfer-seo/ |
| Frase | 30% recurring for 12 mo (35% at $5k revenue, 40% at $10k) | Yes (12 mo) | 60d | Direct (affiliates.frase.io) | https://www.frase.io/partners/affiliates |
| Writesonic | 30% recurring, lifetime (to 40% top tier) | Yes (lifetime) | Not confirmed | Not confirmed (**roundup-sourced**) | https://www.inkfluenceai.com/blog/best-ai-writing-affiliate-programs-2026 |
| Jasper | 25% recurring for first 12 mo (30% after 100 conversions) | Yes (12 mo) | 30d per trackers (**UNVERIFIED officially**) | PartnerStack | https://www.jasper.ai/legal/affiliates · https://blog.contentgorilla.co/jasper-affiliate-program-complete-2026-guide-commissions/ |
| Durable | Up to 30% of each paid subscription, up to 1 year | Yes (12 mo) | Not stated | Dub.co | https://durable.com/affiliate · https://aiaffiliates.co/durable |
| 10Web | 30% of payments for 12 mo (Platform plans) | Yes (12 mo) | 60d | Impact | https://10web.io/affiliates/ · https://help.10web.io/hc/en-us/articles/4413645644306-Affiliate-Program-Impact |
| Replit | No cash affiliate — referral credits only ($10 credits each side; tier bonuses to $1,000 credits) | No (credits) | n/a | Direct | https://replit.com/refer |
| Cursor | No public affiliate program; gated referral/invite feature for existing subscribers; X posts claim an affiliate perk (50% off first month for referee) — **UNVERIFIED, no official page** | — | — | — | https://forum.cursor.com/t/cursor-referral-program/40555 |
| Lovable | 20% recurring for 12 mo (some third parties cite 30% headline — **conflicting**) | Yes (12 mo) | 60d | Direct (lovable.dev/affiliates) | https://lovable.dev/affiliates · https://taprefer.com/lovable-affiliate-program/lovable/ |
| Perplexity | Comet referral ended Nov 6, 2025; Pro referrals pay small country-based amounts; Dub-hosted affiliate reportedly ~$15/lead (**partially UNVERIFIED**) | No | 90d (reported) | Dub | https://www.perplexity.ai/help-center/en/articles/11385821-partner-promotions-and-referral-programs · https://partners.dub.co/programs/perplexity |
| Vercel | Affiliate program exists (legal terms live); $100 per Pro subscriber per secondary source (**UNVERIFIED officially**); separate v0 Ambassador program | No (CPA) | Not stated | Direct | https://vercel.com/legal/affiliate-marketing-terms · https://www.startuphub.ai/startups/vercel/affiliate-program |
| Supabase | No public affiliate program — partners page covers integrations/experts only; third-party claims of "10–20% recurring" are **UNVERIFIED** | — | — | — | https://supabase.com/partners |
| Framer | 50% of subscription payments for first 12 mo | Yes (12 mo) | 90d | Direct ($200 payout threshold, paid ~2 mo later) | https://www.framer.com/creators · https://www.framer.com/legal/affiliates-terms-and-conditions/ |

**Anthropic (Claude):** No consumer/creator affiliate program exists. The Claude Partner Network (launched June 2026, $100M fund) is an enterprise reseller/SI program (Accenture, Deloitte, PwC tier), not an affiliate scheme. https://www.channelinsider.com/ai/anthropic-claude-partner-network-launch/ · https://customgpt.ai/claude-ai-affiliate-program-alternative/
**OpenAI:** No public affiliate program. OpenAI Partner Network (announced at first partner summit, $150M initial funding) targets enterprise resellers, ISVs, consulting firms — three-tier, certification-based. https://www.channeldive.com/news/openai-partner-network-enterprise-ai-adoption/822958/

**Additional discovered programs that fit "agentic income" positioning:**
- **n8n** (workflow/agent automation): 30% of Cloud subscription for 12 mo; direct program; PayPal payouts, €100 min. https://n8n.io/affiliates/
- **Copy.ai**: 45% recurring for year one (per GetResponse roundup — **verify at signup**). https://www.getresponse.com/blog/best-ai-affiliate-programs
- **Pictory**: 30% recurring, cited as lifetime in roundups (**verify at signup**). https://www.getresponse.com/blog/best-ai-affiliate-programs
- **Speechify**: 50% commission, 90-day cookie (roundup-sourced — **verify at signup**). https://www.text.com/blog/ai-affiliate-programs/
- **InVideo AI**: 50% of first payment (roundup-sourced). https://www.getresponse.com/blog/best-ai-affiliate-programs

---

## 3. MERCHANT OF RECORD & SELF-SERVE PLATFORMS (2026)

| Platform | Fees (headline) | MoR? | Handles EU VAT? | Best for |
|---|---|---|---|---|
| Lemon Squeezy | 5% + $0.50/txn | Yes | Yes | Legacy LS stores; new sellers are routed toward Stripe Managed Payments |
| Stripe Managed Payments (LS successor) | 5% + $0.50/txn (same as LS) | Yes | Yes | Stripe-native SaaS/digital sellers; public preview (invite) since Feb 2026, 35+ countries | 
| Polar.sh | New orgs (≥ May 27, 2026): 5% + $0.50 (Starter). Pre-existing orgs grandfathered at 4% + $0.40 (+0.5% subs). Paid plans: Pro $20/mo, Growth $100/mo, Scale $400/mo. +1.5% non-US cards; $15/dispute | Yes | Yes | Developer-first digital products: license keys, usage-based/LLM billing, GitHub-native; open-source platform (github.com/polarsource/polar) |
| Paddle | 5% + $0.50/txn; FX margin ~2–3% can push effective global rate to ~7%; custom pricing ≥ ~$50k/mo volume | Yes | Yes | Vetted B2B SaaS with global tax exposure; approval process, not instant self-serve |
| Gumroad | 10% + $0.50/txn + card processing (~2.9% + $0.30); 30% on Discover marketplace sales | Yes (handles all sales tax/VAT worldwide since Jan 1, 2025) | Yes | Zero-setup storefront for audience-first creators; highest take rate (~13–19% all-in) |
| Whop | 3% platform fee on community-gated products + processing 2.7% + $0.30; add-ons: tax remittance +0.5%, orchestration +0.8%, billing +0.5%; intl cards +1.5%; all-in often ~6–7%. Marketplace commission (was 30%) removed May 2025 | Yes, when tax handling activated (via Numeral, 190+ countries) | Yes (when activated) | Paid communities/memberships + digital products with marketplace distribution |

Sources: https://www.lemonsqueezy.com/blog/2026-update · https://www.lemonsqueezy.com/blog/stripe-acquires-lemon-squeezy · https://polar.sh/docs/merchant-of-record/fees · https://dodopayments.com/blogs/polar-sh-review · https://www.paddle.com/pricing · https://dodopayments.com/blogs/paddle-fees-explained · https://gumroad.com/pricing · https://checkoutpage.com/blog/gumroad-fees · https://docs.whop.com/fees · https://dodopayments.com/blogs/whop-fees-explained · https://www.whatpayment.com/en/guides/whop-merchant-of-record/

**Recommendation (agent packs / templates / digital kits, 2026):** Polar.sh is the strongest default: it is a true merchant of record (handles EU VAT and global sales tax as the legal seller), is open-source and API/SDK-first (checkout links, license keys, file downloads, GitHub integration, usage-based billing designed for AI products), and its pricing (5% + $0.50 Starter, cheaper on paid plans; 4% + $0.40 for pre-May-2026 orgs) undercuts Gumroad's ~13–19% all-in while matching Paddle without Paddle's vetting friction — Paddle is optimized for recurring SaaS, not one-off template packs. Lemon Squeezy is now effectively a migration path into Stripe Managed Payments (still invite-gated public preview in early 2026), so building new on it adds transition risk. Whop is the right second surface when the product is a community + product bundle and you want its marketplace distribution; Gumroad remains the fastest zero-code fallback but the priciest per sale. A common 2026 pattern for this niche: Polar for the product catalog and licensing, Whop or Skool for the paid community layer.

---

## 4. MARKET CONTEXT STATS (2026) — verified, for copy

1. **Gartner:** 40% of enterprise applications will feature task-specific AI agents by end of 2026, up from <5% in 2025. https://www.gartner.com/en/newsroom/press-releases/2025-08-26-gartner-predicts-40-percent-of-enterprise-apps-will-feature-task-specific-ai-agents-by-2026-up-from-less-than-5-percent-in-2025
2. **Gartner (caution stat):** over 40% of agentic AI projects are expected to be canceled by end-2027 (cost, unclear value, risk). https://onereach.ai/blog/agentic-ai-adoption-rates-roi-market-trends/
3. **AI agents market size:** ~$10.9–12B in 2026, forecast to ~$48–53B by 2030 (43–46% CAGR; Grand View, MarketsandMarkets, BCC). https://www.grandviewresearch.com/industry-analysis/ai-agents-market-report · https://www.marketsandmarkets.com/PressReleases/ai-agents.asp
4. **Creator economy:** Goldman Sachs projects ~$480B by 2027 (from $250B baseline), with ~50M creators growing 10–20%/yr; 2026 interpolations put it around ~$300B+. https://www.goldmansachs.com/insights/articles/the-creator-economy-could-approach-half-a-trillion-dollars-by-2027
5. **Creators using AI:** Adobe's June 2026 Creators' Toolkit report (16,000+ creators, 8 countries): ~86% of creators use generative AI in workflows; 87% of those say it grew their business or audience. https://news.adobe.com/news/2026/06/creators-toolkit-report-2026 · https://dataconomy.com/2026/06/17/creators-using-creative-generative-ai-86-percent/
6. **Frequency:** Kit's 2026 "State of AI in the Creator Economy" survey (550 creators, April 2026): 71.7% use AI at least weekly; majority daily. https://kit.com/resources/blog/ai-creator-economy-report
7. **Solopreneurs:** ~29.8M US nonemployer (solo) businesses generating ~$1.7T revenue (Census nonemployer data); solo-founded startups rose from 23.7% to 36.3% of new startups since 2019. https://crevio.co/blog/solopreneur-statistics · https://autofaceless.ai/blog/solopreneur-statistics-2026 · https://fortune.com/2026/05/18/solo-founders-ai-automation-entire-teams-entrepreneurs/
8. **SMB adoption:** 51% of US businesses under 500 employees report AI use in 2026; ~38% of SMBs have adopted AI automation (vs ~72% of large enterprises); Upwork's SMB study: 41% piloting AI agents for decision support, 62% of SMB leaders "very/extremely confident" delegating high-stakes tasks to agents. https://medhacloud.com/blog/ai-adoption-statistics-2026 · https://www.upwork.com/resources/state-of-ai-in-smbs
9. **Coding-agent economics:** Claude Code reportedly passed $1B annualized revenue ~6 months after its May 2025 GA and ~$2.5B run-rate by Feb 2026 (secondary sources); Anthropic confirmed a $30B revenue run-rate (April 2026) after "80x growth," and a $30B Series G at $380B post-money valuation. https://stormy.ai/blog/claude-code-gtm-strategy-anthropic-revenue-2026 (secondary) · https://venturebeat.com/technology/anthropic-says-it-hit-a-30-billion-revenue-run-rate-after-crazy-80x-growth · https://www.anthropic.com/news/anthropic-raises-30-billion-series-g-funding-380-billion-post-money-valuation
10. **MCP scale:** 97M monthly SDK downloads (March 2026, Anthropic figure) — adoption pace compared to React's. https://www.digitalapplied.com/blog/mcp-97-million-downloads-model-context-protocol-mainstream

---

## 5. COMPETITIVE LANDSCAPE — "make money with AI/agents" education (2026)

1. **AI Automation Society / AIS+ (Nate Herk, Skool):** free community 423k+ members; AIS+ $99/mo (~3.8k members) or $839/yr Premium; n8n-centric courses + templates. Differentiation gap: single-tool (n8n) lens, agency-service framing, thin on open-source agent runtimes and product/affiliate economics. https://www.skool.com/ai-automation-society/about · https://skoolmakers.com/creators/nate-herk/
2. **AI Automation Agency Hub + AAA Accelerator (Liam Ottley/Morningside AI):** free hub (60+ hrs video, 50+ templates) funneling to $97–197/mo and a $5,000–7,150 high-ticket accelerator sold by phone. Gap: high-ticket sales-call model, client-services (AAA) focus rather than products/open-core. https://onlinetrainingreviewer.com/reviews/aaa-accelerator-review-liam-ottley · https://www.liamottley.com/
3. **The Rundown University (Rundown AI):** free daily newsletter 2M+ subs funds the brand; University at $84/mo billed annually (~$1,008/yr; some report $99/mo) for courses/community/certificates. Gap: broad AI upskilling, not an income-system playbook; no code-level agent depth. https://www.readless.app/blog/is-the-rundown-ai-newsletter-free-2026 · https://www.therundown.ai/subscribe
4. **Ben's Bites (Ben Tossell):** free newsletter (~120–163k subs) + Pro/lifetime (~$150–250) + courses (20k+ students); builder/tool-review angle. Gap: news-and-analysis first; monetization education is secondary. https://pro.bensbites.co/ · https://growthinreverse.com/bens-bites/
5. **Superhuman AI (Zain Kahn):** free daily brief, 1.5M+ subs (self-claims 2M+), six-figure monthly ad revenue — pure media model. Gap: 3-minute news format, no hands-on build path. https://www.superhuman.ai/ · https://www.readless.app/blog/superhuman-ai-newsletter-review-2026
6. **Julian Goldie (AI money/SEO Skool communities):** teaches "make money with AI + Skool" via YouTube/Skool funnels; pricing varies by community (**pricing UNVERIFIED**). Gap: SEO/volume-content oriented; agent tooling coverage is shallow. https://juliangoldie.com/make-money-with-ai-and-skool/
7. **Whop/Skool marketplace communities (category):** hundreds of paid "AI income" communities ($9–$199/mo) distributed via Whop and Skool discovery; quality highly variable — a trust/verification gap an evidence-first open-core property can exploit. https://whop.com/blog/where-to-sell-digital-products/ · https://www.skool.com/business-ideas/easy-new-business-idea-for-2025-skool-community-affiliates

---

## 6. REGULATORY / TRUST NOTES

- **FTC Endorsement Guides (16 CFR Part 255, revised 2023):** any material connection — including affiliate commissions — must be disclosed "clearly and conspicuously" (difficult to miss, easily understood); on social/interactive media the disclosure must be "unavoidable," and it applies each time the endorsement appears. https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking · https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-255
- **FTC Consumer Reviews & Testimonials Rule (Aug 2024, 16 CFR Part 465):** bans fake or AI-generated reviews/testimonials and review gating, with civil penalties up to $51,744 per violation — directly relevant to AI-tool review content. https://www.ftc.gov/business-guidance/advertising-marketing/endorsements-influencers-reviews · https://gordonlaw.com/learn/ftc-endorsement-guidelines/
- **Operation AI Comply (FTC, launched Sept 2024) continues under the new administration into 2025–26:** 2025 actions against Click Profit and Workado targeted baseless "AI passive income" claims; AI-attached earnings claims are described as the highest-risk category — never publish unsubstantiated income claims or uncaveated case studies. https://www.beneschlaw.com/insight/one-year-in-ftcs-operation-ai-comply-continues-under-new-administration-signaling-enduring-enforcement-focus/ · https://www.ftc.gov/news-events/news/press-releases/2024/09/ftc-announces-crackdown-deceptive-ai-claims-schemes
- **EU AI Act Article 50 transparency obligations apply from Aug 2, 2026:** chat-style AI must disclose it is AI; generative outputs need machine-readable "AI-generated" marking (the May 2026 AI Omnibus gives systems already on the market until Dec 2, 2026 for marking); deepfakes must be labeled; penalties up to €15M or 3% of worldwide turnover. Educational sites deploying chatbots or publishing AI-generated media for EU users are in scope as deployers. https://datamatters.sidley.com/2026/06/24/eu-ai-act-transparency-obligations-preparing-for-compliance-by-2-august-2026/ · https://artificialintelligenceact.eu/article/50/
- **EC Code of Practice on Transparency of AI-Generated Content (in development):** distinguishes "fully AI-generated" vs "AI-assisted" content with different labeling duties (persistent video labels, visible image labels, audible audio disclaimers) — plan content pipelines to record AI-assistance provenance now. https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content · https://www.techpolicy.press/the-eus-ai-transparency-code-of-practice-explained/

---

*End of dossier. All URLs accessed 2026-07-11. Conflicts and UNVERIFIED items are marked inline; re-verify commission terms at signup time since programs change without notice (Descript's 2024 flat-fee switch and Notion's 2026 program closure are recent examples).*
