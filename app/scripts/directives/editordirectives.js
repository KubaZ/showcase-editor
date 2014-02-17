'use strict';

angular.module('showcaseEditor.directives', [])
  .directive('ngThumb', ['$window', function($window) {
    var helper = {
      support: !!($window.FileReader && $window.CanvasRenderingContext2D),
      isFile: function(item) {
        return angular.isObject(item) && item instanceof $window.File;
      },
      isImage: function(file) {
        var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    };

    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        if (!helper.support) {
          return;
        }

        var params = scope.$eval(attrs.ngThumb);

        if (!helper.isFile(params.file)) {
          return;
        }
        if (!helper.isImage(params.file)) {
          return;
        }

        var canvas = element.find('canvas');
        var reader = new FileReader();

        function previewImage(img) {
          canvas[0].getContext('2d').drawImage(this, 0, 0, attrs.width, attrs.height);
        }

        function onLoadFile(event) {
          var img = new Image();
          img.onload = previewImage;
          img.src = event.target.result;
        }

        reader.onload = onLoadFile;
        reader.readAsDataURL(params.file);
      }
    };
  }]);
