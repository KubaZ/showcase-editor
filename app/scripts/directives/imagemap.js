'use strict';

angular.module('imageMapEditor', [])
  .directive('imageMapsEditor', function () {
    return {
      link: function (scope) {
        scope.isDrawing = false;
        var isRectangle = true, isCircle, isPolygon;
        var areas = scope.showcase.areas;
        var newArea = areas ? areas.length : 0;
        var currentShape, currentShapeType = 'rectangle';

        if (!areas) {
          scope.showcase.areas = [];
        }

        function createNewArea () {
          scope.showcase.areas[newArea] = {};
          scope.showcase.areas[newArea].shape = {};
          scope.showcase.areas[newArea].shape.type = currentShapeType;
          currentShape = scope.showcase.areas[newArea].shape;
        }

        scope.changeDrawingShape = function (shape) {
          if (shape === 'rectangle') {
            isRectangle = true;
            isCircle = false;
            isPolygon = false;
            currentShapeType = 'rectangle';
            return;
          }
          if (shape === 'circle') {
            isCircle = true;
            isRectangle = false;
            isPolygon = false;
            currentShapeType = 'circle';
            return;
          }
          if (shape === 'polygon') {
            isPolygon = true;
            isCircle = false;
            isRectangle = false;
            currentShapeType = 'polygon';
            return;
          }
        };

        scope.startDrawingShape = function (event) {
          var x = event.offsetX;
          var y = event.offsetY;

          if (!scope.isDrawing) {
            scope.isDrawing = true;
            createNewArea();
            if (isRectangle) {
              currentShape.coords = [];
              currentShape.coords.push(x,y,x,y);
            }

            if (isCircle) {
              currentShape.coords = [];
              currentShape.coords.push(x,y,0);
            }
            return console.log('startDrawingShape');
          }

          if (isRectangle) {
            console.log('stopedDrawingShape');
            scope.isDrawing = false;
            currentShape.coords[2] = x;
            currentShape.coords[3] = y;
          }

          if (isCircle) {
            scope.isDrawing = false;
            console.log('stopedDrawingShape');
          }

          newArea++;
        };

        scope.drawShape = function (event) {
          if (scope.isDrawing) {
            var x = event.offsetX;
            var y = event.offsetY;

            if (isRectangle) {
              currentShape.coords[2] = x;
              currentShape.coords[3] = y;
            }

            if (isCircle) {
              var xOffset = Math.abs(currentShape.coords[0] - x);
              var yOffset = Math.abs(currentShape.coords[1] - y);

              if (xOffset <= yOffset) {
                currentShape.coords[2] = yOffset / 2;
              } else {
                currentShape.coords[2] = xOffset / 2;
              }
            }
            return console.log('Drawing');
          }

          console.log('notDrawing');
        };
      }
    };
  })
  .directive('imageMap', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attributes) {
        var shape = scope.area.shape;
        var styles = {};
        var ctx = element[0].getContext('2d');
        var isMoving = false;
        var moveVector = [];

        scope.moveShape = function (event) {
          if (isMoving) {
            var x = event.offsetX;
            var y = event.offsetY;
            if (shape.type === 'rectangle') {
              shape.coords[0]+= x - moveVector[0];
              shape.coords[1]+= y - moveVector[1];
              shape.coords[2]+= x - moveVector[0];
              shape.coords[3]+= y - moveVector[1];
            }

            if (shape.type === 'circle') {
              shape.coords[0]+= x - moveVector[0];
              shape.coords[1]+= y - moveVector[1];
            }

            styles.left = shape.coords[0];
            styles.top = shape.coords[1];
            element.css(styles);
          }
        };

        scope.startShapeMove = function (event) {
          var x = event.offsetX;
          var y = event.offsetY;
          isMoving = true;
          moveVector[0] = x;
          moveVector[1] = y;
        };

        scope.stopShapeMove = function () {
          isMoving = false;
          scope.showcase.areas[attributes.index].shape = shape;
        };

        scope.selectShape = function () {
          console.log('select shape');
        };

        function fillShape() {
          ctx.fillStyle = 'rgba(255,255,255,0.4)';
          ctx.fill();
          ctx.strokeStyle = 'red';
          ctx.stroke();
        }

        function drawRectangle() {
          styles.left = shape.coords[0];
          styles.top = shape.coords[1];
          element.css(styles);
          element[0].width = shape.coords[2] - shape.coords[0];
          element[0].height = shape.coords[3] - shape.coords[1];

          ctx.rect(0, 0, element[0].width, element[0].height);
          fillShape();
        }

        function drawCircle() {
          styles.left = shape.coords[0];
          styles.top = shape.coords[1];
          var radius = shape.coords[2];

          element.css(styles);
          element[0].width = radius * 2;
          element[0].height = radius * 2;

          ctx.arc(radius, radius, radius, 0, 2 * Math.PI);
          fillShape();
        }

        function drawMapPreview() {
          if (shape.type === 'rectangle') {
            drawRectangle();
          }

          if (shape.type === 'circle') {
            drawCircle();
          }
        }

        drawMapPreview();

        scope.$watch('area', function () {
          drawMapPreview();
        }, true);
      }
    };
  })
  .directive('imagemapDisplayCoords', function () {
    return {
      restrict: 'A',
      link: function (scope, element) {
        scope.$watch('area.shape', function (newValue) {
          element.val(newValue.coords);
        }, true);
      }
    };
  });
