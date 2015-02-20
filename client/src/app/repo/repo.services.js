'use strict';
(function (angular) {
  angular.module('codeeditor.main.repo.services', [])

  .factory('repo', function ($q, $http) {
    var repo = {};

    repo.getFileListing = function() {
      var deferred = $q.defer();
      var url = '/api/git/files';
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

    repo.getFile = function(filename) {
      var deferred = $q.defer();
      var url = '/api/git/files' + filename;
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

    return repo;
  })

  ;
})(angular);
