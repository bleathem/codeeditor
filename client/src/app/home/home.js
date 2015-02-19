'use strict';
(function (angular) {
  angular.module('codeeditor.main.home', [
    'ui.router'
  ])

  .config(function ($stateProvider) {

    $stateProvider
      .state('codeeditor.main.home', {
        url: '/home',
        templateUrl: 'app/home/home.tpl.html',
        controller: 'HomeController'
      });
  })

  .controller('HomeController', function ($scope) {
  })

  ;
})(angular);
