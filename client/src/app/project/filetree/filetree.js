'use strict';
(function (angular) {
  angular.module('codeeditor.main.project.filetree', [])

    .directive('repoTree', function() {

      var treeViewRenderer = function(scope, el) {
        if (scope.project.paths && scope.project.paths.length > 0) {
          $(el).treeview({
            collapseIcon: "fa fa-angle-down",
            data: scope.project.paths,
            expandIcon: "fa fa-angle-right",
            nodeIcon: "fa fa-folder-o",
            showBorder: false,
            levels: 1,
            enableLinks: true
          });
        }
      };

      return {
        restrict: 'A',
        scope: {
          project: '=repoTree'
        },
        link: function(scope, el) {
          scope.$watch('project.paths', function() {
            treeViewRenderer(scope, el);
          });

          treeViewRenderer(scope, el);
        }
      };
    });
})(angular);
