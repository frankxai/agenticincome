import assert from 'node:assert/strict';
import test from 'node:test';

import { isRelativeHookCommand } from '../.claude/ci/estate-guard-scan.mjs';

// HK008: a hook command whose .claude/hooks/ path depends on the working
// directory breaks after any `cd`. Anchored forms must pass; relative ones flag.
const ANCHORED = [
  'python3 "$CLAUDE_PROJECT_DIR"/.claude/hooks/estate-guard-gate.py',
  'python3 "$CLAUDE_PROJECT_DIR/.claude/hooks/estate-guard-gate.py"',
  'python3 ${CLAUDE_PROJECT_DIR}/.claude/hooks/estate-guard-gate.py',
  'node "${CLAUDE_PROJECT_DIR}"/.claude/hooks/web-stop.mjs',
  'bash $HOME/.claude/hooks/x.sh',
  'bash "${HOME}"/.claude/hooks/x.sh',
  'bash ~/.claude/hooks/x.sh',
  'python3 /opt/repo/.claude/hooks/x.py',
  'python3 C:/repo/.claude/hooks/x.py',
  "python3 'C:\\repo\\.claude/hooks/x.py'",
  'python3 "/Users/me/My Projects/site/.claude/hooks/x.py"',
  'python3 "$CLAUDE_PROJECT_DIR/My Projects/.claude/hooks/x.py"',
  'node --hook="$CLAUDE_PROJECT_DIR"/.claude/hooks/x.mjs',
  'echo no hooks here',
];

const RELATIVE = [
  'python3 .claude/hooks/x.py',
  'python3 ./.claude/hooks/x.py',
  'python3 ././.claude/hooks/x.py',
  'python3 ../.claude/hooks/x.py',
  'python3 .claude//hooks/x.py',
  'python3 ./.claude/./hooks/x.py',
  'python3 "$PWD"/.claude/hooks/x.py',
  'python3 $PWD/.claude/hooks/x.py',
  'python3 "$(pwd)"/.claude/hooks/x.py',
  'python3 $(pwd)/.claude/hooks/x.py',
  'python3 `pwd`/.claude/hooks/x.py',
  'python3 ${CLAUDE_PROJECT_DIR:-.}/.claude/hooks/x.py',
  'python3 "${CLAUDE_PROJECT_DIR:-.}/.claude/hooks/x.py"',
  'python3 ".claude/hooks/x.py"',
  "python3 '.claude/hooks/x.py'",
  'node --hook=.claude/hooks/x.mjs',
  'cd /repo && python3 .claude/hooks/x.py',
  'python3 "$CLAUDE_PROJECT_DIR"/.claude/hooks/a.py; python3 .claude/hooks/b.py',
  'python3 $CLAUDE_PROJECT_DIRX/.claude/hooks/x.py',
];

for (const cmd of ANCHORED) {
  test(`HK008 anchored: ${cmd}`, () => assert.equal(isRelativeHookCommand(cmd), false));
}
for (const cmd of RELATIVE) {
  test(`HK008 relative: ${cmd}`, () => assert.equal(isRelativeHookCommand(cmd), true));
}
