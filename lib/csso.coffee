'use strict';

fs = require('fs')
path = require('path')

CSSO = require('csso')

module.exports =

  activate: (state) ->
    atom.commands.add 'atom-workspace', 'csso:execute', => @execute()
    atom.commands.add 'atom-workspace', 'csso:restructure', => @restructure()

  getExecPath: ->
    "ATOM_SHELL_INTERNAL_RUN_AS_NODE=1 '#{process.execPath}'"

  getNodePath: ->
    atom.config.get('csso.nodepath')

  execute: ->
    editor = atom.workspace.getActiveTextEditor()

    return unless editor isnt no

    grammarName = editor.getGrammar().name.toLowerCase()
    isCSS = grammarName is 'css'
    isHTML = grammarName is 'html'

    syntax = 'css'
    if isCSS then syntax = 'css'
    if isHTML then syntax = 'css'

    text = editor.getText()
    selectedText = editor.getSelectedText()

    if selectedText.length isnt 0
      try
        optimizedText = CSSO.justDoIt(selectedText)
        editor.setTextInBufferRange(editor.getSelectedBufferRange(), optimizedText)
      catch e
        console.log(e)
    else
      try
        optimizedText = CSSO.justDoIt(text)
        editor.setText(optimizedText)
      catch e
        console.log(e)

  restructure: ->
    editor = atom.workspace.getActiveTextEditor()

    return unless editor isnt no

    grammarName = editor.getGrammar().name.toLowerCase()
    isCSS = grammarName is 'css'
    isHTML = grammarName is 'html'

    syntax = 'css'
    if isCSS then syntax = 'css'
    if isHTML then syntax = 'css'

    text = editor.getText()
    selectedText = editor.getSelectedText()

    if selectedText.length isnt 0
      try
        optimizedText = CSSO.justDoIt(selectedText, yes)
        editor.setTextInBufferRange(editor.getSelectedBufferRange(), optimizedText)
      catch e
        console.log(e)
    else
      try
        optimizedText = CSSO.justDoIt(text, yes)
        editor.setText(optimizedText)
      catch e
        console.log(e) 