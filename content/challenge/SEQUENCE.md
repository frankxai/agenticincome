# Challenge sequence — sending mechanism

Status: **NOT WIRED**. The 7 day files in this folder are the source content. Nothing currently
sends them automatically. This document describes the intended wiring and exactly what is blocked,
so the next session (or Frank) can finish it without re-deriving the plan.

## What exists today

- `content/challenge/day-1.md` … `day-7.md` — the email bodies, each with `day` / `subject` / `title`
  / `teaser` / `cta` / `ctaHref` frontmatter.
- `app/challenge/page.tsx` — the public landing page. Signup posts to the site's existing
  `/api/subscribe` route (see `app/api/subscribe/route.ts`) with `source: "challenge"`.
- `/api/subscribe` already forwards `{ email, source, requestId, tags }` to `SUBSCRIBE_WEBHOOK_URL`
  when that env var is configured (currently unset in this environment — see `DEPLOY.md`). It does
  **not** currently distinguish "challenge" subscribers from the general list beyond the `source`
  field it forwards; there is no day-by-day drip logic anywhere yet.

## What "wired" means

A subscriber who submits the `/challenge` form should receive `day-1.md` immediately (or same-day),
then `day-2.md` through `day-7.md` on a fixed cadence (once per day is the simplest evergreen
schedule — no cohort, no fixed calendar date, timer starts at their signup).

## Two real paths, both blocked on the same thing

### Option A — n8n (Railway-hosted)

The estate already runs n8n on Railway for this kind of automation (see
`starlight-railway-estate-operator` skill / estate Railway policy). The shape:

1. `/api/subscribe` forwards to an n8n webhook (`SUBSCRIBE_WEBHOOK_URL` pointed at that workflow)
   tagged `source: "challenge"`.
2. n8n workflow: on webhook → tag contact `challenge` in whatever list store is used → schedule 7
   delayed sends (Wait node × 6, or a single Wait-loop keyed off signup date) → each send step reads
   the matching `content/challenge/day-N.md` (checked into this repo — n8n would need read access,
   e.g. via a GitHub-raw fetch node, or the content gets synced into the n8n workflow / a small
   content store it can query) → sends via whatever ESP node n8n has configured (Resend node, or
   an SMTP node).
3. **Blocked on:** Railway login. This session does not have Railway credentials; per the Job
   instructions, this must be documented, not faked or worked around with a fabricated success
   state. Whoever has Railway access needs to: confirm the existing n8n instance, build or confirm
   this workflow, and set `SUBSCRIBE_WEBHOOK_URL` in Vercel for the `agenticincome` project.

### Option B — Resend directly (no n8n)

1. Get a Resend API key + verify the `agenticincome.ai` sending domain (note from `DEPLOY.md`:
   `agenticincome.ai` currently has **no MX record**, so sending-domain verification needs that
   fixed first regardless of which path is chosen).
2. Use Resend's Audiences + Broadcast automation (or a small serverless cron / scheduled function
   that walks a `subscribed_at` timestamp per contact and sends whichever day-N is due) to deliver
   `day-1.md` through `day-7.md` on the same one-per-day cadence.
3. `/api/subscribe` would call the Resend API directly (add contact to a `challenge` audience) instead
   of / in addition to the generic webhook forward.
4. **Blocked on:** a `RESEND_API_KEY`, DNS (MX/SPF/DKIM) verification for the sending domain, and
   deciding whether the day-by-day scheduling lives in Resend's own automation UI or in a small
   scheduled function in this repo. Neither exists yet in this environment.

## Recommendation for whoever picks this up

Option A (n8n) fits the existing estate pattern (Railway-hosted automation, one dispatcher) and
avoids adding a second scheduling system. Option B (Resend-native) is faster to stand up solo if
n8n access isn't available and the domain's MX/DKIM records get fixed at the same time.

Either way: **do not mark `/api/readiness` or any launch-readiness surface as "email wired"** until
a real subscriber has received a real day-2 email on a real delay — a webhook accepting the day-1
signup is not the same as the sequence actually running.

## Content maintenance note

If a day's tool references change (a program closes, a link changes), update the day-N.md file
directly — same rule as blog content: the recommendation must survive without the payout, and stale
tool references in an automated sequence are worse than stale content on a page, because nobody is
re-reading old emails to catch the drift.
