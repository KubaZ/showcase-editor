'use strict';

angular.module('imageMapEditor', [])
  .directive('imageMapsEditor', function () {
    return {
      link: function (scope) {
        scope.isDrawing = false;
        var isRectangle = true, isCircle, isPolygon;
        var newArea = scope.map.areas ? scope.map.areas.length : 0;
        var currentShape, currentShapeType = 'rectangle';

        if (!scope.map.areas) {
          scope.map.areas = [];
        }

        function createNewArea (x, y) {
          newArea = scope.map.areas.length;
          scope.map.areas[newArea] = {};
          scope.map.areas[newArea].shape = {};
          scope.map.areas[newArea].shape.type = currentShapeType;
          currentShape = scope.map.areas[newArea].shape;
          currentShape.coords = [];
          currentShape.startX = x;
          currentShape.startY = y;
          currentShape.complete = false;
        }

        function setCircleCoords (x, y) {
          var xOffset = Math.abs(currentShape.startX - x);
          var yOffset = Math.abs(currentShape.startY - y);
          var radius;

          if (xOffset <= yOffset) {
            radius = yOffset;
            currentShape.coords[0] = currentShape.startX - radius;
            currentShape.coords[1] = currentShape.startY - radius;
          } else {
            radius = xOffset;
            currentShape.coords[0] = currentShape.startX - radius;
            currentShape.coords[1] = currentShape.startY - radius;
          }
          currentShape.coords[2] = radius;
        }

        function setRectangleCoords (x, y) {
          if (currentShape.startX < x && currentShape.startY < y) {
            currentShape.coords[0] = currentShape.startX;
            currentShape.coords[1] = currentShape.startY;
            currentShape.coords[2] = x;
            currentShape.coords[3] = y;
            return;
          }

          if (currentShape.startX > x) {
            currentShape.coords[2] = currentShape.startX;
            currentShape.coords[0] = x;
          } else {
            currentShape.coords[0] = currentShape.startX;
            currentShape.coords[2] = x;
          }

          if (currentShape.startY > y) {
            currentShape.coords[3] = currentShape.startY;
            currentShape.coords[1] = y;
          } else {
            currentShape.coords[1] = currentShape.startY;
            currentShape.coords[3] = y;
          }
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
          var x = event.offsetX ? event.offsetX : event.originalEvent.layerX;
          var y = event.offsetY ? event.offsetY : event.originalEvent.layerY;

          if (!scope.isDrawing) {
            scope.isDrawing = true;
            createNewArea(x, y);
            if (isRectangle) {
              currentShape.coords.push(x,y,x,y);
            }

            if (isCircle) {
              currentShape.coords.push(x,y,0);
            }
            return;
          }

          if (isRectangle || isCircle) {
            scope.isDrawing = false;
            currentShape.complete = true;
            return;
          }
        };

        scope.drawShape = function (event) {
          if (scope.isDrawing) {
            var x = event.offsetX ? event.offsetX : event.originalEvent.layerX;
            var y = event.offsetY ? event.offsetY : event.originalEvent.layerY;

            if (isRectangle) {
              setRectangleCoords(x, y);
            }

            if (isCircle) {
              setCircleCoords(x, y);
            }
            return;
          }
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
        var startPoints = [];

        scope.moveShape = function (event) {
          if (isMoving) {
            var x = event.offsetX ? event.offsetX : event.originalEvent.layerX;
            var y = event.offsetY ? event.offsetY : event.originalEvent.layerY;
            if (shape.type === 'rectangle') {
              shape.coords[0]+= x - startPoints[0];
              shape.coords[1]+= y - startPoints[1];
              shape.coords[2]+= x - startPoints[0];
              shape.coords[3]+= y - startPoints[1];
            }

            if (shape.type === 'circle') {
              shape.coords[0]+= x - startPoints[0];
              shape.coords[1]+= y - startPoints[1];
            }

            styles.left = shape.coords[0];
            styles.top = shape.coords[1];
            element.css(styles);
          }
        };

        scope.startShapeMove = function (event) {
          var x = event.offsetX ? event.offsetX : event.originalEvent.layerX;
          var y = event.offsetY ? event.offsetY : event.originalEvent.layerY;
          isMoving = true;
          startPoints[0] = x;
          startPoints[1] = y;
        };

        scope.stopShapeMove = function () {
          isMoving = false;
          scope.map.areas[attributes.index].shape = shape;
        };

        scope.selectShape = function () {
          console.log('select shape');
        };

        scope.removeArea = function () {
          isMoving = false;
          element.remove();
          scope.map.areas.splice(attributes.index, 1);
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

        function bringForward () {
          element.addClass('complete');
        }

        drawMapPreview();

        scope.$watch('area.shape.coords', function () {
          drawMapPreview();
        }, true);

        scope.$watch('area.shape.complete', function (newValue) {
          if (newValue) {
            bringForward();
          }
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
