'use babel';

import os from 'os';
import path from 'path';
import execa from 'execa';

const unix = path.normalize(path.join(__dirname, 'node_modules', '.bin', 'csso'));
const win = path.normalize(path.join(__dirname, 'node_modules', '.bin', 'csso.cmd'));
const csso = os.type() === 'Windows_NT' ? win : unix;

export function activate() {
  atom.commands.add('atom-text-editor:not([mini])', 'csso:minify', () => {
    minify(atom.workspace.getActiveTextEditor());
  });
}

export function minify(editor) {
  if (!editor) {
    return Promise.reject(new Error('Editor is invalid'));
  }

  const grammar = editor.getGrammar().name.toLowerCase();

  if ('css' !== grammar) {
    return Promise.reject(new Error(`${grammar} is not supported.`));
  }

  const args = atom.config.get('csso.restructure') ? [] : ['--no-restructure'];
  const buffer = Buffer.from(editor.getText());

  return process(args, buffer)
    .then(result => setText(editor, result.stdout.toString()))
    .catch(error => atom.notifications.addError(error.toString(), {}));
}

function process(args, buffer) {
  return execa(csso, args, {
    encoding: null,
    input: buffer
  });
}

function setText(editor, text) {
  const position = editor.getCursorBufferPosition();
  editor.setText(text);
  editor.setCursorBufferPosition(position);
  return editor;
}
