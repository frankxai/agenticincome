---
title: "Research Dossier — Agentic AI Income Properties"
last_verified: 2026-09-28
review_cycle: quarterly
---

# Research Dossier — Agentic AI Income Properties
**Compiled:** 2026-07-11 · **Re-verified:** 2026-09-28 · **Method:** live web search + direct page fetches (official pages, GitHub API, registry APIs). Every claim carries a source URL. Items that could not be confirmed against a primary source are marked **UNVERIFIED**. Conflicting sources are flagged.

---

## 1. AGENT RUNTIMES & TOOLING (state as of September 2026)

### Claude Code (Anthropic)
- Anthropic's terminal-first agentic coding tool; GA since May 2025. Recommended install: `curl -fsSL https://claude.ai/install.sh | bash` (Windows PowerShell: `irm https://claude.ai/install.ps1 | iex`); Homebrew/WinGet also supported; `npm install -g @anthropic-ai/claude-code` remains an advanced option (Node 22+). https://code.claude.com/docs/en/setup
- Usage is included in Claude Pro ($20/mo), Max (from $100/mo), Team/Enterprise; API pay-as-you-go also works. https://claude.com/pricing
- Plugin system: plugins bundle skills, agents, hooks, and MCP servers; skills are the content, plugins the distribution format. Official marketplace `anthropics/claude-plugins-official` lists 314 plugins (checked 2026-09-28), including 39 first-party plugins; the community marketplace `anthropics/claude-plugins-community` is now a read-only mirror, with submissions via Anthropic's plugin-directory form. https://github.com/anthropics/claude-plugins-official · https://github.com/anthropics/claude-plugins-community · https://code.claude.com/docs/en/discover-plugins
- Model family (Sept 2026): Claude Fable 5.1 ($10/M input, $50/M output), Opus 5.5 (released Sept 22, 2026; $4/$20), Sonnet 5 ($2/$10), Haiku 4.5 ($1/$5); Fable 5, Opus 5 and Opus 4.8 are now legacy. Fable 5 — announced with Mythos 5 on June 9, 2026 — was Anthropic's first publicly available "Mythos-class" model (Mythos 5 itself is restricted to partners). https://platform.claude.com/docs/en/about-claude/models/overview · https://platform.claude.com/docs/en/about-claude/pricing · https://www.anthropic.com/news/claude-fable-5-mythos-5
- June 12, 2026: US export controls on Fable 5/Mythos 5 forced a temporary access suspension; Fable 5 was redeployed with safeguard classifiers (covering cyber, bio/chem and distillation; flagged queries fall back to Claude Opus 4.8) and was globally available again from July 1, 2026. https://www.anthropic.com/news/redeploying-fable-5

### OpenAI Codex / Codex CLI
- Open-source (Apache-2.0) local coding agent in Rust; repo `openai/codex` at ~127k stars, latest release rust-v0.158.0 (both checked 2026-09-28); CLI + IDE extension + cloud + desktop app surfaces. https://github.com/openai/codex
- Install: `curl -fsSL https://chatgpt.com/codex/install.sh | sh` (Windows: `irm https://chatgpt.com/codex/install.ps1 | iex`; also `npm i -g @openai/codex`, `brew install --cask codex`). https://github.com/openai/codex
- Included in every ChatGPT plan (Free, Go $8, Plus $20, Pro from $100 with 5x/20x tiers, Business/Enterprise/Edu); from April 2, 2026 usage moved from per-message to token-based credits aligned with API usage. https://learn.chatgpt.com/docs/pricing
- With a raw API key, gpt-5.3-codex is $1.75/M input, $0.175/M cached input, $14.00/M output (newer GPT-6-family models have since been added to Codex). https://developers.openai.com/api/docs/models/gpt-5.3-codex

