'use strict';
(function (angular) {
  angular.module('codeeditor', [
    'ui.router'
  , 'codeeditor.main',
  ])

  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');

    $stateProvider
      .state('codeeditor', {
        abstract: true,
        template: '<ui-view></ui-view>'
      });
  });
})(angular);
