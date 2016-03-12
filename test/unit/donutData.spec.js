var expect = chai.expect;

describe('donut data plotting', function() {
  var donut;
  beforeEach(function() {
    $('body').append('<div id="donut"></div>');
    $('body').append('<div id="test" class="donuts"></div>');
    $('body').append('<div id="test2" class="donuts"></div>');
  });

  afterEach(function() {
    if (donut) {
      donut.empty();
    }
    $('div#donut').remove();
    $('div.donuts').remove();
  });

  it('should plot one data bar as an svg path given a data point and a total', function() {
    donut = $('#donut').Donut({ total: 100, data: 50 });
    var data = $('#donut').find('svg > path.data');
    expect(data.length).to.be.above(0);
    expect(data[0].tagName).to.equal('path');
  });

  it('should not plot any data bar if total is missing and a single data point is given', function() {
    donut = $('#donut').Donut({ data: 50 });
    var data = $('#donut').find('svg > path.data');
    expect(data.length).to.be.equal(0);
  });

  it('should plot a data bar for each data point given', function() {
    donut = $('#donut').Donut({ data: [25, 25, 25, 25] });
    var data = $('#donut').find('svg > path.data');
    expect(data.length).to.be.equal(4);
  });

  it('should apply an id attribute of [parentId]-data[X], where X is the index of the svg element, to a single-selection', function() {
    donut = $('#donut').Donut({ total: 100, data: 50 });
    var paths = $('#donut').find('svg > path.data');
    var svgId = $('#donut').find('svg').attr('id');
    expect(paths.length).to.be.equal(1);
    paths.each(function(index) {
      var pathId = svgId + '-data0';
      expect($(paths[index]).attr('id')).to.be.equal(pathId);
    });
  });

  it('should apply an id attribute of [parentId]-data[X], where X is the index of the svg element, to a multi-selection', function() {
    var donuts = $('.donuts').Donut({ data: [25, 25, 25, 25] });
    expect($(donuts).length).to.be.equal(2);
    donuts.each(function(svgIndex) {
      var parentId = $(donuts[svgIndex]).attr('id');
      var svgId = $(donuts[svgIndex]).find('svg').attr('id');
      expect(svgId).to.be.equal(parentId + '-donut' + svgIndex);

      var paths = $(donuts[svgIndex]).find('svg > path.data');
      paths.each(function(index) {
        var pathId = svgId + '-data' + index;
        expect($(paths[index]).attr('id')).to.be.equal(pathId);
      });
    });
  });
});
