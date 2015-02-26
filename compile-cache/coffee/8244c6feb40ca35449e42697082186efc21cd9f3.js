(function() {
  var AdjustIndentation, Autoindent, Indent, Operator, Outdent,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Operator = require('./general-operators').Operator;

  AdjustIndentation = (function(_super) {
    __extends(AdjustIndentation, _super);

    function AdjustIndentation() {
      return AdjustIndentation.__super__.constructor.apply(this, arguments);
    }

    AdjustIndentation.prototype.execute = function(count) {
      var mode, start;
      if (count == null) {
        count = 1;
      }
      mode = this.vimState.mode;
      this.motion.select(count);
      start = this.editor.getSelectedBufferRange().start;
      this.indent();
      if (mode !== 'visual') {
        this.editor.setCursorBufferPosition([start.row, 0]);
        this.editor.moveToFirstCharacterOfLine();
        return this.vimState.activateCommandMode();
      }
    };

    return AdjustIndentation;

  })(Operator);

  Indent = (function(_super) {
    __extends(Indent, _super);

    function Indent() {
      return Indent.__super__.constructor.apply(this, arguments);
    }

    Indent.prototype.indent = function() {
      return this.editor.indentSelectedRows();
    };

    return Indent;

  })(AdjustIndentation);

  Outdent = (function(_super) {
    __extends(Outdent, _super);

    function Outdent() {
      return Outdent.__super__.constructor.apply(this, arguments);
    }

    Outdent.prototype.indent = function() {
      return this.editor.outdentSelectedRows();
    };

    return Outdent;

  })(AdjustIndentation);

  Autoindent = (function(_super) {
    __extends(Autoindent, _super);

    function Autoindent() {
      return Autoindent.__super__.constructor.apply(this, arguments);
    }

    Autoindent.prototype.indent = function() {
      return this.editor.autoIndentSelectedRows();
    };

    return Autoindent;

  })(AdjustIndentation);

  module.exports = {
    Indent: Indent,
    Outdent: Outdent,
    Autoindent: Autoindent
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxXQUFZLE9BQUEsQ0FBUSxxQkFBUixFQUFaLFFBQUQsQ0FBQTs7QUFBQSxFQUVNO0FBQ0osd0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLGdDQUFBLE9BQUEsR0FBUyxTQUFDLEtBQUQsR0FBQTtBQUNQLFVBQUEsV0FBQTs7UUFEUSxRQUFNO09BQ2Q7QUFBQSxNQUFBLElBQUEsR0FBTyxJQUFDLENBQUEsUUFBUSxDQUFDLElBQWpCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixDQUFlLEtBQWYsQ0FEQSxDQUFBO0FBQUEsTUFFQyxRQUFTLElBQUMsQ0FBQSxNQUFNLENBQUMsc0JBQVIsQ0FBQSxFQUFULEtBRkQsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUpBLENBQUE7QUFNQSxNQUFBLElBQUcsSUFBQSxLQUFVLFFBQWI7QUFDRSxRQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsdUJBQVIsQ0FBZ0MsQ0FBQyxLQUFLLENBQUMsR0FBUCxFQUFZLENBQVosQ0FBaEMsQ0FBQSxDQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsTUFBTSxDQUFDLDBCQUFSLENBQUEsQ0FEQSxDQUFBO2VBRUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxtQkFBVixDQUFBLEVBSEY7T0FQTztJQUFBLENBQVQsQ0FBQTs7NkJBQUE7O0tBRDhCLFNBRmhDLENBQUE7O0FBQUEsRUFlTTtBQUNKLDZCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxxQkFBQSxNQUFBLEdBQVEsU0FBQSxHQUFBO2FBQ04sSUFBQyxDQUFBLE1BQU0sQ0FBQyxrQkFBUixDQUFBLEVBRE07SUFBQSxDQUFSLENBQUE7O2tCQUFBOztLQURtQixrQkFmckIsQ0FBQTs7QUFBQSxFQW1CTTtBQUNKLDhCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxzQkFBQSxNQUFBLEdBQVEsU0FBQSxHQUFBO2FBQ04sSUFBQyxDQUFBLE1BQU0sQ0FBQyxtQkFBUixDQUFBLEVBRE07SUFBQSxDQUFSLENBQUE7O21CQUFBOztLQURvQixrQkFuQnRCLENBQUE7O0FBQUEsRUF1Qk07QUFDSixpQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEseUJBQUEsTUFBQSxHQUFRLFNBQUEsR0FBQTthQUNOLElBQUMsQ0FBQSxNQUFNLENBQUMsc0JBQVIsQ0FBQSxFQURNO0lBQUEsQ0FBUixDQUFBOztzQkFBQTs7S0FEdUIsa0JBdkJ6QixDQUFBOztBQUFBLEVBMkJBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBQUEsSUFBQyxRQUFBLE1BQUQ7QUFBQSxJQUFTLFNBQUEsT0FBVDtBQUFBLElBQWtCLFlBQUEsVUFBbEI7R0EzQmpCLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/howardchen/.atom/packages/vim-mode/lib/operators/indent-operators.coffee