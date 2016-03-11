(function(factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    factory(jQuery);
  }
}(function($) {
  var Donut = function(config) {
    var svgNamespace = 'http://www.w3.org/2000/svg';
    var $this = $(this);

    if ($this.length > 0) {
      $this.append('<svg />');
      var svgElements = $this.find('svg');
      var indexOfSvgElement = 0;

      svgElements.each(function(index) {
        var svgElement = svgElements[index];
        svgElement.setAttribute('width', $this.width());
        svgElement.setAttribute('height', $this.height());
        svgElement.setAttribute('class', 'donut');

        var $svgElement = $(svgElement);
        var background = backgroundRing($svgElement, 4);
        $svgElement.append(background);

        if (config) {
          var dataPaths = createDataPaths($svgElement, config);
          dataPaths.forEach(function(dataPath) {
            $svgElement.append(dataPath);
          });
        }
        
        indexOfSvgElement++;
      });
    } else {
      console.log('No elements found in selector', this.selector);
    }

    function calculatePathD($svg, startPercentage, endPercentage, clockWise, strokeWidth) {
      var size = Math.min($svg.height(), $svg.width());
      var centerX = $svg.width() / 2;
      var centerY = size / 2;

      var unit = (Math.PI * 2) / 100;
      var startAngle = Math.abs(startPercentage * unit - 0.001);
      var endAngle = Math.abs((startPercentage + endPercentage) * unit - 0.001);

      var radius = centerY - (strokeWidth / 2);
      var x1 = centerX + radius * Math.sin(startAngle);
      var y1 = centerY - radius * Math.cos(startAngle);
      var x2 = centerX + radius * Math.sin(endAngle);
      var y2 = centerY - radius * Math.cos(endAngle);

      var largeArc = 0;  // > or < 180 degrees
      if (endAngle - startAngle > Math.PI) {
        largeArc = 1;
      }

      var direction = 1;  // 1 - clock-wise, 0 - counter-clock-wise
      if (!clockWise) {
        direction = 0;
        if (largeArc === 1) {
          largeArc = 0;
        } else {
          largeArc = 1;
        }
      }

      return ' M ' + x1 + ',' + y1 +
        ' A ' + radius + ',' + radius + 
        ' 0 ' + largeArc + ' ' + direction + ' ' +
        x2 + ',' + y2;
    }

    function backgroundRing($svg, strokeWidth) {
      var clockWise = true;
      var percentage = 100;

      var path = document.createElementNS(svgNamespace, 'path');
      path.setAttribute('class', 'background');

      var d = calculatePathD($svg, 0, percentage, clockWise, strokeWidth);
      path.setAttribute('d', d);
      return path;
    }

    function sumArray(array) {
      var sum = 0;
      for(var i = 0, n = array.length; i < n; i++) 
      { 
        sum += array[i]; 
      }
      return sum;
    }

    function calcPercentage(config, index, total) {
      var percentage;

      if (typeof config.data === 'number') {
        percentage = (config.data / config.total) * 100;
      } else {
        percentage = (config.data[index] / total) * 100; 
      }

      return percentage;
    }

    function createDataPaths($svg, config) {
      var paths = [];
      var clockWise = true;

      if (typeof config.data === 'number') {
        if (config.total) {
          var percentage = calcPercentage(config);

          var path = document.createElementNS(svgNamespace, 'path');
          path.setAttribute('class', 'data');

          var d = calculatePathD($svg, 0, percentage, clockWise, 4);
          path.setAttribute('d', d);
          paths.push(path);
        }
      } else {
        var total = sumArray(config.data);
        var runningTotal = 0;
        var index = 0;
        
        config.data.forEach(function(dataPoint) {
          var path = document.createElementNS(svgNamespace, 'path');
          path.setAttribute('class', 'data');

          var percentage = calcPercentage(config, index, total);
          var d = calculatePathD($svg, runningTotal, percentage, clockWise, 4);
          path.setAttribute('d', d);
          paths.push(path);
          index++;
          runningTotal += dataPoint;
        });
      }

      return paths;
    }

    return this;
  };

  $.fn.Donut = Donut;
}));
