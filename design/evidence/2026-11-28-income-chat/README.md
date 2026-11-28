# Income studio browser proof · 28 November 2026

These are viewport captures and receipts from a separate checkout of the local optimized Next build. The browser used revision `2949bf6` and real same-origin requests to `/api/studio/chat` without a model credential. Only the explicitly labeled 503 recovery test intercepted a response.

| Viewport | Width × height | Input |
| --- | --- | --- |
| [Desktop](home-desktop.webp) | 1440 × 900 | Keyboard and pointer |
| [Phone](home-phone.webp) | 390 × 844 | Keyboard and pointer, phone-width layout |
| [Tablet](home-tablet.webp) | 768 × 1024 | Reduced motion |
| [Small phone](home-small.webp) | 320 × 740 | Reduced motion |

Use **Price a service**. Its €1,500 price and €900 variable cost yield €600 contribution. Ask **What if delivery costs 1100?** for the [desktop](conversation-desktop.webp) or [phone](conversation-phone.webp) result: €400, 26.7%. Then ask **What should I charge to keep a 40% margin?** All three pricing turns identify the calculator tool with no model-outage message. The [third turn](target-margin-desktop.webp) returns €1,833.34, rounded up, and downloads `target-margin.md`.

[Observed requests, responses and measurements](receipts.json) include partner-source URLs and dates, the actual catalog workflow, downloadable Markdown, zero automatic requests on preset landing, recovered input after a simulated failure, and navigation with JavaScript disabled. They also distinguish a payment-fee comparison from evidence that a merchant can charge today. Dated source captures are not a fresh audit of vendor prices.

Scope: Chromium on a local production build. No production checkout, live inference call, conversion or user acceptance was inferred from this evidence.
