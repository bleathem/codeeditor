'use strict';
(function (angular) {
  angular.module('codeeditor.main.repo', [
    'ui.router'
  ])

  .config(function ($stateProvider) {

    $stateProvider
      .state('codeeditor.main.repo', {
        url: '/repo',
        templateUrl: 'app/repo/repo.tpl.html',
        controller: 'RepoController'
      });
  })

  .controller('RepoController', function ($scope) {
  })

  ;
})(angular);