### OpenClaw (formerly Clawdbot → Moltbot)
- Self-hosted open-source personal AI assistant; repo `openclaw/openclaw`, MIT license, now stewarded by the OpenClaw Foundation; **~391k stars** (checked 2026-09-28) — the most-starred AI agent project on GitHub. https://github.com/openclaw/openclaw
- Renamed twice after a trademark dispute with Anthropic: Clawdbot → Moltbot → OpenClaw (CNBC, Feb 2, 2026). https://www.cnbc.com/2026/02/02/openclaw-open-source-ai-agent-rise-controversy-clawdbot-moltbot-moltbook.html
- Install: `npm install -g openclaw@latest --allow-scripts=openclaw` then `openclaw onboard --install-daemon`. Channels: WhatsApp, Telegram, Slack, Discord, Signal, iMessage, Teams, Matrix, Google Chat and more (20+ platforms); Canvas UI; ClawHub skill registry. https://github.com/openclaw/openclaw
- Security cautions are material: SecurityScorecard found 40,214 internet-exposed instances (Feb 2026); one-click RCE CVE-2026-25253 (CVSS 8.8, patched v2026.1.29); 341 malicious skills found on ClawHub, later 800+; China's MIIT issued a formal risk alert (Feb 5, 2026); Microsoft Security Blog (Feb 19, 2026): "not appropriate to run it on a standard personal or corporate machine." https://securityscorecard.com/blog/beyond-the-hype-moltbots-real-risk-is-exposed-infrastructure-not-ai-superintelligence/ · https://app.opencve.io/cve/CVE-2026-25253 · https://www.koi.ai/blog/clawhavoc-341-malicious-clawedbot-skills-found-by-the-bot-they-were-targeting · https://www.microsoft.com/en-us/security/blog/2026/02/19/running-openclaw-safely-identity-isolation-runtime-risk/
- Ecosystem politics: OpenAI opened ChatGPT subscription auth to OpenClaw's ~3.2M users; Anthropic blocked Claude subscription access (April 2026; API keys are the supported route). https://thenextweb.com/news/openai-openclaw-chatgpt-subscription-agent · https://docs.openclaw.ai/providers/anthropic

### Nous Research — Hermes Agent
- Open-source "self-improving" agent (MIT), released Feb 2026; repo `NousResearch/hermes-agent` at **~250k stars**, v0.21.5 (Sept 24, 2026). Python. https://github.com/NousResearch/hermes-agent
- Install: `curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash` (Windows: `iex (irm .../install.ps1)`); runs on Linux/macOS/WSL2/Windows/Termux/Docker; "runs on a $5 VPS." https://github.com/NousResearch/hermes-agent
- Differentiator: a built-in learning loop that extracts reusable skills from completed tasks; a separate Nous repo applies GEPA (a third-party prompt-evolution method, ICLR 2026 Oral) for self-improvement. https://github.com/NousResearch/hermes-agent · https://iclr.cc/virtual/2026/oral/10009494
- Channels: Telegram, Discord, Slack, WhatsApp, Signal, Email, CLI; 300+ LLMs via OpenAI/Anthropic/OpenRouter/Nous Portal; cron scheduler + subagents. Desktop app public preview shipped June 2026. https://github.com/NousResearch/hermes-agent

### Google Gemini CLI
- Open-source (Apache-2.0) terminal agent; repo `google-gemini/gemini-cli`, npm `@google/gemini-cli`. https://github.com/google-gemini/gemini-cli
- Major 2026 change: on June 18, 2026 Google stopped serving the hosted backend for free users, AI Pro/Ultra subscribers, and individual Code Assist users, steering them to the new Antigravity CLI. Gemini CLI keeps working with a paid Gemini API key or Vertex AI auth. https://geminicli.com/docs/resources/quota-and-pricing/ · https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/

