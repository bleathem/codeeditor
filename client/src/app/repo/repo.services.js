'use strict';
(function (angular) {
  angular.module('codeeditor.main.repo.services', [])

  .factory('repoServices', function ($q, $http) {
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
    };

    repo.cloneRepo = function(repoUrl) {
      var deferred = $q.defer();
      var url = '/api/git/clone';
      $http({
        method: 'post',
        url: url,
        data: {
          repoUrl: repoUrl
        }
      }).then(function(response) {
          deferred.resolve(response.data);
        }, function(response) {
          var message = '#' + response.status + ' - ' + response.statusText;
          deferred.reject(new Error(message));
        });
      return deferred.promise;
    };

    repo.deleteRepo = function() {
      var deferred = $q.defer();
      var url = '/api/git';
      $http({
        method: 'delete',
        url: url,
      }).then(function(response) {
          deferred.resolve(response.data);
        }, function(response) {
          var message = '#' + response.status + ' - ' + response.statusText;
          deferred.reject(new Error(message));
        });
      return deferred.promise;
    };
    return repo;
  })
  ;
})(angular);
