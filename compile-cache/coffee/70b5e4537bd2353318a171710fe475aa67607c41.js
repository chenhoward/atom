(function() {
  var SearchViewModel, ViewModel,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ViewModel = require('./view-model').ViewModel;

  module.exports = SearchViewModel = (function(_super) {
    __extends(SearchViewModel, _super);

    function SearchViewModel(searchMotion) {
      this.searchMotion = searchMotion;
      this.confirm = __bind(this.confirm, this);
      this.decreaseHistorySearch = __bind(this.decreaseHistorySearch, this);
      this.increaseHistorySearch = __bind(this.increaseHistorySearch, this);
      SearchViewModel.__super__.constructor.call(this, this.searchMotion, {
        "class": 'search'
      });
      this.historyIndex = -1;
      this.view.editor.on('core:move-up', this.increaseHistorySearch);
      this.view.editor.on('core:move-down', this.decreaseHistorySearch);
    }

    SearchViewModel.prototype.restoreHistory = function(index) {
      return this.view.editor.setText(this.history(index).value);
    };

    SearchViewModel.prototype.history = function(index) {
      return this.vimState.getSearchHistoryItem(index);
    };

    SearchViewModel.prototype.increaseHistorySearch = function() {
      if (this.history(this.historyIndex + 1) != null) {
        this.historyIndex += 1;
        return this.restoreHistory(this.historyIndex);
      }
    };

    SearchViewModel.prototype.decreaseHistorySearch = function() {
      if (this.historyIndex <= 0) {
        this.historyIndex = -1;
        return this.view.editor.setText('');
      } else {
        this.historyIndex -= 1;
        return this.restoreHistory(this.historyIndex);
      }
    };

    SearchViewModel.prototype.confirm = function(view) {
      this.vimState.pushSearchHistory(this);
      return SearchViewModel.__super__.confirm.call(this, view);
    };

    return SearchViewModel;

  })(ViewModel);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBCQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsWUFBYSxPQUFBLENBQVEsY0FBUixFQUFiLFNBQUQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixzQ0FBQSxDQUFBOztBQUFhLElBQUEseUJBQUUsWUFBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsZUFBQSxZQUNiLENBQUE7QUFBQSwrQ0FBQSxDQUFBO0FBQUEsMkVBQUEsQ0FBQTtBQUFBLDJFQUFBLENBQUE7QUFBQSxNQUFBLGlEQUFNLElBQUMsQ0FBQSxZQUFQLEVBQXFCO0FBQUEsUUFBQSxPQUFBLEVBQU8sUUFBUDtPQUFyQixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxZQUFELEdBQWdCLENBQUEsQ0FEaEIsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBYixDQUFnQixjQUFoQixFQUFnQyxJQUFDLENBQUEscUJBQWpDLENBSEEsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBYixDQUFnQixnQkFBaEIsRUFBa0MsSUFBQyxDQUFBLHFCQUFuQyxDQUpBLENBRFc7SUFBQSxDQUFiOztBQUFBLDhCQU9BLGNBQUEsR0FBZ0IsU0FBQyxLQUFELEdBQUE7YUFDZCxJQUFDLENBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFiLENBQXFCLElBQUMsQ0FBQSxPQUFELENBQVMsS0FBVCxDQUFlLENBQUMsS0FBckMsRUFEYztJQUFBLENBUGhCLENBQUE7O0FBQUEsOEJBVUEsT0FBQSxHQUFTLFNBQUMsS0FBRCxHQUFBO2FBQ1AsSUFBQyxDQUFBLFFBQVEsQ0FBQyxvQkFBVixDQUErQixLQUEvQixFQURPO0lBQUEsQ0FWVCxDQUFBOztBQUFBLDhCQWFBLHFCQUFBLEdBQXVCLFNBQUEsR0FBQTtBQUNyQixNQUFBLElBQUcsMkNBQUg7QUFDRSxRQUFBLElBQUMsQ0FBQSxZQUFELElBQWlCLENBQWpCLENBQUE7ZUFDQSxJQUFDLENBQUEsY0FBRCxDQUFnQixJQUFDLENBQUEsWUFBakIsRUFGRjtPQURxQjtJQUFBLENBYnZCLENBQUE7O0FBQUEsOEJBa0JBLHFCQUFBLEdBQXVCLFNBQUEsR0FBQTtBQUNyQixNQUFBLElBQUcsSUFBQyxDQUFBLFlBQUQsSUFBaUIsQ0FBcEI7QUFFRSxRQUFBLElBQUMsQ0FBQSxZQUFELEdBQWdCLENBQUEsQ0FBaEIsQ0FBQTtlQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQWIsQ0FBcUIsRUFBckIsRUFIRjtPQUFBLE1BQUE7QUFLRSxRQUFBLElBQUMsQ0FBQSxZQUFELElBQWlCLENBQWpCLENBQUE7ZUFDQSxJQUFDLENBQUEsY0FBRCxDQUFnQixJQUFDLENBQUEsWUFBakIsRUFORjtPQURxQjtJQUFBLENBbEJ2QixDQUFBOztBQUFBLDhCQTJCQSxPQUFBLEdBQVMsU0FBQyxJQUFELEdBQUE7QUFDUCxNQUFBLElBQUMsQ0FBQSxRQUFRLENBQUMsaUJBQVYsQ0FBNEIsSUFBNUIsQ0FBQSxDQUFBO2FBQ0EsNkNBQU0sSUFBTixFQUZPO0lBQUEsQ0EzQlQsQ0FBQTs7MkJBQUE7O0tBRDRCLFVBSDlCLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/howardchen/.atom/packages/vim-mode/lib/view-models/search-view-model.coffee