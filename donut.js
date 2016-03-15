(function(factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    factory(jQuery);
  }
}(function($) {
  var Donut = function(config) {
    var svgNamespace = 'http://www.w3.org/2000/svg';
    var donutBaseClassName = 'donut';
    var donutPathBaseClassName = donutBaseClassName + '-data';
    var $this = $(this);

    if ($this.length > 0) {
      $this.append('<svg />');
      var svgElements = $this.find('svg');
      var indexOfSvgElement = 0;

      svgElements.each(function(index) {
        var svgElement = svgElements[index];
        var $svgElement = $(svgElement);
        var parentId = $svgElement.parent().attr('id');
        var id = parentId ? parentId + '-donut' + index : 'donut' + index;

        svgElement.setAttribute('id', id);
        svgElement.setAttribute('class', donutBaseClassName);

        registerClickEvent($svgElement, config);
        registerHoverEvent($svgElement, config);

        var strokeWidth = getSvgPathStrokeWidthAsDefinedInCSS($(svgElement));
        svgElement.setAttribute('width', $svgElement.parent().width());
        svgElement.setAttribute('height', $svgElement.parent().height());

        var background = backgroundRing($svgElement, strokeWidth);
        $svgElement.append(background);

        if (config) {
          var dataPaths = createDataPaths($svgElement, config, strokeWidth);
          dataPaths.forEach(function(dataPath) {
            $svgElement.append(dataPath);
            animate(dataPath, config);
          });
        }
        
        indexOfSvgElement++;
      });
    } else {
      console.log('No elements found in selector', this.selector);
    }

    function registerClickEvent($svgElement, config) {
      if (config && config.click) {
        if (typeof config.click === 'function') {
          $svgElement.click(config.click);
        } else {
          console.log('Not a valid value for the click property');
        }
      }
    }

    function registerHoverEvent($svgElement, config) {
      if (config && config.hover) {
        if (typeof config.hover === 'function') {
          $svgElement.hover(config.hover);
        } else if (config.hover.length > 0) { // Assuming array if not a single function.
          $svgElement.hover(config.hover[0], config.hover[1]);
        } else {
          console.log('Not a valid valud for the hover property');
        }
      }
    }

    function getSvgPathStrokeWidthAsDefinedInCSS($svg) {
      $svg.append('<path/>');
      var strokeWidth = $svg.find('path').css('stroke-width').replace(/[^-\d\.]/g, '');
      $svg.find('path').remove();

      return strokeWidth;
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

    function calcPercentage(data, total) {
      return (data / total) * 100;
    }

    function calcDataPointPercentage(config, index, total) {
      var percentage;

      if (typeof config.data === 'number') {
        percentage = calcPercentage(config.data, config.total);
      } else {
        percentage = calcPercentage(config.data[index], total); 
      }

      return percentage;
    }

    function createDataPaths($svg, config, strokeWidth) {
      var paths = [];
      var clockWise = true;

      if (typeof config.data === 'number') {
        if (config.total) {
          var percentage = calcDataPointPercentage(config);

          var path = document.createElementNS(svgNamespace, 'path');
          var pathClass = donutPathBaseClassName + '0';
          path.setAttribute('class', donutPathBaseClassName + ' ' + pathClass);

          var d = calculatePathD($svg, 0, percentage, clockWise, strokeWidth);
          path.setAttribute('d', d);
          paths.push(path);
        }
      } else {
        var total = config.total ? config.total : sumArray(config.data);
        var runningTotal = 0;
        var index = 0;
        
        config.data.forEach(function(dataPoint) {
          var path = document.createElementNS(svgNamespace, 'path');

          var pathClass = donutPathBaseClassName + index;
          path.setAttribute('class', donutPathBaseClassName + ' ' + pathClass);

          var percentage = calcDataPointPercentage(config, index, total);
          var d = calculatePathD($svg, runningTotal, percentage, clockWise, strokeWidth);
          path.setAttribute('d', d);
          paths.push(path);
          index++;
          runningTotal += calcPercentage(dataPoint, total);
        });
      }

      return paths;
    }

    function animate(path, config) {
      if (config && config.animate) {
        var length = path.getTotalLength();
        var time = '1s';
        var to = 0;

        if (typeof config.animate === 'string') {
          time = config.animate;
        }

        path.style.transition = path.style.WebkitTransition = 'none';
        path.style.strokeDasharray = length + ' ' + length;
        path.style.strokeDashoffset = length;
        path.getBoundingClientRect();
        path.style.transition = path.style.WebkitTransition = 'stroke-dashoffset ' + time + ' ease-in-out';
        path.style.strokeDashoffset = to;
      }
    }

    return this;
  };

  $.fn.Donut = Donut;
}));
