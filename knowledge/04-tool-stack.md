---
title: "The Tool Stack — the minimum machine, legal-light"
last_verified: 2026-07-11
review_cycle: quarterly
---

# The tool stack: minimum machine, maximum sovereignty

The goal is a business with **no employees, no invoices to chase, no VAT registrations, and no support desk** — self-serve in, self-serve out. Five slots. Fill each with one tool, resist the rest.

## Slot 1 — Checkout: Merchant of Record (the legal-light keystone)

Sell digital products through a **Merchant of Record (MoR)** — they are legally the seller; they handle global sales tax/VAT, refunds, chargebacks, and compliance. You ship product; they ship paperwork. For a solo creator selling packs and kits internationally, this single choice removes ~90% of the legal surface area.

- **Our default (July 2026): Polar.sh.** True MoR, open-source, developer-first — checkout links, license keys, file delivery, GitHub-native, usage-based billing built for AI products. 5% + $0.50 on the free tier, cheaper on paid plans — versus Gumroad's ~13–19% all-in. Built for exactly this product shape (packs, templates, kits).
- **The field:** Lemon Squeezy is now effectively a migration path into **Stripe Managed Payments** (same 5% + $0.50; invite-preview through early 2026) — fine if you're already there, transition risk if you're starting new. **Paddle** suits vetted recurring SaaS, not template packs. **Whop** (~6–7% all-in with tax handling) is the right second surface when you add a paid community with marketplace distribution. **Gumroad** is the zero-code fallback, priciest per sale.
- **Not MoR:** raw Stripe. Cheaper per-transaction, but *you* become the seller of record — tax registrations and refund ops land on you. Wrong trade at this stage. (Full comparison with sources: [07 — Field Dossier](07-field-dossier.md) §3; fees re-verified quarterly.)

## Slot 2 — Email: the only audience you own

Social reach is rented; the list is owned. One list, tags per property, one weekly send.
- **Candidates:** Beehiiv (publication-native, recommendation network), Kit / formerly ConvertKit (creator automation standard). Both have meaningful partner programs — relevant because your stack should be *part of* your disclosed affiliate registry, not separate from it.
- **Discipline:** the free artifact earns the address; the weekly Brief keeps it. No popups on doctrine pages (dpi CANON), no purchased lists, one-click unsubscribe. Deliverability is a trust metric.

## Slot 3 — Web: static-fast, git-deployed

Next.js + Vercel is our published stack (this repo is the live example). Any git-deployed static-first stack qualifies. The bar: Lighthouse ≥ 90, deploy-on-merge, preview URLs for every change — because your **agents** are the ones shipping, and they need previews + gates, not FTP.

## Slot 4 — Analytics: private, sufficient

Privacy-first analytics (Vercel Analytics / Plausible-class) + your MoR's revenue dashboard + Google Search Console. That triangle answers 95% of real questions (what's read, what's searched, what's bought). Skip session recording and ad pixels; they cost trust and add consent-banner complexity you don't need.

## Slot 5 — The agent layer (your actual staff)

Covered in [01](01-landscape.md) and [03](03-agent-fulfillment.md): one Tier-1 runtime (build), optionally one Tier-2 operator (run). Their credentials live in a secrets manager, never in repos; scoped tokens per surface; spend caps on everything that bills per use.

## The reference stack (what this business runs, July 2026)

| Slot | Choice | Why |
|---|---|---|
| Checkout | MoR (Lemon Squeezy / Polar) | Zero tax/refund ops, personal-license products |
| Email | Beehiiv or Kit (final call in registry) | Owned audience + partner economics |
| Web | Next.js 16 + Vercel | Agent-friendly deploys, preview gates |
| Analytics | Vercel Analytics + GSC | Private, sufficient, zero banners |
| Agents | Claude Code (+ packs) · OpenClaw as operator · Hermes for governed cron | Build / run / govern |
| Links | Self-hosted `go.` redirector ([go-agenticincome](https://github.com/frankxai/go-agenticincome)) | Swappable, disclosed, no third-party link tax |

**Total fixed cost of the machine: roughly the price of two streaming subscriptions**, plus usage-based agent spend that scales with revenue-producing work. That asymmetry — near-zero fixed cost, capability rented by the hour — is why the solo-with-agents model works at all.

## What you deliberately don't have

No Shopify (wrong tool for digital), no course platform (packs > courses; see [02](02-income-models.md)), no community platform until there's a community (a Discord with 9 people costs more reputation than it earns), no CRM (your list tags are the CRM), no Zapier sprawl (loops live in version control where agents can maintain them).

*Next: [05 — Honest Marketing](05-honest-marketing.md): selling all of this without becoming what we mock.*
