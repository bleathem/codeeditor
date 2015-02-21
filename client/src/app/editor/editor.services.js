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

  ;
})(angular);
