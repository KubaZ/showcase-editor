'use strict';

angular.module('showcaseEditor', [
  'ngRoute',
  'showcaseEditor.controllers',
  'showcaseEditor.directives'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
