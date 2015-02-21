'use strict';
(function (angular) {
  angular.module('codeeditor.main.repo', [
    'ui.router'
  , 'codeeditor.main.repo.services'
  ])

  .config(function ($stateProvider) {

    $stateProvider
      .state('codeeditor.main.repo', {
        url: '/repo',
        templateUrl: 'app/repo/repo.tpl.html',
        controller: 'RepoController'
      });
  })

  .controller('RepoController', function ($scope, $http, repoServices) {
    $scope.repo = {
      url: 'https://github.com/bleathem/visualCubeGenerator.git'
    , paths: []
    }
    repoServices.getFileListing().then(function(paths) {
      $scope.repo.paths = paths;
    });
    $scope.cloneRepo = function() {
      repoServices.cloneRepo($scope.repo.url).then(function(paths) {
        $scope.repo.paths = paths;
      });
    };
    $scope.deleteRepo = function() {
      repoServices.deleteRepo().then(function(exists) {
        $scope.repo.paths = null;
      });
    };
  })

  ;
})(angular);
