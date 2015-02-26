(function() {
  var AllWhitespace, Range, SelectAWord, SelectInsideBrackets, SelectInsideQuotes, SelectInsideWord, TextObject,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Range = require('atom').Range;

  AllWhitespace = /^\s$/;

  TextObject = (function() {
    function TextObject(editor, state) {
      this.editor = editor;
      this.state = state;
    }

    TextObject.prototype.isComplete = function() {
      return true;
    };

    TextObject.prototype.isRecordable = function() {
      return false;
    };

    return TextObject;

  })();

  SelectInsideWord = (function(_super) {
    __extends(SelectInsideWord, _super);

    function SelectInsideWord() {
      return SelectInsideWord.__super__.constructor.apply(this, arguments);
    }

    SelectInsideWord.prototype.select = function() {
      this.editor.selectWordsContainingCursors();
      return [true];
    };

    return SelectInsideWord;

  })(TextObject);

  SelectInsideQuotes = (function(_super) {
    __extends(SelectInsideQuotes, _super);

    function SelectInsideQuotes(editor, char, includeQuotes) {
      this.editor = editor;
      this.char = char;
      this.includeQuotes = includeQuotes;
    }

    SelectInsideQuotes.prototype.findOpeningQuote = function(pos) {
      var line, start;
      start = pos.copy();
      pos = pos.copy();
      while (pos.row >= 0) {
        line = this.editor.lineTextForBufferRow(pos.row);
        if (pos.column === -1) {
          pos.column = line.length - 1;
        }
        while (pos.column >= 0) {
          if (line[pos.column] === this.char) {
            if (pos.column === 0 || line[pos.column - 1] !== '\\') {
              if (this.isStartQuote(pos)) {
                return pos;
              } else {
                return this.lookForwardOnLine(start);
              }
            }
          }
          --pos.column;
        }
        pos.column = -1;
        --pos.row;
      }
      return this.lookForwardOnLine(start);
    };

    SelectInsideQuotes.prototype.isStartQuote = function(end) {
      var line, numQuotes;
      line = this.editor.lineTextForBufferRow(end.row);
      numQuotes = line.substring(0, end.column + 1).replace("'" + this.char, '').split(this.char).length - 1;
      return numQuotes % 2;
    };

    SelectInsideQuotes.prototype.lookForwardOnLine = function(pos) {
      var index, line;
      line = this.editor.lineTextForBufferRow(pos.row);
      index = line.substring(pos.column).indexOf(this.char);
      if (index >= 0) {
        pos.column += index;
        return pos;
      }
      return null;
    };

    SelectInsideQuotes.prototype.findClosingQuote = function(start) {
      var end, endLine, escaping;
      end = start.copy();
      escaping = false;
      while (end.row < this.editor.getLineCount()) {
        endLine = this.editor.lineTextForBufferRow(end.row);
        while (end.column < endLine.length) {
          if (endLine[end.column] === '\\') {
            ++end.column;
          } else if (endLine[end.column] === this.char) {
            if (this.includeQuotes) {
              --start.column;
            }
            if (this.includeQuotes) {
              ++end.column;
            }
            return end;
          }
          ++end.column;
        }
        end.column = 0;
        ++end.row;
      }
    };

    SelectInsideQuotes.prototype.select = function() {
      var end, selection, start, _i, _len, _ref, _results;
      _ref = this.editor.getSelections();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        selection = _ref[_i];
        start = this.findOpeningQuote(selection.cursor.getBufferPosition());
        if (start != null) {
          ++start.column;
          end = this.findClosingQuote(start);
          if (end != null) {
            selection.setBufferRange([start, end]);
          }
        }
        _results.push(!selection.isEmpty());
      }
      return _results;
    };

    return SelectInsideQuotes;

  })(TextObject);

  SelectInsideBrackets = (function(_super) {
    __extends(SelectInsideBrackets, _super);

    function SelectInsideBrackets(editor, beginChar, endChar, includeBrackets) {
      this.editor = editor;
      this.beginChar = beginChar;
      this.endChar = endChar;
      this.includeBrackets = includeBrackets;
    }

    SelectInsideBrackets.prototype.findOpeningBracket = function(pos) {
      var depth, line;
      pos = pos.copy();
      depth = 0;
      while (pos.row >= 0) {
        line = this.editor.lineTextForBufferRow(pos.row);
        if (pos.column === -1) {
          pos.column = line.length - 1;
        }
        while (pos.column >= 0) {
          switch (line[pos.column]) {
            case this.endChar:
              ++depth;
              break;
            case this.beginChar:
              if (--depth < 0) {
                return pos;
              }
          }
          --pos.column;
        }
        pos.column = -1;
        --pos.row;
      }
    };

    SelectInsideBrackets.prototype.findClosingBracket = function(start) {
      var depth, end, endLine;
      end = start.copy();
      depth = 0;
      while (end.row < this.editor.getLineCount()) {
        endLine = this.editor.lineTextForBufferRow(end.row);
        while (end.column < endLine.length) {
          switch (endLine[end.column]) {
            case this.beginChar:
              ++depth;
              break;
            case this.endChar:
              if (--depth < 0) {
                if (this.includeBrackets) {
                  --start.column;
                }
                if (this.includeBrackets) {
                  ++end.column;
                }
                return end;
              }
          }
          ++end.column;
        }
        end.column = 0;
        ++end.row;
      }
    };

    SelectInsideBrackets.prototype.select = function() {
      var end, selection, start, _i, _len, _ref, _results;
      _ref = this.editor.getSelections();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        selection = _ref[_i];
        start = this.findOpeningBracket(selection.cursor.getBufferPosition());
        if (start != null) {
          ++start.column;
          end = this.findClosingBracket(start);
          if (end != null) {
            selection.setBufferRange([start, end]);
          }
        }
        _results.push(!selection.isEmpty());
      }
      return _results;
    };

    return SelectInsideBrackets;

  })(TextObject);

  SelectAWord = (function(_super) {
    __extends(SelectAWord, _super);

    function SelectAWord() {
      return SelectAWord.__super__.constructor.apply(this, arguments);
    }

    SelectAWord.prototype.select = function() {
      var char, endPoint, selection, _i, _len, _ref, _results;
      _ref = this.editor.getSelections();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        selection = _ref[_i];
        selection.selectWord();
        while (true) {
          endPoint = selection.getBufferRange().end;
          char = this.editor.getTextInRange(Range.fromPointWithDelta(endPoint, 0, 1));
          if (!AllWhitespace.test(char)) {
            break;
          }
          selection.selectRight();
        }
        _results.push(true);
      }
      return _results;
    };

    return SelectAWord;

  })(TextObject);

  module.exports = {
    TextObject: TextObject,
    SelectInsideWord: SelectInsideWord,
    SelectInsideQuotes: SelectInsideQuotes,
    SelectInsideBrackets: SelectInsideBrackets,
    SelectAWord: SelectAWord
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlHQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxRQUFTLE9BQUEsQ0FBUSxNQUFSLEVBQVQsS0FBRCxDQUFBOztBQUFBLEVBQ0EsYUFBQSxHQUFnQixNQURoQixDQUFBOztBQUFBLEVBR007QUFDUyxJQUFBLG9CQUFFLE1BQUYsRUFBVyxLQUFYLEdBQUE7QUFBbUIsTUFBbEIsSUFBQyxDQUFBLFNBQUEsTUFBaUIsQ0FBQTtBQUFBLE1BQVQsSUFBQyxDQUFBLFFBQUEsS0FBUSxDQUFuQjtJQUFBLENBQWI7O0FBQUEseUJBRUEsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUFHLEtBQUg7SUFBQSxDQUZaLENBQUE7O0FBQUEseUJBR0EsWUFBQSxHQUFjLFNBQUEsR0FBQTthQUFHLE1BQUg7SUFBQSxDQUhkLENBQUE7O3NCQUFBOztNQUpGLENBQUE7O0FBQUEsRUFTTTtBQUNKLHVDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSwrQkFBQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ04sTUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLDRCQUFSLENBQUEsQ0FBQSxDQUFBO2FBQ0EsQ0FBQyxJQUFELEVBRk07SUFBQSxDQUFSLENBQUE7OzRCQUFBOztLQUQ2QixXQVQvQixDQUFBOztBQUFBLEVBa0JNO0FBQ0oseUNBQUEsQ0FBQTs7QUFBYSxJQUFBLDRCQUFFLE1BQUYsRUFBVyxJQUFYLEVBQWtCLGFBQWxCLEdBQUE7QUFBa0MsTUFBakMsSUFBQyxDQUFBLFNBQUEsTUFBZ0MsQ0FBQTtBQUFBLE1BQXhCLElBQUMsQ0FBQSxPQUFBLElBQXVCLENBQUE7QUFBQSxNQUFqQixJQUFDLENBQUEsZ0JBQUEsYUFBZ0IsQ0FBbEM7SUFBQSxDQUFiOztBQUFBLGlDQUVBLGdCQUFBLEdBQWtCLFNBQUMsR0FBRCxHQUFB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
//# sourceURL=/Users/howardchen/.atom/packages/vim-mode/lib/text-objects.coffee