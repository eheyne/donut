var expect = chai.expect;

describe('donut event handling', function() {
  var donut;
  var hoverHandled;
  var hoverLeaveHandled;

  beforeEach(function() {
    $('body').append('<div id="donut"></div>');
    hoverHandled = false;
    hoverLeavehandled = false;
  });

  afterEach(function() {
    if (donut) {
      donut.empty();
    }
    $('div#donut').remove();
    hoverHandled = undefined;
    hoverLeavehandled = undefined;
  });

  function onHoverFunc(event) {
    hoverHandled = true;
  };

  function onHoverLeaveFunc(event) {
    hoverLeaveHandled = true;
  };

  it('should handle the hover property as an empty array', function(done) {
    donut = $('#donut').Donut({ total: 100, data: 50, hover: [] });
    var svg = $('#donut').find('svg');
    svg.trigger('mouseenter');

    setTimeout(function() {
      expect(hoverHandled).to.be.equal(false);
      done();
    }, 100);
  });

  it('should handle the hover property as a scalar value', function(done) {
    donut = $('#donut').Donut({ total: 100, data: 50, hover: onHoverFunc });
    var svg = $('#donut').find('svg');
    svg.trigger('mouseenter');

    setTimeout(function() {
      expect(hoverHandled).to.be.equal(true);
      done();
    }, 100);
  });

  it('should handle the hover over event', function(done) {
    donut = $('#donut').Donut({ total: 100, data: 50, hover: [onHoverFunc] });
    var svg = $('#donut').find('svg');
    svg.trigger('mouseenter');

    setTimeout(function() {
      expect(hoverHandled).to.be.equal(true);
      done();
    }, 0);
  });

  it('should handle the hover leave event', function(done) {
    donut = $('#donut').Donut({ total: 100, data: 50, hover: [undefined, onHoverLeaveFunc] });
    var svg = $('#donut').find('svg');
    svg.trigger('mouseleave');

    setTimeout(function() {
      expect(hoverLeaveHandled).to.be.equal(true);
      done();
    }, 0);
  });

  it('should handle the hover enter and leave events', function(done) {
    donut = $('#donut').Donut({ total: 100, data: 50, hover: [onHoverFunc, onHoverLeaveFunc] });
    var svg = $('#donut').find('svg');
    svg.trigger('mouseenter');
    svg.trigger('mouseleave');

    setTimeout(function() {
      expect(hoverHandled).to.be.equal(true);
      expect(hoverLeaveHandled).to.be.equal(true);
      done();
    }, 0);
  });
});
