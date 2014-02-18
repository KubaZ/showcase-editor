'use strict';

angular.module('imageMapEditor', [])
  .directive('imageMapsEditor', function () {
    return {
      link: function (scope, element, attributes) {
        var isDrawing = false;
        var isRectangle = true, isCircle, isPolygon;
        var currentArea = scope.showcase.areas.length;

        scope.changeDrawingShape = function (shape) {
          if (shape === 'rectangle') {
            isRectangle = true;
            return;
          }
          if (shape === 'circle') {
            isCircle = true;
            return;
          }
          if (shape === 'polygon') {
            isPolygon = true;
            return;
          }
        };

        scope.startDrawingShape = function ($event) {
          var x = event.offsetX;
          var y = event.offsetY;

          if (!isDrawing) {
            isDrawing = true;
            return console.log('startDrawingShape');
          }

          if (isRectangle || isCircle) {
            isDrawing = false;
            console.log('stopedDrawingShape');
          }
        };

        scope.drawShape = function ($event) {
          if (isDrawing) {
            var x = event.offsetX;
            var y = event.offsetY;
            return console.log('Drawing');
          }

          console.log('notDrawing');
        };

        // element.find('.preview').bind('click', function (event) {
        //   console.log('Click');
        //   var x = event.offsetX;
        //   var y = event.offsetY;
        //   if (!isDrawing) {
        //     element.find('.preview-container').append('<canvas class="area" />');
        //     var area = element.find('.area')[currentArea];
        //     var ctx = element.find('.area')[currentArea].getContext('2d');
        //     isDrawing = true;
        //     $(area).css({
        //       left: x,
        //       top: y,
        //       right: 'auto',
        //       bottom: 'auto',
        //       width: 1,
        //       height: 1
        //     });

        //     areasList.push({element: area, ctx: ctx, cords: [x,y]});
        //     areasList[currentArea].left = x;
        //     areasList[currentArea].top = y;
        //     return;
        //   }
        //   isDrawing = false;
        //   areasList[currentArea].cords.push(x, y);
        //   scope.showcase.areas = areasList;
        //   currentArea++;
        // });

        // element.find('.preview').bind('mousemove', function (event) {
        //   if (isDrawing) {
        //     console.log('Mouse move');
        //     var x = event.offsetX;
        //     var y = event.offsetY;
        //     areasList[currentArea].width = Math.abs(x - areasList[currentArea].left);
        //     areasList[currentArea].height = Math.abs(y - areasList[currentArea].top);

        //     var styles = {
        //       width: areasList[currentArea].width,
        //       height: areasList[currentArea].height
        //     };

        //     $(areasList[currentArea].element).css(styles);
        //   }
        // });
      }
    };
  })
  .directive('imageMap', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      link: function (scope, element, attributes) {
        var shapeType = scope.area.shape.type;
        var shapeCoords = scope.area.shape.coords;
        var styles = {};
        var ctx = element[0].getContext('2d');
        var isMoving = false;
        var moveVector = [];

        function safeApply(fn) {
          (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
        }

        scope.moveShape = function ($event) {
          if (isMoving) {
            var x = event.offsetX;
            var y = event.offsetY;
            shapeCoords[0]+= x - moveVector[0];
            shapeCoords[1]+= y - moveVector[1];
            styles.left = shapeCoords[0];
            styles.top = shapeCoords[1];
            $(element[0]).css(styles);
          }
        };

        scope.startShapeMove = function ($event) {
          var x = event.offsetX;
          var y = event.offsetY;
          isMoving = true;
          moveVector[0] = x;
          moveVector[1] = y;
        };

        scope.stopShapeMove = function ($event) {
          isMoving = false;
          $timeout(function () {
            scope.showcase.areas[attributes.index].shape.coords = shapeCoords;
          });
        };

        scope.selectShape = function ($event) {
          console.log('select shape');
        };

        function fillShape() {
          ctx.fillStyle = 'rgba(255,255,255,0.6)';
          ctx.fill();
          ctx.strokeStyle = 'red';
          ctx.stroke();
        }

        function drawRectangle() {
          styles.left = shapeCoords[0];
          styles.top = shapeCoords[1];
          $(element[0]).css(styles);
          element[0].width = shapeCoords[2] - shapeCoords[0];
          element[0].height = shapeCoords[3] - shapeCoords[1];

          ctx.rect(0, 0, element[0].width, element[0].height);
          fillShape();
        }

        function drawCircle() {
          styles.left = shapeCoords[0];
          styles.top = shapeCoords[1];
          var radius = shapeCoords[2];

          $(element[0]).css(styles);
          element[0].width = radius * 2;
          element[0].height = radius * 2;

          ctx.arc(radius, radius, radius, 0, 2 * Math.PI);
          fillShape();
        }

        function drawMapPreview() {
          if (shapeType === 'rectangle') {
            drawRectangle();
          }

          if (shapeType === 'circle') {
            drawCircle();
          }
        }

        drawMapPreview();
      }
    };
  }]);
