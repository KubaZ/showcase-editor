'use strict';

describe('Directive: imagemap', function () {

  // load the directive's module
  beforeEach(module('showcaseEditorApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<imagemap></imagemap>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the imagemap directive');
  }));
});
