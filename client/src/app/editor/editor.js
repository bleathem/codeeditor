'use strict';
(function (angular) {
  angular.module('codeeditor.main.editor', [
    'ui.router'
  , 'codeeditor.main.editor.services'
  , 'ui.codemirror'
  ])

  .config(function ($stateProvider) {

    $stateProvider
      .state('codeeditor.main.editor', {
        url: '/file?path',
        templateUrl: 'app/editor/editor.tpl.html',
        controller: 'EditorController'
      });
  })

  .controller('EditorController', function ($scope, $http, $stateParams, editor) {
    $scope.editorfile = {
      path: $stateParams.path
    };
    $scope.editorOptions = {
      lineWrapping : true,
        lineNumbers: true,
        mode: 'javascript'
    }
    if ($stateParams.path) {
      editor.getFile($stateParams.path).then(function(contents) {
        $scope.editorfile.contents = contents;
      })
    };
  })

  ;
})(angular);
