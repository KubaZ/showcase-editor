'use strict';

angular.module('showcaseEditor.filters', [])
  .filter('pixels', function () {
    return function (input) {
      return input + ' px';
    };
  });