### OpenCode (Anomaly, formerly SST)
- Open-source AI coding agent (CLI/TUI); ~210k GitHub stars (checked 2026-09-28), ~950 contributors; repo moved to `anomalyco/opencode` after the SST→Anomaly rebrand. https://github.com/anomalyco/opencode · https://opencode.ai/
- Install: `curl -fsSL https://opencode.ai/v2/install | bash`. Provider-agnostic: 75+ LLM providers via Models.dev incl. local models; claims no code/context storage. https://opencode.ai/
- Paid plans: OpenCode "Go" $10/mo (curated open-model access), "Go Plus" $40/mo. Early 2026: Claude Pro/Max subscription login was removed at Anthropic's request (API key still works); ChatGPT Plus/Pro login works natively. https://opencode.ai/go · https://opencode.ai/

### MCP (Model Context Protocol) adoption
- Introduced by Anthropic Nov 25, 2024; donated Dec 9, 2025 to the Linux Foundation's Agentic AI Foundation; the 2026-07-28 spec version was released July 28, 2026. https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation · https://blog.modelcontextprotocol.io/
- Scale: 97M+ monthly SDK downloads (TS+Python) at the Dec 2025 donation; "close to half-a-billion downloads a month" by the July 2026 spec release; the official registry (registry.modelcontextprotocol.io) lists ~37k server entries (checked 2026-09-28). https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation · https://blog.modelcontextprotocol.io/ · https://registry.modelcontextprotocol.io/
- Cross-vendor: OpenAI ships MCP client support in ChatGPT (developer mode; full write access on Business/Enterprise/Edu); Google launched official MCP support with managed remote servers in late 2025 (50+ Google-managed servers). https://help.openai.com/en/articles/12584461-developer-mode-and-mcp-apps-in-chatgpt · https://cloud.google.com/blog/products/ai-machine-learning/announcing-official-mcp-support-for-google-services

---

## 2. AFFILIATE PROGRAMS — AI / creator tools

