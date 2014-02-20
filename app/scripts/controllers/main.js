'use strict';

var editorControllers = angular.module('showcaseEditor.controllers', ['angularFileUpload']);

editorControllers.controller('MainController', ['$scope', '$fileUploader',
  function ($scope, $fileUploader) {
    // Creates a uploader
    var uploader = $scope.uploader = $fileUploader.create({
      scope: $scope,
      url: 'upload.php'
    });

    $scope.showcaseTypes = [
      {size: 'big', width: '700', height: '400'},
      {size: 'small', width: '330', height: '400'}
    ];

    $scope.linkTargets = [
      {value: '_blank', label: 'Load in a new window'},
      {value: '_self', label: 'Load in the same frame as it was clicked'},
      {value: '_parent', label: 'Load in the parent frameset'},
      {value: '_top', label: 'Load in the full body of the window'}
    ];

    $scope.redirectCodes = [
      {value: '302', label: 'Found'},
      {value: '304', label: 'Not Modified'},
      {value: '308', label: 'Permanent Redirect'}
    ];

    $scope.submitShowcase = function () {
      console.log($scope.showcase);
    };

    uploader.filters.push(function(item /*{File|HTMLInputElement}*/) {
      var type = uploader.isHTML5 ? item.type : '/' + item.value.slice(item.value.lastIndexOf('.') + 1);
      type = '|' + type.toLowerCase().slice(type.lastIndexOf('/') + 1) + '|';
      return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
    });

    uploader.filters.push(function() {
      return uploader.queue.length < 1;
    });

    uploader.bind('afteraddingfile', function (event, item) {
      console.info('After adding a file', item);
    });

    uploader.bind('afteraddingall', function (event, items) {
      console.info('After adding all files', items);
    });

    uploader.bind('beforeupload', function (event, item) {
      console.info('Before upload', item);
    });

    uploader.bind('progress', function (event, item, progress) {
      console.info('Progress: ' + progress, item);
    });

    uploader.bind('success', function (event, xhr, item, response) {
      console.info('Success', xhr, item, response);
    });

    uploader.bind('cancel', function (event, xhr, item) {
      console.info('Cancel', xhr, item);
    });

    uploader.bind('error', function (event, xhr, item, response) {
      console.info('Error', xhr, item, response);
    });

    uploader.bind('complete', function (event, xhr, item, response) {
      console.info('Complete', xhr, item, response);
    });

    uploader.bind('progressall', function (event, progress) {
      console.info('Total progress: ' + progress);
    });

    uploader.bind('completeall', function (event, items) {
      console.info('Complete all', items);
    });
  }]);
