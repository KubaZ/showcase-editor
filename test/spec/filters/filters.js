'use strict';

describe('Filter: filters', function () {

  // load the filter's module
  beforeEach(module('showcaseEditor.filters'));

  // initialize a new instance of the filter before each test
  var filters;
  beforeEach(inject(function ($filter) {
    filters = $filter('pixels');
  }));

  it('should return the input prefixed with "filters filter:"', function () {
    var text = 'angularjs';
    expect(filters(text)).toBe(text + 'px');
  });

});