| Program | Commission | Recurring? | Cookie window | Direct or network | Source |
|---|---|---|---|---|---|
| Kit (ConvertKit) | 50% for first 12 mo; then tiered 10/15/20% (Bronze 10+/Silver 50+/Gold 100+ referrals/yr) | Yes (indefinite via tiers) | Not stated on official page (3rd parties: 60–90d) | PartnerStack | https://kit.com/affiliates |
| Beehiiv | 50% of referred revenue for 12 mo (cap $15,000/customer) | Yes (12 mo) | 60d, first-touch | Direct (app.beehiiv.com/partner_program) | https://www.beehiiv.com/support/article/23352219299095-getting-started-with-the-beehiiv-partner-program |
| Notion | Up to $50/activated signup + 20% of year-one revenue | Year-one only | 180d, last-click | PartnerStack | https://www.notion.com/affiliates — **closed to new affiliates**: the live page reads "Program is currently not accepting new affiliates" (checked 2026-09-29; also closed on 2026-07-11). Terms shown are the published ones for existing affiliates. Last-click per the official FAQ: "Commissions are paid on a last-click basis" |
| ElevenLabs | 22% for first 12 mo (11% on Business plan) | Yes (12 mo) | Not stated officially (3rd parties: 90d) | PartnerStack | https://elevenlabs.io/affiliates-terms · https://market.partnerstack.com/program/elevenlabsinc |
| Semrush | Per-product CPA: $300 (Semrush One), $200 (SEO Toolkit, Traffic & Market), $100 (AI Visibility/Content/Ads), $50 (Local/Social) + $10/trial | No (CPA) | 120d, last-click | Impact | https://www.semrush.com/lp/affiliate-program/en/ |
| Hostinger | Starts at 40%, grows with sales volume | No (one-time) | Not stated officially (3rd parties: 30d) | Direct | https://www.hostinger.com/affiliates |
| GoHighLevel | 40% recurring ("lifetime commissions") | Yes (while customer active) | Not stated officially (**UNVERIFIED**) | FirstPromoter | https://www.gohighlevel.com/affiliateoffers |
| Skool | 40% MRR for life | Yes (lifetime) | 14d, last-touch | Direct | https://www.skool.com/affiliate-program · https://help.skool.com/article/33-how-to-refer-others-to-skool |
| Circle.so | $100 one-time + 10/15/20% recurring on Standard plans (0–9 / 10–49 / 50+ customers; 5–10% on Circle Plus); recurring only for customers referred after June 24, 2026 | Partially (tiered recurring) | 90d | PartnerStack | https://circle.so/affiliate-program |
| Make.com | 35% of payments for 12 mo (payout requires 3 paying users and $100 minimum, via Wise) | Yes (12 mo) | 30d | Direct | https://www.make.com/en/affiliate · https://help.make.com/affiliate-program |
| Zapier | No public affiliate program; Solution Partner/Ambassador tracks via PartnerStack, comp not public | — | — | PartnerStack (invite/apply) | https://community.zapier.com/show-tell-5/does-zapier-have-an-affiliate-program-13950 |
| Descript | $25 flat per new subscription (was 15% recurring; changed early 2024) | No | 30d from first click | PartnerStack | https://www.descript.com/affiliate-terms |
| HeyGen | Social Creator Program: 35% recurring for 3 mo (5K+ followers, video creators); a separate Rewardful-hosted affiliate program's terms could not be read (**UNVERIFIED**) | Yes (3 mo) | 30d | Rewardful / direct | https://www.heygen.com/affiliate-program |
| Gamma | Rate not published officially (3rd parties: 30% for 12 mo — **UNVERIFIED**) | — | 60d per Gamma's affiliate terms (PartnerStack boilerplate says 90d — **conflicting**) | PartnerStack | https://help.gamma.app/en/articles/11048092-how-do-i-join-the-gamma-affiliate-program |
| SurferSEO | One-time CPA: 75/100/125% of the first monthly payment (Starter/Silver/Gold) or 15/20/25% of the first annual payment | No | 90d | PartnerStack | https://surferseo.com/affiliate-program/ |
| Frase | 30% recurring for 12 mo (higher rates possible for top affiliates, not published) | Yes (12 mo) | 60d | FirstPromoter | https://www.frase.io/partners/affiliates |
| Writesonic | 20% of every payment for up to 12 mo | Yes (12 mo) | 60d, last-click | FirstPromoter | https://writesonic.com/affiliate |
| Jasper | 25% recurring for first 12 mo (30% after 100 leads and 100 conversions in a rolling 12 mo; Creator/Teams plans only) | Yes (12 mo) | 14d from first click | FirstPromoter | https://www.jasper.ai/legal/affiliates |
| Durable | Up to 30% of each paid subscription, up to 1 year | Yes (12 mo) | Not stated | Dub.co | https://durable.com/affiliate |
| 10Web | 30% of payments for 12 mo (Platform plans) | Yes (12 mo) | Not re-verified (help article inaccessible 2026-09-28) | Impact | https://10web.io/affiliates/ · https://help.10web.io/hc/en-us/articles/4413645644306-Affiliate-Program-Impact |
| Replit | No cash affiliate — referral credits only ($20 credits each side per paying referral; tiers: 5 referrals = $100, 50 = $1,000 in credits) | No (credits) | n/a | Direct | https://replit.com/refer |
| Cursor | No cash affiliate program. Limited-release referral program confirmed by Cursor staff (May 2026): referee gets 50% off first month of Pro/Pro+/Ultra; referrer gets $25 usage credit per paid referral, max 10 per cycle | No (credits) | — | Direct | https://forum.cursor.com/t/cursor-referral-program/40555 |
| Lovable | Up to $100 per first-time subscriber (one-time bounty) | No | Not stated officially | Impact | https://lovable.dev/partners/affiliates |
| Perplexity | Referral program reported closed to new referrals since Nov 6, 2025; runs on Dub Partners; payout amounts not published officially (**UNVERIFIED**) | No | — | Dub | https://partners.dub.co/programs/perplexity |
| Vercel | Affiliate program exists (legal terms live; fees are one-time unless stated otherwise); rate not published officially (**UNVERIFIED**) | No (CPA) | Not stated | Dub (administered by Dub Technologies) | https://vercel.com/legal/affiliate-marketing-terms |
| Supabase | No public affiliate program — partners page covers integrations/experts only; third-party claims of "10–20% recurring" are **UNVERIFIED** | — | — | — | https://supabase.com/partners |
| Framer | 50% of subscription payments for first 12 mo | Yes (12 mo) | 90d | Direct ($200 payout threshold, paid ~2 mo later) | https://www.framer.com/creators · https://www.framer.com/legal/affiliates |

