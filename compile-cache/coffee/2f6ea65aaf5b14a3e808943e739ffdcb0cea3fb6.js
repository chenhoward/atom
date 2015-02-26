(function() {
  var $, VimState, commands, motions, operators, panes, prefixes, utils, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('underscore-plus');

  $ = require('atom').$;

  operators = require('./operators');

  prefixes = require('./prefixes');

  commands = require('./commands');

  motions = require('./motions');

  utils = require('./utils');

  panes = require('./panes');

  module.exports = VimState = (function() {
    VimState.prototype.editor = null;

    VimState.prototype.opStack = null;

    VimState.prototype.mode = null;

    VimState.prototype.submode = null;

    VimState.prototype.registers = null;

    function VimState(editorView) {
      this.editorView = editorView;
      this.moveCursorBeforeNewline = __bind(this.moveCursorBeforeNewline, this);
      this.editor = this.editorView.editor;
      this.opStack = [];
      this.history = [];
      this.registers = {};
      this.mode = 'command';
      this.setupCommandMode();
      this.registerInsertIntercept();
      this.activateCommandMode();
      atom.project.eachBuffer((function(_this) {
        return function(buffer) {
          return _this.registerChangeHandler(buffer);
        };
      })(this));
    }

    VimState.prototype.registerInsertIntercept = function() {
      return this.editorView.preempt('textInput', (function(_this) {
        return function(e) {
          if ($(e.currentTarget).hasClass('mini')) {
            return;
          }
          if (_this.mode === 'insert') {
            return true;
          } else {
            _this.clearOpStack();
            return false;
          }
        };
      })(this));
    };

    VimState.prototype.registerChangeHandler = function(buffer) {
      return buffer.on('changed', (function(_this) {
        return function(_arg) {
          var newRange, newText, oldRange, oldText;
          newRange = _arg.newRange, newText = _arg.newText, oldRange = _arg.oldRange, oldText = _arg.oldText;
          if (_this.setRegister == null) {
            return;
          }
          if (newText === '') {
            return _this.setRegister('"', {
              text: oldText,
              type: utils.copyType(oldText)
            });
          }
        };
      })(this));
    };

    VimState.prototype.setupCommandMode = function() {
      return this.handleCommands({
        'activate-command-mode': (function(_this) {
          return function() {
            return _this.activateCommandMode();
          };
        })(this),
        'activate-insert-mode': (function(_this) {
          return function() {
            return _this.activateInsertMode();
          };
        })(this),
        'activate-linewise-visual-mode': (function(_this) {
          return function() {
            return _this.activateVisualMode('linewise');
          };
        })(this),
        'activate-characterwise-visual-mode': (function(_this) {
          return function() {
            return _this.activateVisualMode('characterwise');
          };
        })(this),
        'activate-blockwise-visual-mode': (function(_this) {
          return function() {
            return _this.activateVisualMode('blockwise');
          };
        })(this),
        'reset-command-mode': (function(_this) {
          return function() {
            return _this.resetCommandMode();
          };
        })(this),
        'substitute': (function(_this) {
          return function() {
            return new commands.Substitute(_this.editor, _this);
          };
        })(this),
        'substitute-line': (function(_this) {
          return function() {
            return new commands.SubstituteLine(_this.editor, _this);
          };
        })(this),
        'insert-after': (function(_this) {
          return function() {
            return new commands.InsertAfter(_this.editor, _this);
          };
        })(this),
        'insert-after-eol': (function(_this) {
          return function() {
            return [new motions.MoveToLastCharacterOfLine(_this.editor), new commands.InsertAfter(_this.editor, _this)];
          };
        })(this),
        'insert-at-bol': (function(_this) {
          return function() {
            return [new motions.MoveToFirstCharacterOfLine(_this.editor), new commands.Insert(_this.editor, _this)];
          };
        })(this),
        'insert-above-with-newline': (function(_this) {
          return function() {
            return new commands.InsertAboveWithNewline(_this.editor, _this);
          };
        })(this),
        'insert-below-with-newline': (function(_this) {
          return function() {
            return new commands.InsertBelowWithNewline(_this.editor, _this);
          };
        })(this),
        'delete': (function(_this) {
          return function() {
            return _this.linewiseAliasedOperator(operators.Delete);
          };
        })(this),
        'change': (function(_this) {
          return function() {
            return _this.linewiseAliasedOperator(operators.Change);
          };
        })(this),
        'change-to-last-character-of-line': (function(_this) {
          return function() {
            return [new operators.Change(_this.editor, _this), new motions.MoveToLastCharacterOfLine(_this.editor)];
          };
        })(this),
        'delete-right': (function(_this) {
          return function() {
            return [new operators.Delete(_this.editor), new motions.MoveRight(_this.editor)];
          };
        })(this),
        'delete-left': (function(_this) {
          return function() {
            return [new operators.Delete(_this.editor), new motions.MoveLeft(_this.editor)];
          };
        })(this),
        'delete-to-last-character-of-line': (function(_this) {
          return function() {
            return [new operators.Delete(_this.editor), new motions.MoveToLastCharacterOfLine(_this.editor)];
          };
        })(this),
        'yank': (function(_this) {
          return function() {
            return _this.linewiseAliasedOperator(operators.Yank);
          };
        })(this),
        'yank-line': (function(_this) {
          return function() {
            return [new operators.Yank(_this.editor, _this), new motions.MoveToLine(_this.editor)];
          };
        })(this),
        'put-before': (function(_this) {
          return function() {
            return new operators.Put(_this.editor, _this, {
              location: 'before'
            });
          };
        })(this),
        'put-after': (function(_this) {
          return function() {
            return new operators.Put(_this.editor, _this, {
              location: 'after'
            });
          };
        })(this),
        'join': (function(_this) {
          return function() {
            return new operators.Join(_this.editor);
          };
        })(this),
        'indent': (function(_this) {
          return function() {
            return _this.linewiseAliasedOperator(operators.Indent);
          };
        })(this),
        'outdent': (function(_this) {
          return function() {
            return _this.linewiseAliasedOperator(operators.Outdent);
          };
        })(this),
        'select-left': (function(_this) {
          return function() {
            return new motions.SelectLeft(_this.editor);
          };
        })(this),
        'select-right': (function(_this) {
          return function() {
            return new motions.SelectRight(_this.editor);
          };
        })(this),
        'move-left': (function(_this) {
          return function() {
            return new motions.MoveLeft(_this.editor);
          };
        })(this),
        'move-up': (function(_this) {
          return function() {
            return new motions.MoveUp(_this.editor);
          };
        })(this),
        'move-down': (function(_this) {
          return function() {
            return new motions.MoveDown(_this.editor);
          };
        })(this),
        'move-right': (function(_this) {
          return function() {
            return new motions.MoveRight(_this.editor);
          };
        })(this),
        'move-to-next-word': (function(_this) {
          return function() {
            return new motions.MoveToNextWord(_this.editor);
          };
        })(this),
        'move-to-next-whole-word': (function(_this) {
          return function() {
            return new motions.MoveToNextWholeWord(_this.editor);
          };
        })(this),
        'move-to-end-of-word': (function(_this) {
          return function() {
            return new motions.MoveToEndOfWord(_this.editor);
          };
        })(this),
        'move-to-previous-word': (function(_this) {
          return function() {
            return new motions.MoveToPreviousWord(_this.editor);
          };
        })(this),
        'move-to-previous-whole-word': (function(_this) {
          return function() {
            return new motions.MoveToPreviousWholeWord(_this.editor);
          };
        })(this),
        'move-to-next-paragraph': (function(_this) {
          return function() {
            return new motions.MoveToNextParagraph(_this.editor);
          };
        })(this),
        'move-to-previous-paragraph': (function(_this) {
          return function() {
            return new motions.MoveToPreviousParagraph(_this.editor);
          };
        })(this),
        'move-to-first-character-of-line': (function(_this) {
          return function() {
            return new motions.MoveToFirstCharacterOfLine(_this.editor);
          };
        })(this),
        'move-to-last-character-of-line': (function(_this) {
          return function() {
            return new motions.MoveToLastCharacterOfLine(_this.editor);
          };
        })(this),
        'move-to-beginning-of-line': (function(_this) {
          return function(e) {
            return _this.moveOrRepeat(e);
          };
        })(this),
        'move-to-start-of-file': (function(_this) {
          return function() {
            return new motions.MoveToStartOfFile(_this.editor);
          };
        })(this),
        'move-to-line': (function(_this) {
          return function() {
            return new motions.MoveToLine(_this.editor);
          };
        })(this),
        'move-to-top-of-screen': (function(_this) {
          return function() {
            return new motions.MoveToTopOfScreen(_this.editor, _this.editorView);
          };
        })(this),
        'move-to-bottom-of-screen': (function(_this) {
          return function() {
            return new motions.MoveToBottomOfScreen(_this.editor, _this.editorView);
          };
        })(this),
        'move-to-middle-of-screen': (function(_this) {
          return function() {
            return new motions.MoveToMiddleOfScreen(_this.editor, _this.editorView);
          };
        })(this),
        'register-prefix': (function(_this) {
          return function(e) {
            return _this.registerPrefix(e);
          };
        })(this),
        'repeat-prefix': (function(_this) {
          return function(e) {
            return _this.repeatPrefix(e);
          };
        })(this),
        'repeat': (function(_this) {
          return function(e) {
            return new operators.Repeat(_this.editor, _this);
          };
        })(this),
        'focus-pane-view-on-left': (function(_this) {
          return function() {
            return new panes.FocusPaneViewOnLeft();
          };
        })(this),
        'focus-pane-view-on-right': (function(_this) {
          return function() {
            return new panes.FocusPaneViewOnRight();
          };
        })(this),
        'focus-pane-view-above': (function(_this) {
          return function() {
            return new panes.FocusPaneViewAbove();
          };
        })(this),
        'focus-pane-view-below': (function(_this) {
          return function() {
            return new panes.FocusPaneViewBelow();
          };
        })(this),
        'focus-previous-pane-view': (function(_this) {
          return function() {
            return new panes.FocusPreviousPaneView();
          };
        })(this)
      });
    };

    VimState.prototype.handleCommands = function(commands) {
      return _.each(commands, (function(_this) {
        return function(fn, commandName) {
          var eventName;
          eventName = "vim-mode:" + commandName;
          return _this.editorView.command(eventName, function(e) {
            var possibleOperator, possibleOperators, _i, _len, _results;
            possibleOperators = fn(e);
            possibleOperators = _.isArray(possibleOperators) ? possibleOperators : [possibleOperators];
            _results = [];
            for (_i = 0, _len = possibleOperators.length; _i < _len; _i++) {
              possibleOperator = possibleOperators[_i];
              if (_this.mode === 'visual' && possibleOperator instanceof motions.Motion) {
                possibleOperator.origExecute = possibleOperator.execute;
                possibleOperator.execute = possibleOperator.select;
              }
              if (possibleOperator != null ? possibleOperator.execute : void 0) {
                _this.pushOperator(possibleOperator);
              }
              if (_this.mode === 'visual' && possibleOperator instanceof operators.Operator) {
                _this.pushOperator(new motions.CurrentSelection(_this));
                if (_this.mode === 'visual') {
                  _results.push(_this.activateCommandMode());
                } else {
                  _results.push(void 0);
                }
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          });
        };
      })(this));
    };

    VimState.prototype.moveCursorBeforeNewline = function() {
      if (!this.editor.getSelection().modifyingSelection && this.editor.cursor.isOnEOL() && this.editor.getCurrentBufferLine().length > 0) {
        return this.editor.setCursorBufferColumn(this.editor.getCurrentBufferLine().length - 1);
      }
    };

    VimState.prototype.pushOperator = function(operation) {
      this.opStack.push(operation);
      return this.processOpStack();
    };

    VimState.prototype.clearOpStack = function() {
      return this.opStack = [];
    };

    VimState.prototype.processOpStack = function() {
      var e, poppedOperator;
      if (!this.topOperator().isComplete()) {
        return;
      }
      poppedOperator = this.opStack.pop();
      if (this.opStack.length) {
        try {
          this.topOperator().compose(poppedOperator);
          return this.processOpStack();
        } catch (_error) {
          e = _error;
          return (e instanceof operators.OperatorError) && this.resetCommandMode() || (function() {
            throw e;
          })();
        }
      } else {
        if (poppedOperator.isRecordable()) {
          this.history.unshift(poppedOperator);
        }
        return poppedOperator.execute();
      }
    };

    VimState.prototype.topOperator = function() {
      return _.last(this.opStack);
    };

    VimState.prototype.getRegister = function(name) {
      var text, type;
      if (name === '*') {
        text = atom.clipboard.read();
        type = utils.copyType(text);
        return {
          text: text,
          type: type
        };
      } else {
        return this.registers[name];
      }
    };

    VimState.prototype.setRegister = function(name, value) {
      if (name === '*') {
        return atom.clipboard.write(value.text);
      } else {
        return this.registers[name] = value;
      }
    };

    VimState.prototype.activateCommandMode = function() {
      var cursor;
      this.mode = 'command';
      this.submode = null;
      if (this.editorView.is(".insert-mode")) {
        cursor = this.editor.getCursor();
        if (!cursor.isAtBeginningOfLine()) {
          cursor.moveLeft();
        }
      }
      this.editorView.removeClass('insert-mode visual-mode');
      this.editorView.addClass('command-mode');
      this.editor.clearSelections();
      return this.editorView.on('cursor:position-changed', this.moveCursorBeforeNewline);
    };

    VimState.prototype.activateInsertMode = function() {
      this.mode = 'insert';
      this.submode = null;
      this.editorView.removeClass('command-mode visual-mode');
      this.editorView.addClass('insert-mode');
      return this.editorView.off('cursor:position-changed', this.moveCursorBeforeNewline);
    };

    VimState.prototype.activateVisualMode = function(type) {
      this.mode = 'visual';
      this.submode = type;
      this.editorView.removeClass('command-mode insert-mode');
      this.editorView.addClass('visual-mode');
      this.editor.off('cursor:position-changed', this.moveCursorBeforeNewline);
      if (this.submode === 'linewise') {
        return this.editor.selectLine();
      }
    };

    VimState.prototype.resetCommandMode = function() {
      return this.clearOpStack();
    };

    VimState.prototype.registerPrefix = function(e) {
      var name;
      name = atom.keymap.keystrokeStringForEvent(e.originalEvent);
      return this.pushOperator(new prefixes.Register(name));
    };

    VimState.prototype.repeatPrefix = function(e) {
      var num;
      num = parseInt(atom.keymap.keystrokeStringForEvent(e.originalEvent));
      if (this.topOperator() instanceof prefixes.Repeat) {
        return this.topOperator().addDigit(num);
      } else {
        return this.pushOperator(new prefixes.Repeat(num));
      }
    };

    VimState.prototype.moveOrRepeat = function(e) {
      if (this.topOperator() instanceof prefixes.Repeat) {
        return this.repeatPrefix(e);
      } else {
        return new motions.MoveToBeginningOfLine(this.editor);
      }
    };

    VimState.prototype.linewiseAliasedOperator = function(constructor) {
      if (this.isOperatorPending(constructor)) {
        return new motions.MoveToLine(this.editor);
      } else {
        return new constructor(this.editor, this);
      }
    };

    VimState.prototype.isOperatorPending = function(constructor) {
      var op, _i, _len, _ref;
      _ref = this.opStack;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        op = _ref[_i];
        if (op instanceof constructor) {
          return op;
        }
      }
      return false;
    };

    return VimState;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9FQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNDLElBQUssT0FBQSxDQUFRLE1BQVIsRUFBTCxDQURELENBQUE7O0FBQUEsRUFHQSxTQUFBLEdBQVksT0FBQSxDQUFRLGFBQVIsQ0FIWixDQUFBOztBQUFBLEVBSUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSLENBSlgsQ0FBQTs7QUFBQSxFQUtBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUixDQUxYLENBQUE7O0FBQUEsRUFNQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVIsQ0FOVixDQUFBOztBQUFBLEVBT0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSLENBUFIsQ0FBQTs7QUFBQSxFQVFBLEtBQUEsR0FBUSxPQUFBLENBQVEsU0FBUixDQVJSLENBQUE7O0FBQUEsRUFVQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osdUJBQUEsTUFBQSxHQUFRLElBQVIsQ0FBQTs7QUFBQSx1QkFDQSxPQUFBLEdBQVMsSUFEVCxDQUFBOztBQUFBLHVCQUVBLElBQUEsR0FBTSxJQUZOLENBQUE7O0FBQUEsdUJBR0EsT0FBQSxHQUFTLElBSFQsQ0FBQTs7QUFBQSx1QkFJQSxTQUFBLEdBQVcsSUFKWCxDQUFBOztBQU1hLElBQUEsa0JBQUUsVUFBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsYUFBQSxVQUNiLENBQUE7QUFBQSwrRUFBQSxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxVQUFVLENBQUMsTUFBdEIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxFQURYLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxP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
//# sourceURL=/Users/howardchen/.atom/packages/vim-mode/lib/vim-state.coffee