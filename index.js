'use babel';

import { type } from 'os';
import { normalize, join } from 'path';
import execa from 'execa';

const unix = normalize(join(__dirname, 'node_modules', '.bin', 'csso'));
const win = normalize(join(__dirname, 'node_modules', '.bin', 'csso.cmd'));
const csso = type() === 'Windows_NT' ? win : unix;

let subscriptions;
let restructure;

export function activate(state) {
  subscriptions = new CompositeDisposable();
  subscriptions.add(atom.config.observe('csso.restructure', value => {
    restructure = value;
  }));

  atom.commands.add('atom-workspace', 'csso:minify', () => minify());
};

export function deactivate() {
  subscriptions.dispose();
}

function minify() {
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