**Anthropic (Claude):** No consumer/creator affiliate program exists. The Claude Partner Network (announced March 12, 2026, $100M initial commitment) is an enterprise reseller/SI program (Accenture, Deloitte, PwC tier), not an affiliate scheme. https://www.anthropic.com/news/claude-partner-network · https://www.channelinsider.com/ai/anthropic-claude-partner-network-launch/
**OpenAI:** No public affiliate program. OpenAI Partner Network (announced June 2026 at its first partner summit, $150M initial funding) targets enterprise resellers, ISVs, consulting firms — three tiers (Select, Advanced, Elite), certification-based. https://www.channeldive.com/news/openai-partner-network-enterprise-ai-adoption/822958/

**Additional discovered programs that fit "agentic income" positioning:**
- **n8n** (workflow/agent automation): 30% of Cloud subscription for 12 mo; PartnerStack; PayPal payouts, €100 min. https://n8n.io/affiliates/
- **Pictory**: 40% one-time commission on a referral's first payment. https://partners.pictory.ai/signup/40690
- **Speechify**: 30% per sale; Rewardful, last-click; cookie window **conflicting** (affiliates page: 30d cookie / 60d qualifying window; terms: 90d). https://speechify.com/affiliates/ · https://speechify.com/affiliates-terms/
- **InVideo AI**: 50% of the first payment on monthly plans, 25% on annual plans (first billing cycle only); 120-day attribution; Impact. https://invideo.io/make/affiliate-program/

---

## 3. MERCHANT OF RECORD & SELF-SERVE PLATFORMS (2026)

