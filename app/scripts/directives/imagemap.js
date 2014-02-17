'use strict';

angular.module('imageMapEditor', [])
  .directive('imagemapEditor', function () {
    return {
      link: function (scope, element, attributes) {
        var isDrawing = false;
        var lastCords = {};
        var areasList = [];

        element.find('.preview').bind('click', function (event) {
          console.log('Click');
          var x = event.offsetX;
          var y = event.offsetY;
          if (!isDrawing) {
            var area = element.append('<canvas class="area" />');
            var ctx = element.find('.area')[0].getContext('2d');
            areasList.push({element: area, ctx: ctx, cords: []});
            lastCords.x = x;
            lastCords.y = y;
            areasList[0].cords.push(x, y);
            isDrawing = true;
            areasList[0].ctx.fillStyle = 'red';
            return areasList[0].ctx.fillRect(lastCords.x - 5, lastCords.y - 5, 10, 10);
          }
          isDrawing = false;
          var width = x - lastCords.x;
          var height = y - lastCords.y;
          areasList[0].ctx.lineWidth = 1;
          areasList[0].ctx.strokeStyle = 'white';
          areasList[0].ctx.strokeRect(lastCords.x, lastCords.y, width, height);
          areasList[0].ctx.restore();
        });

        element.find('.preview').bind('mousemove', function (event) {
          if (isDrawing) {
            console.log('Mouse move');
          }
        });
      }
    };
  });
