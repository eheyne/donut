(function(factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    factory(jQuery);
  }
}(function($) {
  var Donut = function() {
    var svgNamespace = 'http://www.w3.org/2000/svg';
    var $this = $(this);

    if ($this.length > 0) {
      $this.append('<svg />');
      var svgElements = $this.find('svg');

      svgElements.each(function(index) {
        var svgElement = svgElements[index];
        svgElement.setAttribute('width', $this.width());
        svgElement.setAttribute('height', $this.height());

        var $svgElement = $(svgElement);
        var background = backgroundRing($svgElement, 4);
        $svgElement.append(background);
      });
    } else {
      console.log('No elements found in selector', this.selector);
    }

    function createPath(strokeWidth) {
      var path = document.createElementNS(svgNamespace, 'path');
      path.setAttribute('stroke-width', strokeWidth);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', '#EFEFEF');
      return path;
    }

    function calculatePathD($svg, percentage, clockWise, strokeWidth) {
      var size = Math.min($svg.height(), $svg.width());
      var centerX = $svg.width() / 2;
      var centerY = size / 2;

      var unit = (Math.PI * 2) / 100;
      var startAngle = 0;
      var endAngle = Math.abs(percentage * unit - 0.001);

      var radius = centerY - (strokeWidth / 2);
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

      return ' M ' + centerX + ',' + y1 +
        ' A ' + radius + ',' + radius + 
        ' 0 ' + largeArc + ' ' + direction + ' ' +
        x2 + ',' + y2;
    }

    function backgroundRing($svg, strokeWidth) {
      var clockWise = true;
      var percentage = 100;

      var path = createPath(strokeWidth);
      path.setAttribute('class', 'background');

      var d = calculatePathD($svg, percentage, clockWise, strokeWidth);
      path.setAttribute('d', d);
      return path;
    }

    return this;
  };

  $.fn.Donut = Donut;
}));
