'use strict';
(function (angular) {
  angular.module('codeeditor.main.project', [
    'ui.router',
    'codeeditor.main.project.repo.services',
    'codeeditor.main.project.filetree',
    'codeeditor.main.editor'
  ])

    .config(function ($stateProvider) {

      $stateProvider
        .state('codeeditor.main.project', {
          url: '/project',
          templateUrl: 'app/project/project.tpl.html',
          controller: 'ProjectController'
        })
        .state('codeeditor.main.project.editor', {
          url: '/file?path',
          templateUrl: 'app/editor/editor.tpl.html',
          controller: 'EditorController'
        });
    })

    .controller('ProjectController', function ($scope, $http, repoServices) {
      $scope.project = {
        url: 'https://github.com/bleathem/codeeditor.git'
        , paths: []
      };
      repoServices.getFileListing().then(function (paths) {
        $scope.project.paths = paths;
      });
      $scope.cloneRepo = function () {
        repoServices.cloneRepo($scope.project.url).then(function (paths) {
          $scope.project.paths = paths;
        });
      };
      $scope.deleteRepo = function () {
        repoServices.deleteRepo().then(function (exists) {
          $scope.project.paths = null;
        });
      };
    })

  ;
})(angular);
