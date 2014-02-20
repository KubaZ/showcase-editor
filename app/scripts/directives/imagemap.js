'use strict';

angular.module('imageMapEditor', [])
  .directive('imageMapsEditor', ['$document', function($document) {
    return {
      link: function (scope) {
        scope.isDrawing = false;
        scope.shiftKey = false;
        scope.startDrawingPolygon = false;
        var isRectangle = true, isCircle, isPolygon;
        var newArea = scope.map.areas ? scope.map.areas.length : 0;
        var currentShape, currentShapeType = 'rectangle';

        if (!scope.map.areas) {
          scope.map.areas = [];
        }

        $document.keydown(function (event) {
          if (event.shiftKey) {
            scope.shiftKey = true;
          }
        });

        $document.keyup(function () {
          scope.shiftKey = false;
        });

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
              return currentShape.coords.push(x,y,x,y);
            }

            if (isCircle) {
              return currentShape.coords.push(x,y,0);
            }

            if (isPolygon) {
              scope.startDrawingPolygon = true;
              return currentShape.coords.push([x,y], [x,y]);
            }
          }

          if (isRectangle || isCircle) {
            scope.isDrawing = false;
            currentShape.complete = true;
            return;
          }

          if (isPolygon) {
            if (scope.shiftKey) {
              scope.isDrawing = false;
              currentShape.complete = true;
              return;
            }
            currentShape.coords.push([x,y]);
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

            if (isPolygon) {
              var i = currentShape.coords.length - 1;
              currentShape.coords[i][0] = x;
              currentShape.coords[i][1] = y;
            }
            return;
          }
        };

        scope.removeArea = function (index) {
          scope.map.areas.splice(index, 1);
        };

        scope.highlightArea = function (index) {
          scope.map.areas[index].active = true;
        };
      }
    };
  }])
  .directive('mapArea', function () {
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
            var xVector = x - startPoints[0];
            var yVector = y - startPoints[1];
            if (shape.type === 'rectangle') {
              shape.coords[0]+= xVector;
              shape.coords[1]+= yVector;
              shape.coords[2]+= xVector;
              shape.coords[3]+= yVector;
            }

            if (shape.type === 'circle') {
              shape.coords[0]+= xVector;
              shape.coords[1]+= yVector;
            }

            if (shape.type === 'polygon') {
              updatePolygonCoords(xVector, yVector);
              return;
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
          element.css('z-index', 105);
        };

        scope.stopShapeMove = function () {
          isMoving = false;
          scope.map.areas[attributes.index].shape = shape;
          element.css('z-index', 102);
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

        function drawPolygon() {
          var i;
          var xCoords = [], yCoords = [];
          for (i = 0; i < shape.coords.length; i++) {
            xCoords.push(shape.coords[i][0]);
            yCoords.push(shape.coords[i][1]);
          }
          shape.left = Math.min.apply(Math, xCoords);
          shape.top = Math.min.apply(Math, yCoords);
          var xMaxPosition = Math.max.apply(Math, xCoords);
          var yMaxPosition = Math.max.apply(Math, yCoords);

          styles.left = shape.left;
          styles.top = shape.top;
          element.css(styles);
          element[0].width = xMaxPosition - shape.left;
          element[0].height = yMaxPosition - shape.top;

          ctx.beginPath();
          ctx.moveTo(shape.coords[0][0] - shape.left, shape.coords[0][1] - shape.top);
          for (i = 0; i < shape.coords.length; i++) {
            ctx.lineTo(shape.coords[i][0] - shape.left, shape.coords[i][1] - shape.top);
          }
          ctx.closePath();
          fillShape();
        }

        function updatePolygonCoords (xVector, yVector) {
          var i;
          for (i = 0; i < shape.coords.length; i++) {
            shape.coords[i][0]+= xVector;
            shape.coords[i][1]+= yVector;
          }
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
            return drawRectangle();
          }

          if (shape.type === 'circle') {
            return drawCircle();
          }

          if (shape.type === 'polygon') {
            return drawPolygon();
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

        scope.$watch('area.active', function () {
          element.toggleClass('active');
        }, true);
      }
    };
  })
  .directive('areaProperties', function () {
    return {
      restrict: 'A',
      link: function (scope, element) {
        scope.$watch('area.active', function () {
          element.toggleClass('active');
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