| Platform | Fees (headline) | MoR? | Handles EU VAT? | Best for |
|---|---|---|---|---|
| Lemon Squeezy | 5% + $0.50/txn | Yes | Yes | Legacy LS stores; since Jan 2026 new sellers are routed toward Stripe Managed Payments |
| Stripe Managed Payments (LS successor) | 3.5% per successful transaction **on top of** standard Stripe processing (corrected 2026-09-28; previously listed as "5% + $0.50, same as LS") | Yes | Yes | Stripe-native SaaS/digital sellers; invite-only with 35+ countries as of Jan 2026 (general-availability date not confirmed on a Stripe page) |
| Polar.sh | New orgs (≥ May 27, 2026): 5% + $0.50 (Starter). Pre-existing orgs grandfathered at 4% + $0.40 (+0.5% subs). Paid plans: Pro $20/mo (3.8% + $0.40), Growth $100/mo (3.6% + $0.35), Scale $400/mo (3.4% + $0.30). +1.5% non-US cards; $15/dispute | Yes | Yes | Developer-first digital products: license keys, usage-based/LLM billing, GitHub-native; open-source platform (github.com/polarsource/polar) |
| Paddle | 5% + $0.50/txn; custom pricing offered for products under $10, invoicing, and large businesses | Yes | Yes | Vetted B2B SaaS with global tax exposure; approval process, not instant self-serve |
| Gumroad | 10% + $0.50/txn + card processing (~2.9% + $0.30); 30% on Discover marketplace sales | Yes (handles all sales tax/VAT worldwide since Jan 1, 2025) | Yes | Zero-setup storefront for audience-first creators; highest take rate (~13–19% all-in) |
| Whop | Processing 2.7% + $0.30; opt-in add-ons: tax remittance +2%, orchestration +0.8%, billing +0.5%; intl cards +1.5% (the former 3% platform fee no longer appears in Whop's fee docs as of 2026-09-28). Marketplace commission (was 30%) removed May 2025 (secondary source) | Yes, when tax handling activated (via Numeral, 190+ countries) | Yes (when activated) | Paid communities/memberships + digital products with marketplace distribution |

Sources: https://www.lemonsqueezy.com/blog/2026-update · https://www.lemonsqueezy.com/blog/stripe-acquires-lemon-squeezy · https://support.stripe.com/questions/managed-payments-pricing · https://polar.sh/docs/merchant-of-record/fees · https://dodopayments.com/blogs/polar-sh-review · https://www.paddle.com/pricing · https://dodopayments.com/blogs/paddle-fees-explained · https://gumroad.com/pricing · https://checkoutpage.com/blog/gumroad-fees · https://docs.whop.com/fees · https://ruzuku.com/learn/articles/whop-pricing (secondary: marketplace-commission and Numeral tax-partner details)

**Recommendation (agent packs / templates / digital kits, 2026):** Polar.sh is the strongest default: it is a true merchant of record (handles EU VAT and global sales tax as the legal seller), is open-source and API/SDK-first (checkout links, license keys, file downloads, GitHub integration, usage-based billing designed for AI products), and its pricing (5% + $0.50 Starter, cheaper on paid plans; 4% + $0.40 for pre-May-2026 orgs) undercuts Gumroad's ~13–19% all-in while matching Paddle without Paddle's vetting friction — Paddle is optimized for recurring SaaS, not one-off template packs. Lemon Squeezy is now effectively a migration path into Stripe Managed Payments (3.5% on top of standard Stripe processing), so building new on it adds transition risk. Whop is the right second surface when the product is a community + product bundle and you want its marketplace distribution; Gumroad remains the fastest zero-code fallback but the priciest per sale. A common 2026 pattern for this niche: Polar for the product catalog and licensing, Whop or Skool for the paid community layer.

---

## 4. MARKET CONTEXT STATS (2026) — verified, for copy

1. **Gartner:** 40% of enterprise applications will feature task-specific AI agents by end of 2026, up from <5% in 2025 (press release, Aug 26, 2025). https://www.gartner.com/en/newsroom/press-releases/2025-08-26-gartner-predicts-40-percent-of-enterprise-apps-will-feature-task-specific-ai-agents-by-2026-up-from-less-than-5-percent-in-2025
2. **Gartner (caution stat):** over 40% of agentic AI projects are expected to be canceled by end-2027 (cost, unclear value, inadequate risk controls; press release, Jun 25, 2025). https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027
3. **AI agents market size:** MarketsandMarkets: $7.84B (2025) → $52.62B by 2030 (46.3% CAGR). Grand View Research: $10.9B in 2026 → $182.9B by 2033 (49.6% CAGR). https://www.marketsandmarkets.com/PressReleases/ai-agents.asp · https://www.grandviewresearch.com/industry-analysis/ai-agents-market-report
4. **Creator economy:** Goldman Sachs (Apr 2023) projects ~$480B by 2027 (from ~$250B in 2023, a 10–20% CAGR), with ~50M creators. https://www.goldmansachs.com/insights/articles/the-creator-economy-could-approach-half-a-trillion-dollars-by-2027
5. **Creators using AI:** Adobe's June 2026 Creators' Toolkit report (16,000+ creators, 8 countries): 87% say creative AI accelerated their business or audience growth; 75% call it integrated or essential to their work. https://news.adobe.com/news/2026/06/creators-toolkit-report-2026
6. **Frequency:** Kit's 2026 "State of AI in the Creator Economy" survey (550 creators, April 2026): 71.7% use AI at least weekly; 57.3% daily. https://kit.com/resources/blog/ai-creator-economy-report
7. **Solopreneurs:** ~30.4M US nonemployer (solo) businesses with ~$1.8T in receipts (Census, 2023 data released 2026); solo-founded startups rose from 23.7% (2019) to 36.3% (H1 2025) of new US startups on Carta. https://www.census.gov/library/stories/2025/07/nonemployer-business-growth.html · https://www.census.gov/programs-surveys/nonemployer-statistics.html · https://carta.com/data/solo-founders-report/
8. **SMB adoption:** Federal Reserve Small Business Credit Survey (fielded Sep–Nov 2025, 6,525 employer firms with 1–499 employees): 46% currently use AI, another 15% plan to within 12 months. Upwork's SMB study (195 leaders of 10–99-employee firms, Q1 2026 — small sample): 41% piloting AI agents for decision support, 62% "very/extremely confident" delegating high-stakes tasks to agents. https://www.fedsmallbusiness.org/reports/survey/2026/2026-report-on-employer-firms · https://www.upwork.com/resources/state-of-ai-in-smbs
9. **Coding-agent economics:** Anthropic confirmed Claude Code reached a $1B run-rate in Nov 2025, six months after public availability, and "over $2.5B" by Feb 2026. Anthropic's company run-rate surpassed $30B in April 2026 and $47B in May 2026; its Series H (May 28, 2026) raised $65B at a $965B post-money valuation (superseding the Feb 2026 $30B Series G at $380B). https://www.anthropic.com/news/anthropic-acquires-bun-as-claude-code-reaches-usd1b-milestone · https://www.anthropic.com/news/anthropic-raises-30-billion-series-g-funding-380-billion-post-money-valuation · https://www.anthropic.com/news/google-broadcom-partnership-compute · https://www.anthropic.com/news/series-h
10. **MCP scale:** 97M+ monthly SDK downloads across Python and TypeScript (Anthropic, Dec 9, 2025, when MCP was donated to the Agentic AI Foundation). https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation

---

## 5. COMPETITIVE LANDSCAPE — "make money with AI/agents" education (2026)

*Member counts and published prices re-checked on live pages 2026-09-28; all are self-reported by the operators. Where an operator does not publish a price, the entry says so and any third-party figure is marked **UNVERIFIED**.*

1. **AI Automation Society / AIS+ (Nate Herk, Skool):** free community ~463k members; AIS+ $129/mo (~3.5k members); n8n-centric courses + templates. Differentiation gap: single-tool (n8n) lens, agency-service framing, thin on open-source agent runtimes and product/affiliate economics. https://www.skool.com/ai-automation-society/about · https://www.skool.com/ai-automation-society-plus/about
2. **AI Automation Agency Hub + AAA Accelerator (Liam Ottley/Morningside AI):** free Skool hub (~335k members) funneling to a high-ticket accelerator with no price published on the hub page (re-checked 2026-09-29: the hub is free and only says "check out AAA Accelerator"). A third-party reviewer reports the price is disclosed on sales calls and runs to thousands of dollars (secondary, **UNVERIFIED**). Gap: high-ticket sales-call model, client-services (AAA) focus rather than products/open-core. https://www.skool.com/learn-ai/about · https://onlinetrainingreviewer.com/reviews/aaa-accelerator-review-liam-ottley (secondary)
3. **The Rundown (Rundown AI):** free daily newsletter (2M+ readers, self-reported) funds the brand; paid Pro plan $29/mo for courses/guides. Gap: broad AI upskilling, not an income-system playbook; no code-level agent depth. https://www.therundown.ai/subscribe · https://app.therundown.ai/plans
4. **Ben's Bites (Ben Tossell):** free newsletter (171k+ subscribers), now positioned around building with agents, plus paid Pro/courses; builder/tool-review angle. Gap: news-and-analysis first; monetization education is secondary. https://www.bensbites.com/
5. **Superhuman AI (Zain Kahn):** free daily brief, 2M+ subscribers (self-reported) — ad-supported media model. Gap: 3-minute news format, no hands-on build path. https://www.superhuman.ai/
6. **Julian Goldie (AI Profit Boardroom, Skool):** teaches "make money with AI" via YouTube/Skool funnels; paid community $69/mo (~3.4k members). Gap: SEO/volume-content oriented; agent tooling coverage is shallow. https://www.skool.com/ai-profit-lab-7462/about
7. **Whop/Skool marketplace communities (category):** many paid "AI income" communities distributed via Whop and Skool discovery at roughly $9–$199/mo (illustrative range); quality highly variable — a trust/verification gap an evidence-first open-core property can exploit. https://whop.com/blog/where-to-sell-digital-products/

---

## 6. REGULATORY / TRUST NOTES

- **FTC Endorsement Guides (16 CFR Part 255, revised 2023):** any material connection — including affiliate commissions — must be disclosed "clearly and conspicuously" (difficult to miss, easily understood); on social/interactive media the disclosure must be "unavoidable," and it applies each time the endorsement appears. https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking · https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-255
- **FTC Consumer Reviews & Testimonials Rule (Aug 2024, 16 CFR Part 465):** bans fake or AI-generated reviews/testimonials and review gating, with civil penalties up to $53,088 per violation (2025 inflation adjustment; the 2026 adjustment was cancelled by OMB memo M-26-11) — directly relevant to AI-tool review content. https://www.ftc.gov/business-guidance/advertising-marketing/endorsements-influencers-reviews · https://www.ftc.gov/news-events/news/press-releases/2025/02/ftc-publishes-inflation-adjusted-civil-penalty-amounts-2025
- **Operation AI Comply (FTC, launched Sept 2024) continues under the new administration into 2025–26:** the 2025 Click Profit action targeted baseless "AI-powered" passive-income business-opportunity claims (Workado, often cited alongside it, concerned inflated AI-detector accuracy claims, not income); AI-attached earnings claims are described as the highest-risk category — never publish unsubstantiated income claims or uncaveated case studies. https://www.beneschlaw.com/insight/one-year-in-ftcs-operation-ai-comply-continues-under-new-administration-signaling-enduring-enforcement-focus/ · https://www.ftc.gov/news-events/news/press-releases/2024/09/ftc-announces-crackdown-deceptive-ai-claims-schemes · https://www.ftc.gov/news-events/news/press-releases/2025/03/ftc-acts-stop-click-profit-online-business-opportunity-has-cost-consumers-least-14-million · https://www.ftc.gov/news-events/news/press-releases/2025/04/ftc-order-requires-workado-back-artificial-intelligence-detection-claims
- **EU AI Act Article 50 transparency obligations apply from Aug 2, 2026:** chat-style AI must disclose it is AI; generative outputs need machine-readable "AI-generated" marking (the AI Act Omnibus — political agreement May 2026, in force July 27, 2026 — gives systems placed on the market before Aug 2, 2026 until Dec 2, 2026 for Art. 50(2) marking); deepfakes must be labeled; penalties up to €15M or 3% of worldwide turnover. Educational sites deploying chatbots or publishing AI-generated media for EU users are in scope as deployers. https://datamatters.sidley.com/2026/06/24/eu-ai-act-transparency-obligations-preparing-for-compliance-by-2-august-2026/ · https://artificialintelligenceact.eu/article/50/ · https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/
- **EC Code of Practice on marking and labelling AI-generated content (published June 10, 2026; voluntary):** the Commission's practical route to the Art. 50 marking and labelling duties — plan content pipelines to record AI-assistance provenance now. https://digital-strategy.ec.europa.eu/en/news/commission-publishes-code-practice-marking-and-labelling-ai-generated-content

---

*End of dossier. All URLs originally accessed 2026-07-11 and re-checked 2026-09-28; claims that could not be re-verified against a primary source were removed or are marked inline. Conflicts and UNVERIFIED items are marked inline; re-verify commission terms at signup time since programs change without notice (Descript's 2024 flat-fee switch, Notion's mid-2026 closure to new affiliates, and Semrush's move to per-product CPA are recent examples).*
