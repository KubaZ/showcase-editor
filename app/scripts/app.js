'use strict';

angular.module('showcaseEditorApp', [
  'ngRoute',
  'editorControllers'
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
