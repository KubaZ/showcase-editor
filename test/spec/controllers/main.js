'use strict';

describe('Controller: MainController', function () {

  // load the controller's module
  beforeEach(module('showcaseEditor.controllers', ['angularFileUpload']));

  var MainCtrl,
    scope,
    fileUploader;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $fileUploader) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainController', {
      $scope: scope
    });
  }));

  it('should attach a list of showcaseTypes to the scope', function () {
    expect(scope.showcaseTypes.length).toBe(2);
  });

  it('should attach a list of linkTargets to the scope', function () {
    expect(scope.linkTargets.length).toBe(4);
  });

  it('should attach a list of redirectCodes to the scope', function () {
    expect(scope.redirectCodes.length).toBe(3);
  });
});
