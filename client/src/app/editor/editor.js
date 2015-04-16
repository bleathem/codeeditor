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
    $scope.saveDisabled = true;

    $scope.editorfile = {
      path: $stateParams.path
    };
    $scope.editorOptions = {
      lineWrapping : true,
        lineNumbers: true,
        mode: 'javascript'
    };
    if ($stateParams.path) {
      editor.getFile($stateParams.path).then(function(contents) {
        $scope.editorfile.contents = contents;
        $scope.editor.setValue(contents);
      })
    }

    $scope.codemirrorLoaded = function(_editor){
      $scope.editor = _editor;

      $scope.editor.on("change", function(codeMirror, change) {
        if (change.origin != "setValue" && $scope.saveDisabled) {
          $scope.saveDisabled = false;
        }
      });
    };

    $scope.saveFile = function() {
      editor.saveFile($scope.editorfile.path, $scope.editor.getValue())
        .then(function(contents) {
          $scope.saveDisabled = true;
          $scope.editorfile.contents = contents;
        })
    };

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
      $scope.editor.setOption('gutters', ['git-line', 'CodeMirror-lint-markers']);
      $scope.editor.setOption('lint', {'predef': ['require', 'console']});
      $scope.editor.on('cursorActivity', function(cm) { server.updateArgHints(cm); });
    })
  })

  ;
})(angular);
