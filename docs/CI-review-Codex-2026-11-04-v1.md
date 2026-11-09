# AgenticIncome CI and review audit, Codex, 4 November 2026, v1

Author: Codex / OpenAI. Created: 2026-11-04. Revision: 1.
Review state: draft implementation; independent review and candidate CI pending.
Source: `frankxai/agenticincome`, main `fd2ecdcdebfd11d41a72d09284eaabb777b6541a`.
Instructions read: root `AGENTS.md`, SHA-256 `C265ACEFE9DA3DA007EE08E46B034397BB3D8B07DFE998DEF5D9139AE27BE50F`, DESIGN.md, TASTE.md, SYSTEM.md and SKILL.md. No deeper AGENTS scope governs these changes.
Lane: `agent/codex/ci-security-20261104`, isolated sparse worktree; primary checkout preserved.
Tracking issue: [119](https://github.com/frankxai/agenticincome/issues/119). Later preflight at 00:55 UTC still held builds: 4,726 MB free against 8,192 MB required.

## Configured and missing

| Area | Observed on main | Remaining gap |
| --- | --- | --- |
| Install | pnpm 11.5.0 in packageManager; committed pnpm-lock.yaml; CI frozen install; Node 24 | No install change needed. Read package manager version from its existing manifest. |
| Checks | CI build invokes merge:gate: lint, tests, type-check, static links, public-surface verification, production build | A second build step repeats that build. |
| Security | estate-guard scans source/workflows on PR, main and weekly; Dependabot weekly npm/action groups | No dependency-audit job. GitHub code scanning returns disabled (403); secret scanning returns disabled (404). |
| Permissions | Repository workflow default read; Actions cannot approve PR reviews; build job contents:read | Checkout persists credentials; default for future jobs is implicit. |
| Protection | Strict required build and Vercel; stale approvals dismissed | Zero required approvals; admins bypass; Review Gate and estate scan are not required; build status is not bound to an app. No rulesets returned. |
| Vercel | Native git integration; Node 24; preview protection enabled | Deployment readiness alone does not establish test success. Dashboard Agent review settings and spend were not exposed by the inspected MCP APIs. |

## Changes in this branch

Extend the existing ci.yml rather than creating a parallel workflow. The new Dependency audit job reads the committed lockfile without dependency installation, scripts, secrets or report uploads. It uses pinned actions, contents:read and a five-minute timeout. Registry errors and high/critical findings fail the job; there are no exemptions.

The existing build keeps its check name and complete merge:gate. Remove its second build, stop persisting checkout credentials and declare contents:read at workflow level. The dormant Railway route is limited to this private repository and trusted same-repository events; no variable or runner setting is changed. CI_RUNNER returned no configured value during this audit. Other vendored workflow runner expressions still need their owning upstream's review before Railway is activated.

Alternative considered: another security workflow or paid AI reviewer. The existing source scanner and review gates already serve those roles; a lockfile audit fills the narrower missing check without another installation or reviewer.

## Checks and findings

- pnpm 11.5.0 audit --audit-level high: exit 0, zero high/critical, one moderate. This covers the root lockfile, not every separately installable product.
- Governance tests: 41 passed, zero failed. All workflow YAML parsed. Audit job structure and permissions checked. git diff --check passed before PR preparation.
- Baseline main CI [41575985033](https://github.com/frankxai/agenticincome/actions/runs/41575985033) succeeded at the exact source SHA above. Both Merge gate and the redundant Build step passed there. This is baseline evidence, not candidate verification.
- Local dependency install, lint, type-check, full test suite and production build were not rerun: machine preflight held build work at 5,446 MB free versus 8,192 MB required. No other session was stopped. Only text/config work and small tests ran.
- PR [118](https://github.com/frankxai/agenticincome/pull/118) has successful Vercel lint/typecheck invocations on head `15b933600313f2cfd48db019c0677250a1c2dcda` while GitHub CI [41706383214](https://github.com/frankxai/agenticincome/actions/runs/41706383214) fails in merge:gate tests. Logged failures include an outdated command-page label assertion and missing baseOpenGraph metadata. Deployment success does not clear those failures.
- PR [113](https://github.com/frankxai/agenticincome/pull/113), mcp-handler 2.3.0, fails type-check: MCP route line 336 supplies three arguments where the new handler accepts one or two. Keep with its owner; no blind major-version bump.
- PR [83](https://github.com/frankxai/agenticincome/pull/83) head `9d0d714921f0faabde436920f4c490c0531a2e97`: confirmed that the proposed waitlist POST calls handleJoin without a client rate limit and returns raw error text. That route does not exist on current main. Its readiness, capture and editorial findings stay with that unmerged branch; this CI change does not adopt it.
- PR [114](https://github.com/frankxai/agenticincome/pull/114) retains an unanswered reporting-period validation finding and red Review Gate. Its observatory file is absent from current main.
- PR [86](https://github.com/frankxai/agenticincome/pull/86) retains commerce/readiness findings. Commerce activation and provider changes are outside this CI patch.

## Open PRs and cost controls

13 PRs were open before this branch's PR: 52, 54, 80, 83, 86, 102, 104, 107, 109, 112, 113, 114, 118. See the [current inventory](https://github.com/frankxai/agenticincome/pulls).

PR [104](https://github.com/frankxai/agenticincome/pull/104) already owns broader cost changes. This patch overlaps its ci.yml only; its author must rebase after either lands. No duplicate cost workflow was created. PR 104 is draft and has failing checks; it was not adopted wholesale. PR 54's action updates also require rebasing if these pins change.

Observed duplication: merge:gate already builds, then CI builds again (removed here). Vercel project-native lint/typecheck also run alongside GitHub lint/type-check: five recent invocation records confirmed those two jobs. They do not replace tests or security auditing. No Vercel setting was changed.

Recent 100 inline comments included Codex and Jules activity. That sample does not establish subscriptions, billing or every installed reviewer. No additional AI reviewer, model API secret, workflow dispatch, paid service or schedule was added. Existing concurrency, timeouts and weekly grouped Dependabot remain in place.

## Manual work and evidence limits

After candidate CI succeeds, require Dependency audit and the existing source/review gates in main protection; decide admin enforcement and independent approval requirements. Preserve exact existing check names and Vercel binding. These dashboard permissions were inspected, not changed.

Inspect Vercel Agent review enablement, reviewed repositories and usage in its dashboard before deciding whether any paid reviewer overlaps. Native invocation history here proves lint/typecheck execution only; Vercel Agent security-review coverage remains unverified.

The storage sensor's documented script path is missing in the current config checkout. A fresh volume reading was above both hard storage floors; sparse text-only worktrees were used, without dependency installs or large asset checkout. Full install/build verification and independent exact-head review remain required. Existing preview integration may run after a branch push; no production deploy or merge was requested.

Skills: Humanizer read/applied to prose; Vercel Agent and deployments-cicd read/applied to inspection and CI scope. Emil read; visual, focus, touch, reduced-motion and interruption checks are inapplicable to this CI-only change. No design verification claimed.

Sources: GitHub repository, protection, ruleset, Actions, Dependabot, code/secret scanning APIs and open PR reviews; authenticated Vercel project and native-CI invocation APIs, inspected 2026-11-04; [pnpm audit](https://pnpm.io/cli/audit), [Vercel review management](https://vercel.com/docs/agent/pr-review/usage). Estate handover belongs in frankxai/agentic-ops-hub; its session/ledger/prompt lane is occupied, so those records must wait for the owner.
