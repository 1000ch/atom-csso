'use babel';

import fs from 'fs';
import csso from 'csso';

const minify = (restructuring = false) => {

  const editor = atom.workspace.getActiveTextEditor();

  if (!editor) {
    return;
  }

  let position = editor.getCursorBufferPosition();
  let text = editor.getText();
  let selectedText = editor.getSelectedText();
  let option = { restructuring };

  if (selectedText.length !== 0) {
    let css = csso.minify(selectedText, option);
    if (css) {
      let range = editor.getSelectedBufferRange();
      editor.setTextInBufferRange(range, css);
    }
  } else {
    let css = csso.minify(text, option);
    if (css) {
      editor.setText(css);
    }
  }

  editor.setCursorBufferPosition(position);
};

export const activate = (state) => {
  atom.commands.add('atom-workspace', 'csso:minify', () => minify(false));
  atom.commands.add('atom-workspace', 'csso:restructre', () => minify(true));
};
