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

      var data = initiateSvgRender(svgElements, config, svgRender);

    } else {
      console.log('No elements found in selector', this.selector);
    }

    function callApiEndPoint(svgElement, config, svgRenderCallback) {
      if (config.data.url !== undefined) {
        $.get(config.data.url).done(function(response) {
          if (typeof(response) !== 'undefined') {
            svgRenderCallback(svgElements, config, response);
            if (config.data.pollingInterval !== undefined) {
              setTimeout(function() {
                callApiEndPoint(svgElement, config, svgRenderCallback);
              }, config.data.pollingInterval);
            }
          }
        });
      }
    }

    function initiateSvgRender(svgElements, config, svgRenderCallback) {
      if (config !== undefined && svgRenderCallback !== undefined) {
        if (typeof config.data === 'object') {
          if (Array.isArray(config.data.points)) {
            svgRenderCallback(svgElements, config, config.data);
          } else {
            if (config.data.url !== undefined) {
              callApiEndPoint(svgElements, config, svgRenderCallback);
            } else {
              svgRenderCallback(svgElements, config, config.data);
            }
          }
        } else {
          console.log('config type not valid');
        }
      }
    }

    function svgRender(svgElements, config, data) {
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

        createUpdateBackgroundRing($svgElement, strokeWidth);

        if (config) {
          var dataPaths = createDataPaths($svgElement, config, data, strokeWidth);
          dataPaths.forEach(function(dataPath) {
            $svgElement.append(dataPath);
            animate(dataPath, config);
          });

          var svgText = createUpdateText($svgElement, config, data);
          if (svgText) {
            $svgElement.append(svgText);
          }
        }
      });
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
          console.log('Not a valid value for the hover property');
        }
      }
    }

    function getSvgPathStrokeWidthAsDefinedInCSS($svg) {
      $svg.append('<path/>');
      var strokeWidth = $svg.find('path').css('stroke-width').replace(/[^-\d\.]/g, '');
      $svg.find('path').remove();

      return strokeWidth;
    }

    function calculatePathD($svg, startPercentage, endPercentage, strokeWidth) {
      var clockWise = true;
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

    function createUpdateBackgroundRing($svgElement, strokeWidth) {
      var percentage = 100;

      var path = $svgElement.find('path.background')[0];
      if (path === undefined) {
        path = document.createElementNS(svgNamespace, 'path');
        path.setAttribute('class', 'background');
        $svgElement.append(path);
      }

      var d = calculatePathD($svgElement, 0, percentage, strokeWidth);
      path.setAttribute('d', d);
    }

    function sumArray(array) {
      var sum = 0;
      for(var i = 0, n = array.length; i < n; i++) 
      { 
        sum += array[i].value; 
      }
      return sum;
    }

    function calcPercentage(dataPoint, total) {
      return (dataPoint.value / total) * 100;
    }

    function calcDataPointPercentage(data, total, index) {
      var percentage;

      if (Array.isArray(data.points)) {
        percentage = calcPercentage(data.points[index], total); 
      } else {
        percentage = calcPercentage(data.points, total);
      }

      return percentage;
    }

    function assignClassAttribute(path, dataPoint, threshold, index) {
      index = index || 0;
      var pathClass = donutPathBaseClassName + '-' + dataPoint.key;
      if (threshold) {
        if (dataPoint.value > threshold) {
          path.setAttribute('class', donutPathBaseClassName + ' ' + pathClass + ' above-threshold');
        } else {
          path.setAttribute('class', donutPathBaseClassName + ' ' + pathClass + ' below-threshold');
        }
      } else {
        path.setAttribute('class', donutPathBaseClassName + ' ' + pathClass);
      }
    }

    function handleDataArray($svg, paths, config, data, strokeWidth) {
      var total = data.total ? data.total : sumArray(data.points);
      var runningTotal = 0;
      var index = 0;
      
      data.points.forEach(function(dataPoint) {
        var path = document.createElementNS(svgNamespace, 'path');
        assignClassAttribute(path, dataPoint, config.threshold, index);
        var percentage = calcDataPointPercentage(data, total, index);
        path.setAttribute('data-percent', percentage);
        path.setAttribute('data-value', data.points[index].value);
        var d = calculatePathD($svg, runningTotal, percentage, strokeWidth);
        path.setAttribute('d', d);
        paths.push(path);

        index++;
        runningTotal += calcPercentage(dataPoint, total);
      });
    }

    function createDataPaths($svg, config, data, strokeWidth) {
      var paths = [];

      if (typeof data === 'object') {
        if (Array.isArray(data.points)) {
          handleDataArray($svg, paths, config, data, strokeWidth);
        } else if (data.total) {
          var path = document.createElementNS(svgNamespace, 'path');
          assignClassAttribute(path, data.points, config.threshold);
          var percentage = calcDataPointPercentage(data, data.total);
          path.setAttribute('data-percent', percentage);
          path.setAttribute('data-value', data.points.value);
          var d = calculatePathD($svg, 0, percentage, strokeWidth);
          path.setAttribute('d', d);
          paths.push(path);
        }
      } else {
        console.log('data points type not recognized');
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
        path.style.transition = path.style.WebkitTransition = 'stroke-dashoffset ' + time + ' ease-in-out, stroke 1s ease';
        path.style.strokeDashoffset = to;
      }
    }

    function createUpdateText($svgElement, config, data) {
      var textRemaining;

      if (config && config.text) {
        textRemaining = $svgElement.find('text.donut-text')[0];
        if (textRemaining === undefined) {
          textRemaining = document.createElementNS(svgNamespace, 'text');
          textRemaining.setAttribute('class', 'donut-text');
        }
        textRemaining.setAttribute('x', $svgElement.parent().width()/2);
        textRemaining.setAttribute('y', $svgElement.parent().height()/2 - 5);

        var value;
        if (Array.isArray(data.points)) {
          value = sumArray(data.points);
        } else {
          value = data;
        }

        var total = data.total ? data.total : value;
        textRemaining.textContent = value + ' of ' + total;
      }

      return textRemaining;
    }

    return this;
  };

  $.fn.Donut = Donut;
}));
