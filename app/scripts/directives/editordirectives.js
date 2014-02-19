'use strict';

angular.module('showcaseEditor.directives', [])
  .directive('showcasePreview', ['$window', function($window) {
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

        var params = scope.$eval(attrs.showcasePreview);
        var image;

        if (!helper.isFile(params.file)) {
          return;
        }
        if (!helper.isImage(params.file)) {
          return;
        }

        var canvas = element[0];
        var ctx = canvas.getContext('2d');
        var reader = new FileReader();

        function previewImage() {
          ctx.drawImage(image, 0, 0, attrs.width, attrs.height);
        }

        function onLoadFile(event) {
          image = new Image();
          image.onload = previewImage;
          image.src = event.target.result;
        }

        attrs.$observe('width', function(newValue, oldValue) {
          if (image) {
            ctx.scale(newValue / oldValue, 1);
            previewImage();
          }
        });

        reader.onload = onLoadFile;
        reader.readAsDataURL(params.file);
      }
    };
  }])
  .directive('triggerFileInput', function () {
    return {
      restrict: 'A',
      link: function (scope, element) {
        element.find('.trigger').bind('click', function () {
          element.find('input').focus().trigger('click');
        });
      }
    };
  });
