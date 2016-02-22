(function(factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    factory(jQuery);
  }
}(function($) {
  var Donut = function() {
    
    var $this = $(this);

    if ($this.length > 0) {
      $this.append('<svg />');
      var svgElements = $this.find('svg');

      svgElements.each(function(index) {
        var svgElement = svgElements[index];
        svgElement.setAttribute('width', $this.width());
        svgElement.setAttribute('height', $this.height());
      });
    } else {
      console.log('No elements found in selector', this.selector);
    }

    return this;
  };

  $.fn['Donut'] = Donut;
}));
