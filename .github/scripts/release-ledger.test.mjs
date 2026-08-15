import assert from "node:assert/strict";
import test from "node:test";
import { expectedPullRequests, loadLedger, validateLedger } from "./validate-release-ledger.mjs";

test("canonical ledger satisfies the AgenticIncome release contract", async () => {
  const ledger = await loadLedger();
  assert.deepEqual(validateLedger(ledger), []);
});

test("every merged pull request receipt appears exactly once", async () => {
  const ledger = await loadLedger();
  const actual = ledger.releases
    .flatMap((release) => release.sourcePullRequests)
    .sort((a, b) => a - b);
  assert.deepEqual(actual, expectedPullRequests);
});

test("publishing and commercial claims remain gated", async () => {
  const ledger = await loadLedger();
  assert.equal(ledger.releasePolicy.githubReleaseMode, "draft-only");
  assert.equal(ledger.releasePolicy.publicChangelog, "preview-and-visual-review-required");
  assert.ok(ledger.releases.every((release) => release.status === "merged"));
  assert.ok(ledger.releases.every((release) => release.limitations.length > 0));
});
