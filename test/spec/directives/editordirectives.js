'use strict';

describe('Directive: editorDirectives', function () {

  // load the directive's module
  beforeEach(module('showcaseEditorApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<editor-directives></editor-directives>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the editorDirectives directive');
  }));
});
