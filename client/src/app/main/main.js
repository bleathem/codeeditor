'use strict';
(function (angular) {
  angular.module('codeeditor.main', [
    'ui.router'
  , 'codeeditor.main.home'
  , 'codeeditor.main.repo'
  , 'codeeditor.main.editor'
  ])
  .config(function ($stateProvider, $locationProvider) {
    $stateProvider
      .state('codeeditor.main', {
        abstract: true,
        templateUrl: 'app/main/main.tpl.html'
      });
    $locationProvider.html5Mode(true);
    // $locationProvider.hashPrefix('!');
  });
})(angular);
