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

  ;
})(angular);
