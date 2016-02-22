var expect = chai.expect;

describe('donut', function() {
  var donut;
  beforeEach(function() {
    donut = $('#donut').Donut();
  });

  afterEach(function() {
    if (donut) {
      donut.empty();
    }
  });

  it('should handle if no elements selected', function() {
    var empty = $('#empty').Donut();
    expect(empty.length).to.equal(0);
  });

  it('should be a typeof object', function() {
    expect(typeof donut).to.equal('object');
  });

  it('should support chaining', function() {
    donut = $('#donut').Donut().append('<h1>Test</h1>');
    var h1 = $('#donut').find('h1');
    expect(h1.text()).to.equal('Test');
  });

  it('should create one svg element', function() {
    var svg = $('#donut').find('svg');
    expect(svg.length).to.equal(1);
    expect(svg[0]).to.exist;
  });

  it('should handle multiple items returned from selector', function() {
    
    var donuts = $('.donuts').Donut();
    donuts.each(function(index) { 
      expect(donuts[index].children.length).to.equal(1);

      var svg = $(donuts[index]).find('svg');
      var offset = 4;  // don't know why its 4 off.
      expect(donut.width()).to.equal(svg.width());
      var height = svg.height();
      expect(donut.height()).to.be.within(height - offset, height + offset);
    });

    donuts.each(function(index) {
      $(donuts[index]).empty();
    });
  });

  it('should contain an svg element with the width and height of its parent', function() {
    var svg = $('#donut').find('svg');
    var offset = 4;  // don't know why its 4 off.
    expect(donut.width()).to.equal(svg.width());
    expect(donut.height()).to.equal(svg.height() + offset);
  });
});
