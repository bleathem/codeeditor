'use strict';
(function (angular) {
  angular.module('codeeditor.main.editor.services', [])

  .factory('editor', function ($q, $http) {
    var editor = {};

    editor.getFile = function(filename) {
      var deferred = $q.defer();
      var url = '/api/git/file/' + filename;
      console.log(url);
      $http({
        method: 'get',
        url: url
      }).then(function(response) {
          deferred.resolve(response.data);
        }, function(response) {
          var message = '#' + response.status + ' - ' + response.statusText;
          deferred.reject(new Error(message));
        });
      return deferred.promise;
    }

    return editor;
  })

  .factory('ternServer', function($q, $http) {
    return {
      get: function() {
        var deferred = $q.defer();
        $http({method: 'get', url: '/lib/tern/defs/ecma5.json'}).then(function(response) {
          var code = response.data;
          var server = new CodeMirror.TernServer({defs: [code]});
          deferred.resolve(server);
        }, function(response) {
          var message = '#' + response.status + ' - ' + response.statusText;
          deferred.reject(new Error(message));
        });
        return deferred.promise;
      }
    }
  })

  .directive('filediff', function($q, $http, $document) {

    var addMarker = $document[0].createElement('span');
    addMarker.className = 'add';
    addMarker.appendChild($document[0].createTextNode(' '));

    var remMarker = $document[0].createElement('span');
    remMarker.className = 'rem';

    var modMarker = $document[0].createElement('span');
    modMarker.className = 'mod';
    modMarker.appendChild($document[0].createTextNode(' '));

    var markGutterRows = function (editor, startRow, endRow, marker) {
      for (var i = startRow; i <= endRow; i++) {
        editor.setGutterMarker(i, 'git-line', marker);
      }
    };

    var addGutterDecorations = function (editor, diffs) {
      diffs.forEach(function(diff) {
        var startRow = diff.newStart - 1;
        var endRow = diff.newStart + diff.newLines - 2;
        if (diff.oldLines === 0 && diff.newLines > 0) {
          markGutterRows(editor, startRow, endRow, addMarker)
        } else if (diff.newLines === 0 && diff.oldLines > 0) {
          markGutterRows(editor, startRow, startRow, remMarker)
        } else {
          markGutterRows(editor, startRow, endRow, modMarker)
        };
      });
      return;
    };

    return {
      restrict: 'A',
      replace: true,
      scope: {
        editorfile: '='
      , editor: '='
      },

      link: function (scope, element, attrs) {
        scope.$watch('editorfile.contents', function(newValue, oldValue) {
          if (!newValue) {
            return;
          }
          if (!scope.editor) {return};
          var url = '/api/git/file/diff/' + scope.editorfile.path
          $http({
            method: 'post',
            url: url,
            data: { text: scope.editorfile.contents }
          }).then(function(response) {
              console.log(response.data);
              addGutterDecorations(scope.editor, response.data);
            }, function(response) {
              var message = '#' + response.status + ' - ' + response.statusText;
              console.log(message);
              // deferred.reject(new Error(message));
            });
        });
      }
    }
  })

  ;
})(angular);
