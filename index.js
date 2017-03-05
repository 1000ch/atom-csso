'use babel';

import { type } from 'os';
import { normalize, join } from 'path';
import execa from 'execa';

const unix = normalize(join(__dirname, 'node_modules', '.bin', 'csso'));
const win = normalize(join(__dirname, 'node_modules', '.bin', 'csso.cmd'));
const csso = type() === 'Windows_NT' ? win : unix;

function minify(restructure = false) {
  const editor = atom.workspace.getActiveTextEditor();

  if (!editor) {
    return;
  }

  const args = restructure ? [] : ['--restructure-off'];
  const buffer = Buffer.from(editor.getText());

  execa.stdout(csso, args, {
    encoding: null,
    input: buffer
  }).then(stdout => {
    const position = editor.getCursorBufferPosition();
    editor.setText(stdout.toString());
    editor.setCursorBufferPosition(position);
  }).catch(error => {
    atom.notifications.addError(errors.toString(), {});
  });
};

export function activate(state) {
  atom.commands.add('atom-workspace', 'csso:minify', () => minify(false));
  atom.commands.add('atom-workspace', 'csso:restructre', () => minify(true));
};
