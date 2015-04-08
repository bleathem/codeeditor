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

  .controller('EditorController', function ($scope, $http, $stateParams, editor, ternServer) {
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
        $scope.editor.setValue(contents);
      })
    };

    var editor;
    $scope.codemirrorLoaded = function(_editor){
      $scope.editor = _editor;
    }

    var server;
    ternServer.get().then(function(server) {
      $scope.editor.setOption('extraKeys', {
        'Ctrl-Space': function(cm) { server.complete(cm); },
        'Ctrl-I': function(cm) { server.showType(cm); },
        'Ctrl-O': function(cm) { server.showDocs(cm); },
        'Alt-.': function(cm) { server.jumpToDef(cm); },
        'Alt-,': function(cm) { server.jumpBack(cm); },
        'Ctrl-Q': function(cm) { server.rename(cm); },
        'Ctrl-.': function(cm) { server.selectName(cm); }
      });
      $scope.editor.setOption('gutters', ['git-line']);
      $scope.editor.on('cursorActivity', function(cm) { server.updateArgHints(cm); });
    })
  })

  ;
})(angular);
