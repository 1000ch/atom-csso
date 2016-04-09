'use babel';

import { normalize, join } from 'path';
import { spawn } from 'child_process';

const CSSO_PATH = normalize(join(__dirname, 'node_modules', '.bin', 'csso'));

function minify(restructure = false) {
  const editor = atom.workspace.getActiveTextEditor();

  if (!editor) {
    return;
  }

  let args = ['--input', editor.getPath()];
  if (!restructure) {
    args.push('--restructure-off');
  }

  let chunks = [];
  let cp = spawn(CSSO_PATH, args);
  cp.stdout.on('data', chunk => {
    chunks.push(chunk);
  });

  cp.on('error', error => {
    console.error(error);
  });

  cp.on('exit', _ => {
    let position = editor.getCursorBufferPosition();
    editor.setText(Buffer.concat(chunks).toString());
    editor.setCursorBufferPosition(position);
  });
};

export function activate(state) {
  atom.commands.add('atom-workspace', 'csso:minify', () => minify(false));
  atom.commands.add('atom-workspace', 'csso:restructre', () => minify(true));
};
