(function() {
  var TextEditorView, View, VimCommandModeInputView, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), View = _ref.View, TextEditorView = _ref.TextEditorView;

  module.exports = VimCommandModeInputView = (function(_super) {
    __extends(VimCommandModeInputView, _super);

    function VimCommandModeInputView() {
      this.remove = __bind(this.remove, this);
      this.cancel = __bind(this.cancel, this);
      this.focus = __bind(this.focus, this);
      this.confirm = __bind(this.confirm, this);
      this.autosubmit = __bind(this.autosubmit, this);
      return VimCommandModeInputView.__super__.constructor.apply(this, arguments);
    }

    VimCommandModeInputView.content = function() {
      return this.div({
        "class": 'command-mode-input'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'editor-container',
            outlet: 'editorContainer'
          }, function() {
            return _this.subview('editor', new TextEditorView({
              mini: true
            }));
          });
        };
      })(this));
    };

    VimCommandModeInputView.prototype.initialize = function(viewModel, opts) {
      var _ref1;
      this.viewModel = viewModel;
      if (opts == null) {
        opts = {};
      }
      if (opts["class"] != null) {
        this.editorContainer.addClass(opts["class"]);
      }
      if (opts.hidden) {
        this.editorContainer.addClass('hidden-input');
      }
      this.singleChar = opts.singleChar;
      this.defaultText = (_ref1 = opts.defaultText) != null ? _ref1 : '';
      atom.workspace.addBottomPanel({
        item: this,
        priority: 100
      });
      this.focus();
      return this.handleEvents();
    };

    VimCommandModeInputView.prototype.handleEvents = function() {
      if (this.singleChar != null) {
        this.editor.find('input').on('textInput', this.autosubmit);
      }
      this.editor.on('core:confirm', this.confirm);
      this.editor.on('core:cancel', this.cancel);
      return this.editor.find('input').on('blur', this.cancel);
    };

    VimCommandModeInputView.prototype.stopHandlingEvents = function() {
      if (this.singleChar != null) {
        this.editor.find('input').off('textInput', this.autosubmit);
      }
      this.editor.off('core:confirm', this.confirm);
      this.editor.off('core:cancel', this.cancel);
      return this.editor.find('input').off('blur', this.cancel);
    };

    VimCommandModeInputView.prototype.autosubmit = function(event) {
      this.editor.setText(event.originalEvent.data);
      return this.confirm();
    };

    VimCommandModeInputView.prototype.confirm = function() {
      this.value = this.editor.getText() || this.defaultText;
      this.viewModel.confirm(this);
      return this.remove();
    };

    VimCommandModeInputView.prototype.focus = function() {
      return this.editorContainer.find('.editor').focus();
    };

    VimCommandModeInputView.prototype.cancel = function(e) {
      this.viewModel.cancel(this);
      return this.remove();
    };

    VimCommandModeInputView.prototype.remove = function() {
      this.stopHandlingEvents();
      atom.workspace.getActivePane().activate();
      return VimCommandModeInputView.__super__.remove.call(this);
    };

    return VimCommandModeInputView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1EQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBeUIsT0FBQSxDQUFRLE1BQVIsQ0FBekIsRUFBQyxZQUFBLElBQUQsRUFBTyxzQkFBQSxjQUFQLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osOENBQUEsQ0FBQTs7Ozs7Ozs7O0tBQUE7O0FBQUEsSUFBQSx1QkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sb0JBQVA7T0FBTCxFQUFrQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNoQyxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sa0JBQVA7QUFBQSxZQUEyQixNQUFBLEVBQVEsaUJBQW5DO1dBQUwsRUFBMkQsU0FBQSxHQUFBO21CQUN6RCxLQUFDLENBQUEsT0FBRCxDQUFTLFFBQVQsRUFBdUIsSUFBQSxjQUFBLENBQWU7QUFBQSxjQUFBLElBQUEsRUFBTSxJQUFOO2FBQWYsQ0FBdkIsRUFEeUQ7VUFBQSxDQUEzRCxFQURnQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsc0NBS0EsVUFBQSxHQUFZLFNBQUUsU0FBRixFQUFhLElBQWIsR0FBQTtBQUNWLFVBQUEsS0FBQTtBQUFBLE1BRFcsSUFBQyxDQUFBLFlBQUEsU0FDWixDQUFBOztRQUR1QixPQUFPO09BQzlCO0FBQUEsTUFBQSxJQUFHLHFCQUFIO0FBQ0UsUUFBQSxJQUFDLENBQUEsZUFBZSxDQUFDLFFBQWpCLENBQTBCLElBQUksQ0FBQyxPQUFELENBQTlCLENBQUEsQ0FERjtP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
//# sourceURL=/Users/howardchen/.atom/packages/vim-mode/lib/view-models/vim-command-mode-input-view.coffee