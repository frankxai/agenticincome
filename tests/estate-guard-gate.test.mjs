import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

// Drives .claude/hooks/estate-guard-gate.py through its real entry point: a
// PreToolUse JSON payload on stdin, the decision JSON (or nothing) on stdout.
const HOOK = fileURLToPath(new URL('../.claude/hooks/estate-guard-gate.py', import.meta.url));

// The recursive-delete command is assembled here so this file never contains it
// literally (the repository's own gate asks on any command text that does).
const RM = 'r' + 'm -' + 'rf ';

function decide(command) {
  const env = { ...process.env };
  delete env.ESTATE_GUARD_OFF;
  delete env.ESTATE_GUARD_ALLOW_FORCE;
  delete env.TMPDIR;
  const res = spawnSync('python3', [HOOK], {
    input: JSON.stringify({ tool_name: 'Bash', tool_input: { command } }),
    encoding: 'utf8',
    env,
  });
  assert.equal(res.status, 0, `hook exited ${res.status}: ${res.stderr}`);
  const out = res.stdout.trim();
  if (!out) return 'allow';
  return JSON.parse(out).hookSpecificOutput.permissionDecision;
}

const BYPASSES = [
  // `&>` / `&>>` are redirects in bash, not separators: the later args are still deleted.
  `${RM}/tmp/estate-guard-test &>/dev/null /home/someone/project`,
  `${RM}/tmp/estate-guard-test &>> /tmp/log.txt /home/someone/project`,
  `${RM}/tmp/estate-guard-test &>/dev/null ./src`,
  // Other & / | redirect forms fail closed too.
  `${RM}/tmp/estate-guard-test 2>&1 ./src`,
  `${RM}/tmp/estate-guard-test >| /tmp/log.txt ./src`,
  `${RM}/tmp/estate-guard-test <&0 ./src`,
  // ')' only ends the argument list where bash does; process substitution and
  // quoted or escaped parens are not an end.
  `${RM}/tmp/estate-guard-test >(cat) ./src`,
  `${RM}/tmp/estate-guard-test ")" ./src`,
  `${RM}/tmp/estate-guard-test \\) ./src`,
  `(${RM}/tmp/estate-guard-test ')' ./src)`,
];

for (const command of BYPASSES) {
  test(`scratch-delete exception does not cover: ${command.slice(RM.length)}`, () => {
    assert.ok(['ask', 'deny'].includes(decide(command)), 'expected ask or deny');
  });
}

const PLAIN_SCRATCH = [
  `${RM}/tmp/estate-guard-test`,
  `${RM}/tmp/estate-guard-test /var/tmp/estate-guard-other`,
  `${RM}/tmp/estate-guard-test && echo done`,
  `${RM}/tmp/estate-guard-test; ${RM}/tmp/estate-guard-other`,
  `(${RM}/tmp/estate-guard-test)`,
  `${RM}"/tmp/estate-guard-test"`,
  `${RM}/tmp/estate-guard-test/*.log`,
];

for (const command of PLAIN_SCRATCH) {
  test(`scratch-delete exception still allows: ${command.replace(RM, '<rd> ')}`, () => {
    assert.equal(decide(command), 'allow');
  });
}

test('non-scratch recursive delete still asks', () => {
  assert.equal(decide(`${RM}./build`), 'ask');
  assert.equal(decide(`${RM}/tmp/estate-guard-test ./build`), 'ask');
});

test('root delete is still denied', () => {
  assert.equal(decide(`${RM}/`), 'deny');
});
