'use strict';
(function (angular) {
  angular.module('codeeditor.main.project.diff.services', [])

  .factory('diffServices', function ($q, $http) {
    var diff = {};

    diff.getDiff = function() {
      var deferred = $q.defer();
      var url = '/api/git/files/diff';
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

    return diff;
  })
  ;
})(angular);
