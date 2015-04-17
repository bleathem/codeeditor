'use strict';
(function (angular) {
  angular.module('codeeditor.main.project.diff', [
    'ui.router',
    'codeeditor.main.project.diff.services'
  ])

    .config(function ($stateProvider) {

      $stateProvider
        .state('codeeditor.main.diff', {
          url: '/project',
          templateUrl: 'app/project/diff/diff.tpl.html',
          controller: 'DiffController'
        });
    })

    .controller('DiffController', function ($scope, $http, diffServices, project) {
      $scope.project = project;
      $scope.diff = {};
      diffServices.getDiff().then(function(patches) {
        console.log('patches', patches);
        $scope.diff.patches = patches;
      });
    })

  ;
})(angular);
