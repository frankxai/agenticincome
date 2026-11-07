# AgenticIncome Design System (`DESIGN.md`)

## 1. First Read

AgenticIncome builds revenue systems with agents and hands them over with repository, verification, and preview evidence. Every page, lead magnet, and digital product surface must feel like an operator's build room where claims are backed by inspectable files, scripts, and checksums.

## 2. Refero Reference Lock (Non-Averaged)

- **Primary Style Foundation:** **Linear Changelog** (`11d3e58a-87d7-4a9a-bbf5-720f4fd3ffc6`)
  - Preserves near-black obsidian canvas, layered charcoal elevation without drop-shadow soup, disciplined weight-500/600 headings, pill actions (`9999px`) contrasted against crisp `8px-16px` container radii, and monospace metadata.
- **Borrowed Detail 1 (Verification Accent Role):** **Supabase** (`28aeb534-7a32-43ce-a1ae-464fec697fd2`)
  - Emerald signal (`#10b981` / `#34d399`) is strictly reserved for verified states, executable proof, primary CTAs, and active step indicators. Never flood large section backgrounds with neon gradients.
- **Borrowed Detail 2 (Workbench Code Containment):** **Convex** (`d500b995-352a-4a4f-8016-cb00cdb6eb17`)
  - Syntax highlights stay strictly inside terminal and file-inspector panes; surrounding UI stays calm and neutral.
- **Screen & Flow Mechanics:**
  - **4-Step Operator Fit-Check (`OperatorFitCheck.tsx`):** Adapted from **Polaroid Recommendation Quiz** (`Flow 9471`) + **Contra Savings Console** (`Screen 4d16a81a-e401-4c6a-b0a4-641da98d5f24`).
  - **Two-Pane Pack Inspector (`PackInspector.tsx`):** Adapted from **Cycle Template Workbench** (`Screen 618b2107-26a0-40e1-9e7a-9f7689a441f5`) + **Select and Preview Template** (`Flow 1694`).
  - **Tier & Bundle Comparison (`/offers`):** Adapted from **Amie Two-Column Tier Selector** (`Screen 548f5d54-3aea-42fd-8a84-a174139b1b97`).
- **Explicit Anti-Slop Rejects:**
  - No indigo/violet SaaS gradients (`#6366f1`, `#8b5cf6`).
  - No 3D tilted paperback mockups or stock laptop photos; use code-exact SVG schematic plates (`public/images/products/plate-*.svg`) and live file-tree inspectors.
  - No emoji bullets, `border-left: 4px` callout stripes, or `ALL CAPS` marketing banners (sentence case for public badges and buttons; small uppercase kickers allowed only for `10px-12px` metadata labels).
  - No earnings promises, passive-income hype, unattributed forecasts, contrast formulas, or em-dashes in newly authored product copy.

## 3. Tokens

- **Background (`--color-bg`):** `#05060a`
- **Surface (`--color-surface`):** `#0a0c14`
- **Elevated Surface (`--color-surface-2`):** `#101522`
- **Border (`--color-border`):** `#1a1f2e`
- **Primary Ink (`--color-ink`):** `#f1f3f9`
- **Muted Ink (`--color-muted`):** `#8a90a8`
- **Implementation Signal (`--color-accent`):** `#10b981`
- **Technical Secondary (`--color-accent-2`):** `#06b6d4`
- **Commercial Boundary Signal (`--color-gold`):** `#f59e0b`
- **Typography:** Geist Sans (`--font-sans`) for headings and body (`font-feature-settings: "tnum"`), Geist Mono (`--font-mono`) exclusively for file paths, commands, prices, step counters, and SHA-256 digests.

## 4. Digital Product & Funnel Rules

1. **Inspect Before You Buy:** Every product detail route (`/offers/:slug`) exposes its real file manifest, kilobyte sizes, sample file contents, license boundary, and an explicit `"Who should skip this"` block before asking for payment or waitlist registration.
2. **Value-First Lead Magnets:** Interactive diagnostics (`OperatorFitCheck`) compute a deterministic model recommendation (`lib/fit-check.ts`) and a 5-step Week-1 plan immediately in the browser before requesting an email address.
3. **Fail Closed on Money (Doctrine 0):** `products/catalog.json` `status` governs live Polar checkout (`lib/polar.ts`). Pre-release packs render honest `Request access` states and never pretend checkout is live until human activation.

## 5. Motion & Accessibility

- **Signature Behavior:** Audit -> Architect -> Implement -> Verify.
- **Timing:** `120ms` hover/press micro-feedback; `180ms-200ms` tab and step transitions (`cubic-bezier(0.0, 0.0, 0.2, 1)`).
- **Accessibility:** `:focus-visible` `2px` `#10b981` outline on every interactive control, `44px` minimum touch target height on mobile, keyboard `ArrowUp`/`ArrowDown` navigation in file-tree tabs, and full static parity under `prefers-reduced-motion: reduce`.
