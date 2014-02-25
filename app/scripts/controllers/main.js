'use strict';

var editorControllers = angular.module('showcaseEditor.controllers',
  [
    'angularFileUpload',
    'imageMapEditor'
  ]
);

editorControllers.controller('MainController', ['$scope', '$fileUploader',
  function ($scope, $fileUploader) {
    // Creates a uploader
    var uploader = $scope.uploader = $fileUploader.create({
      scope: $scope,
      url: 'upload.php'
    });

    $scope.showcase = {dimensions: {width: 600, height: 400}};

    $scope.showcaseTypes = [
      {name: 'Small', width: 300, height: 200},
      {name: 'Medium', width: 400, height: 300},
      {name: 'Big', width: 700, height: 400}
    ];

    $scope.linkTargets = [
      {value: '_blank', label: 'Load in a new window'},
      {value: '_self', label: 'Load in the same frame as it was clicked'},
      {value: '_parent', label: 'Load in the parent frameset'},
      {value: '_top', label: 'Load in the full body of the window'}
    ];

    function parseMapData() {
      var i = 0;
      var map = $scope.map;
      var length = map.areas.length;

      for (i; i < length; i++) {
        delete map.areas[i].$$hashkey;
        delete map.areas[i].active;
        delete map.areas[i].shape.complete;
        delete map.areas[i].shape.startX;
        delete map.areas[i].shape.startY;
      }

      return map;
    }

    function showcaseDataToJson() {
      var showcase = $scope.showcase;
      delete showcase.file;
      showcase.map = parseMapData();
      return JSON.stringify(showcase);
    }

    $scope.removeCurrentImage = function () {
      uploader.queue.pop();
      $scope.showcase = {dimensions: {width: 600, height: 400}};
      $scope.map = {};
      $scope.map.areas = [];
    };

    $scope.addShowcase = function () {
      console.log(showcaseDataToJson());
    };

    uploader.filters.push(function(item /*{File|HTMLInputElement}*/) {
      var type = uploader.isHTML5 ? item.type : '/' + item.value.slice(item.value.lastIndexOf('.') + 1);
      type = '|' + type.toLowerCase().slice(type.lastIndexOf('/') + 1) + '|';
      return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
    });

    uploader.filters.push(function() {
      return uploader.queue.length < 1;
    });
  }]);
