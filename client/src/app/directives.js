'use strict';
(function(angular) {
  angular.module('codeeditor.directives', [])

    .directive('repoTree', function() {

      var treeViewRenderer = function(scope, el) {
        if (scope.repo.paths && scope.repo.paths.length > 0) {
          $(el).treeview({
            collapseIcon: "fa fa-angle-down",
            data: scope.repo.paths,
            expandIcon: "fa fa-angle-right",
            nodeIcon: "fa fa-folder",
            showBorder: false,
            levels: 1,
            enableLinks: true
          });
        }
      };

      return {
        restrict: 'A',
        scope: {
          repo: '=repoTree'
        },
        link: function(scope, el) {
          scope.$watch('repo.paths', function() {
            treeViewRenderer(scope, el);
          });

          treeViewRenderer(scope, el);
        }
      };
    });
})(angular);
