'use strict';

describe('Directive: imagemap', function () {

  // load the directive's module
  beforeEach(module('imageMapEditor'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make areaShape element selected', inject(function ($compile) {
    element = angular.element('<button area-shape></button>');
    element = $compile(element)(scope);
    element.triggerHandler('click');
    expect(element.attr('class')).toBe('active');
  }));
});
