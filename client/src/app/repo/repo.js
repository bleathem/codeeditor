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

  .controller('RepoController', function ($scope, $http, repo) {
    $scope.files = {
      paths: []
    };
    repo.getFileListing().then(function(paths) {
      $scope.files.paths = paths;
    });
  })

  ;
})(angular);
