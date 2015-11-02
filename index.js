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
    let minifiedCSS = csso.minify(selectedText, option);
    if (minifiedCSS) {
      editor.setTextInBufferRange(
        editor.getSelectedBufferRange(),
        minifiedCSS
      );
    }
  } else {
    let minifiedCSS = csso.minify(text, option);
    if (minifiedCSS) {
      editor.setText(minifiedCSS);
    }
  }

  editor.setCursorBufferPosition(position);
};

export const activate = (state) => {
  atom.commands.add('atom-workspace', 'csso:minify', () => minify(false));
  atom.commands.add('atom-workspace', 'csso:restructre', () => minify(true));
};
