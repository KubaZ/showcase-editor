'use strict';

angular.module('showcaseEditor.directives', [])
  .directive('showcasePreview', ['$window', function($window) {
    var helper = {
      support: !!($window.FileReader && $window.CanvasRenderingContext2D),
      isFile: function (item) {
        return angular.isObject(item) && item instanceof $window.File;
      },
      isImage: function (file) {
        var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      },
      isImageUrlValid: function (url) {
        return url.match(/\.(jpg|png|jpeg|bmp|gif)/i);
      }
    };

    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        scope.isPreviewImageLoaded = false;
        var image;
        var canvas = element[0];
        var ctx = canvas.getContext('2d');

        function drawImageToCanvas() {
          ctx.drawImage(image, 0, 0, attrs.width, attrs.height);
        }

        function displayUploadedFile() {
          if (!helper.support) {
            return;
          }

          var file = scope.uploader.queue[0].file;

          if (!helper.isFile(file)) {
            return;
          }
          if (!helper.isImage(file)) {
            return;
          }

          var reader = new FileReader();

          function onLoadFile(event) {
            image = new Image();
            image.onload = drawImageToCanvas;
            image.src = event.target.result;
          }

          reader.onload = onLoadFile;
          reader.readAsDataURL(file);
          scope.isPreviewImageLoaded = true;
        }



        scope.displayImageFromUrl = function () {
          var url = scope.showcase.image.url;
          if (helper.isImageUrlValid(url)) {
            image = new Image();
            image.onload = drawImageToCanvas;
            image.src = url;
            scope.isPreviewImageLoaded = true;
          }
        };

        scope.$watch('showcase.dimensions', function() {
          if (image) {
            drawImageToCanvas();
          }
        }, true);

        scope.$watch('uploader.queue[0]', function() {
          if (scope.uploader.queue[0]) {
            displayUploadedFile();
          } else {
            image = undefined;
            canvas.width = canvas.width;
            scope.isPreviewImageLoaded = false;
          }
        });
      }
    };
  }])
  .directive('triggerFileInput', function () {
    return {
      restrict: 'A',
      link: function (scope, element) {
        angular.element(element).bind('click', function () {
          angular.element(element).next('input').trigger('click');
        });
      }
    };
  });
