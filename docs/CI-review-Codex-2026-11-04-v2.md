# CI review and merge hold, Codex, 4 November 2026, revision 2

Author: Codex. Review state: implementation awaiting final CI and independent review.
Sources: current repository, PR #120, issue #119, Vercel project/deployment APIs,
and [Vercel Git configuration](https://vercel.com/docs/project-configuration/git-configuration).
Preserves revision 1 and its audit findings.

Frank authorized qualifying PR merges with no production deployment on 4 November.
The Vercel project API confirms `main` is the production branch. `vercel.json` now
disables Git deployments of `main`; unspecified feature branches retain previews.
The Node test suite checks the exact branch policy, including the absence of
overlapping rules that could re-enable deployment. This hold remains until a
separate, explicitly approved production release removes it. No dashboard,
billing, review, credential, domain, or cron setting is changed.

Before this change, production was deployment `dpl_6A58QJZy9bidhHJpT3P99pZXMFP3`,
commit `fd2ecdcdebfd11d41a72d09284eaabb777b6541a`.
After any authorized merge, re-read production deployment history to verify no
new production deployment was created.

The prior head `8b653d19500b07bd69bf2e4b774d56c88387e6a7` passed CI run
41750814250: frozen install, lint, 193 tests, typecheck, internal links, public
surface verification, production build and dependency audit (zero high/critical).
Those results do not certify this new head. Merge requires fresh CI, Vercel
preview checks and an explicit independent review bound to the final head SHA.
The Vercel Security Review finding summary alone is not that independent signoff.
