# Agentic Income site-header review

The existing site-header approval covers the estate wordmark at SHA-256 `8c5b7ac822de705e183639349f48e70ed37716d6436d9ab0548a06b9a9ca517b`. One exact local copy supplies the navigation shared across pages. The two PNG comparisons pair the sampled production HTML and CSS with the proposed placement at 390 and 1120 pixels.

## Production authorization

Preview builds run the header byte and markup checks. Production builds also call the current estate resolver and verify the estate operator's time-limited Ed25519 release decision. Configure a read-only current `VIS_ESTATE_ROOT`, the trusted `ESTATE_IDENTITY_OWNER_PUBLIC_KEY`, and the signed envelope at `VIS_PUBLICATION_APPROVAL_PATH`. Use the same current mount and run `node scripts/verify-header-identity.mjs --release` on a built checkout immediately before any manual preview promotion. That path requires `VERCEL_GIT_COMMIT_SHA` or a trusted `VIS_RELEASE_REVISION`. Provider-side promotion controls remain the release owner's responsibility. The site does not hold a signing key.

The signed data uses the estate's existing `approvedReviewer` serialization. Its intent is the JSON array below, appended after the protocol identifier, reviewer and expiry. Supply the exact deployment revision.

    ["publish_placement","agenticincome.ai","site header","website","<40-hex revision>","agentic-income.logo-primary.agentic-income-wordmark","2026-08-07T14:12:50.618Z","8c5b7ac822de705e183639349f48e70ed37716d6436d9ab0548a06b9a9ca517b"]

A human release decision applies to that revision only. A different mark, revoked permission, stale version, expired decision or disconnected authority blocks the build. No release approval was issued in this PR. Roll back by retaining the previous production deployment or reverting the PR through the existing human release procedure.
