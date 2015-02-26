(function() {
  var BlockCursor;

  BlockCursor = (function() {
    var colorStyleElement, primarySelector, secondarySelector;

    function BlockCursor() {}

    colorStyleElement = null;

    primarySelector = '.block-cursor atom-text-editor::shadow .cursors .cursor';

    secondarySelector = '.block-cursor atom-text-editor::shadow .cursors.blink-off .cursor';

    BlockCursor.prototype.config = {
      primaryColor: {
        description: 'Primary color of the cursor',
        type: 'color',
        "default": '#393939'
      },
      secondaryColor: {
        description: 'Secondary color of the cursor',
        type: 'color',
        "default": '#393939'
      },
      enablePulse: {
        description: 'Fade from primary color to secondary color',
        type: 'boolean',
        "default": false
      }
    };

    BlockCursor.prototype.activate = function() {
      var workspaceView;
      workspaceView = atom.views.getView(atom.workspace);
      workspaceView.classList.add('block-cursor');
      this.primaryColorObserveSubscription = atom.config.observe('block-cursor.primaryColor', (function(_this) {
        return function(val) {
          return _this.applyPrimaryColor(val);
        };
      })(this));
      this.secondaryColorObserveSubscription = atom.config.observe('block-cursor.secondaryColor', (function(_this) {
        return function(val) {
          return _this.applySecondaryColor(val);
        };
      })(this));
      return this.enablePulseObserveSubscription = atom.config.observe('block-cursor.enablePulse', (function(_this) {
        return function(val) {
          return _this.applyPulse(val);
        };
      })(this));
    };

    BlockCursor.prototype.deactivate = function() {
      var workspaceView;
      workspaceView = atom.views.getView(atom.workspace);
      workspaceView.classList.remove('block-cursor');
      workspaceView.classList.remove('block-cursor-pulse');
      this.primaryColorObserveSubscription.dispose();
      return this.secondaryColorObserveSubscription.dispose();
    };

    BlockCursor.prototype.getColorStyleElement = function() {
      if (colorStyleElement != null) {
        return colorStyleElement;
      }
      colorStyleElement = document.createElement('style');
      colorStyleElement.type = 'text/css';
      document.querySelector('head atom-styles').appendChild(colorStyleElement);
      colorStyleElement.sheet.insertRule("" + primarySelector + " {}", 0);
      colorStyleElement.sheet.insertRule("" + secondarySelector + " {}", 1);
      return colorStyleElement;
    };

    BlockCursor.prototype.applyPrimaryColor = function(color) {
      var stylesheet;
      stylesheet = this.getColorStyleElement().sheet;
      stylesheet.deleteRule(0);
      return stylesheet.insertRule("" + primarySelector + " { background-color: " + (color.toRGBAString()) + "; }", 0);
    };

    BlockCursor.prototype.applySecondaryColor = function(color) {
      var stylesheet;
      stylesheet = this.getColorStyleElement().sheet;
      stylesheet.deleteRule(1);
      return stylesheet.insertRule("" + secondarySelector + " { background-color: " + (color.toRGBAString()) + "; }", 1);
    };

    BlockCursor.prototype.applyPulse = function(enabled) {
      var workspaceView;
      workspaceView = atom.views.getView(atom.workspace);
      if (enabled) {
        return workspaceView.classList.add('block-cursor-pulse');
      } else {
        return workspaceView.classList.remove('block-cursor-pulse');
      }
    };

    return BlockCursor;

  })();

  module.exports = new BlockCursor();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFdBQUE7O0FBQUEsRUFBTTtBQUNKLFFBQUEscURBQUE7OzZCQUFBOztBQUFBLElBQUEsaUJBQUEsR0FBb0IsSUFBcEIsQ0FBQTs7QUFBQSxJQUNBLGVBQUEsR0FBa0IseURBRGxCLENBQUE7O0FBQUEsSUFFQSxpQkFBQSxHQUFvQixtRUFGcEIsQ0FBQTs7QUFBQSwwQkFJQSxNQUFBLEdBQ0U7QUFBQSxNQUFBLFlBQUEsRUFDRTtBQUFBLFFBQUEsV0FBQSxFQUFhLDZCQUFiO0FBQUEsUUFDQSxJQUFBLEVBQU0sT0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLFNBRlQ7T0FERjtBQUFBLE1BSUEsY0FBQSxFQUNFO0FBQUEsUUFBQSxXQUFBLEVBQWEsK0JBQWI7QUFBQSxRQUNBLElBQUEsRUFBTSxPQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsU0FGVDtPQUxGO0FBQUEsTUFRQSxXQUFBLEVBQ0U7QUFBQSxRQUFBLFdBQUEsRUFBYSw0Q0FBYjtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxLQUZUO09BVEY7S0FMRixDQUFBOztBQUFBLDBCQWtCQSxRQUFBLEdBQVUsU0FBQSxHQUFBO0FBQ1IsVUFBQSxhQUFBO0FBQUEsTUFBQSxhQUFBLEdBQWdCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FBaEIsQ0FBQTtBQUFBLE1BQ0EsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUF4QixDQUE0QixjQUE1QixDQURBLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSwrQkFBRCxHQUNFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQiwyQkFBcEIsRUFBaUQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsR0FBRCxHQUFB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
//# sourceURL=/Users/howardchen/.atom/packages/block-cursor/lib/block-cursor.coffee