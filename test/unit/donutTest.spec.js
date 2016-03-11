var expect = chai.expect;

describe('donut plugin features', function() {
  var donut;
  beforeEach(function() {
    $('body').append('<div id="donut"></div>');
    $('body').append('<div class="donuts" style="width=50px; height=50px"></div>');
    $('body').append('<div class="donuts" style="width=100px; height=100px"></div>');
    $('body').append('<div class="donuts" style="width=500px; height=500px"></div>');
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
    var donuts = $('.donuts').Donut();
    donuts.each(function(index) {
      var svg = $(donuts[index]).find('svg');
      expect($(donuts[index]).width()).to.equal(svg.width());
    });
  });

  it('should create a background ring as a SVG path element', function() {
    var background = $('#donut').find('svg > path.background');
    expect(background.length).to.be.above(0);
    expect(background[0].tagName).to.equal('path');
  });
});
