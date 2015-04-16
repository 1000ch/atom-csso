{View} = require 'atom'

module.exports =
  class AtomCssoView extends View
    @content: ->
      @div class: 'atom-csso overlay from-top', =>
        @div "The AtomCsso package is Alive! It's ALIVE!", class: "message"

    initialize: (serializeState) ->
      atom.commands.add 'atom-workspace', 'csso:execute', => @execute()
      atom.commands.add 'atom-workspace', 'csso:restructure', => @restructure()

    # Returns an object that can be retrieved when package is activated
    serialize: ->

      # Tear down any state and detach
    destroy: ->
      @detach()

    execute: ->
      if @hasParent()
        @detach()
      else
        atom.workspace.addModalPanel(item: this)