var expect = chai.expect;

if ($.hasOwnProperty('mockjaxSettings')) {
  $.mockjaxSettings.contentType = 'application/json';
  $.mockjaxSettings.logging = false;
  $.mockjaxSettings.responseTime = 1;
}

describe('donut data plotting', function() {
  var donut;
  beforeEach(function() {
    $('body').append('<div id="donut"></div>');
    $('body').append('<div class="donuts"></div>');
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
    var data = $('#donut').find('svg > path.donut-data');
    expect(data.length).to.be.above(0);
    expect(data[0].tagName).to.equal('path');
  });

  it('should not plot any data bar if total is missing and a single data point is given', function() {
    donut = $('#donut').Donut({ data: 50 });
    var data = $('#donut').find('svg > path.donut-data');
    expect(data.length).to.be.equal(0);
  });

  it('should plot a data bar for each data point given', function(done) {
    donut = $('#donut').Donut({ data: [25, 25, 25, 25] });
    var data = $('#donut').find('svg > path.donut-data');
    done();
    expect(data.length).to.be.equal(4);
  });

  it('should handle data as an object containing url', function(done) {
    var testUrl = '*/some/endpoint';
    $.mockjax({
      url: testUrl,
      type: 'GET',
      responseText: JSON.stringify([25, 25, 25, 25])
    });
    donut = $('#donut').Donut({ data: { url: testUrl } });
    var data = $('#donut').find('svg > path.donut-data');
    done();
    expect(data.length).to.be.equal(4);
    $.mockjaxClear();
  });

  it('should apply a class attribute of donut-data[X], where X is the index of the svg element, to a single-selection', function() {
    donut = $('#donut').Donut({ total: 100, data: 50 });
    var paths = $('#donut').find('svg > path.donut-data');
    var parentId = $('#donut').attr('id');
    expect(paths.length).to.be.equal(1);
    paths.each(function(index) {
      var pathClass = 'donut-data0';
      expect($(paths[index]).attr('class')).to.be.equal('donut-data ' + pathClass);
    });
  });

  it('should apply a class attribute of donut-data[X], where X is the index of the svg element, to a multi-selection', function() {
    var donuts = $('.donuts').Donut({ data: [25, 25, 25, 25] });
    expect($(donuts).length).to.be.equal(2);
    donuts.each(function(svgIndex) {
      var parentId = $(donuts[svgIndex]).attr('id');
      var svgId = $(donuts[svgIndex]).find('svg').attr('id');
      var pathClass = parentId ? parentId + '-donut' + svgIndex : 'donut' + svgIndex;
      expect(svgId).to.be.equal(pathClass);

      var paths = $(donuts[svgIndex]).find('svg > path.donut-data');
      paths.each(function(index) {
        var pathId = 'donut-data' + index;
        expect($(paths[index]).attr('class')).to.be.equal('donut-data ' + pathId);
      });
    });
  });

  it('should not create an SVG text element when the text property is not present', function() {
    var donuts = $('.donuts').Donut({ data: [25, 25, 25, 25] });
    expect($(donuts).length).to.be.equal(2);
    donuts.each(function(svgIndex) {
      var text = $(donuts[svgIndex]).find('svg > text');
      expect(text.length).to.be.equal(0);
    });
  });

  it('should not create an SVG text element when the text property is undefined', function() {
    var donuts = $('.donuts').Donut({ data: [25, 25, 25, 25], text: undefined });
    expect($(donuts).length).to.be.equal(2);
    donuts.each(function(svgIndex) {
      var text = $(donuts[svgIndex]).find('svg > text');
      expect(text.length).to.be.equal(0);
    });
  });

  it('should not create an SVG text element when the text property is false', function() {
    var donuts = $('.donuts').Donut({ data: [25, 25, 25, 25], text: false });
    expect($(donuts).length).to.be.equal(2);
    donuts.each(function(svgIndex) {
      var text = $(donuts[svgIndex]).find('svg > text');
      expect(text.length).to.be.equal(0);
    });
  });

  it('should create an SVG text element when the text property is true', function() {
    var donuts = $('.donuts').Donut({ data: [25, 25, 25, 25], text: true });
    expect($(donuts).length).to.be.equal(2);
    donuts.each(function(svgIndex) {
      var text = $(donuts[svgIndex]).find('svg > text');
      expect(text.length).to.be.equal(1);
    });
  });

  it('should not add a threshold class when threshold is not given', function() {
    var donuts = $('.donuts').Donut({ total: 100, data: 25 });
    expect($(donuts).length).to.be.equal(2);
    donuts.each(function(svgIndex) {
      var paths = $(donuts[svgIndex]).find('svg > path.donut-data');
      expect(paths.length).to.be.equal(1);
      paths.each(function(index) {
        var classes = $(paths[index]).attr('class');
        expect(classes).to.not.be.empty;
        expect(classes).to.not.include('above-threshold');
        expect(classes).to.not.include('below-threshold');
      });
    });
  });

  it('should add class above-threshold when the threshold is given, to a single path when only one data point and it is above threshold', function() {
    var donuts = $('.donuts').Donut({ total: 100, data: 25, threshold: 20 });
    expect($(donuts).length).to.be.equal(2);
    donuts.each(function(svgIndex) {
      var paths = $(donuts[svgIndex]).find('svg > path.donut-data');
      expect(paths.length).to.be.equal(1);
      paths.each(function(index) {
        expect($(paths[index]).attr('class')).to.include('above-threshold');
      });
    });
  });

  it('should add class above-threshold to all paths when it is above threshold', function() {
    var donuts = $('.donuts').Donut({ data: [25, 25, 25, 25], threshold: 20 });
    expect($(donuts).length).to.be.equal(2);
    donuts.each(function(svgIndex) {
      var paths = $(donuts[svgIndex]).find('svg > path.donut-data');
      expect(paths.length).to.be.equal(4);
      paths.each(function(index) {
        expect($(paths[index]).attr('class')).to.include('above-threshold');
      });
    });
  });

  it('should add class below-threshold when the threshold is given and the data point is below threshold', function() {
    var donuts = $('.donuts').Donut({ total: 100, data: 25, threshold: 30});
    expect($(donuts).length).to.be.equal(2);
    donuts.each(function(svgIndex) {
      var paths = $(donuts[svgIndex]).find('svg > path.donut-data');
      expect(paths.length).to.be.equal(1);
      paths.each(function(index) {
        expect($(paths[index]).attr('class')).to.include('below-threshold');
      });
    });
  });

  it('should add class below-threshold to all paths when it is below threshold', function() {
    var donuts = $('.donuts').Donut({ data: [25, 25, 25, 25], threshold: 30});
    expect($(donuts).length).to.be.equal(2);
    donuts.each(function(svgIndex) {
      var paths = $(donuts[svgIndex]).find('svg > path.donut-data');
      expect(paths.length).to.be.equal(4);
      paths.each(function(index) {
        expect($(paths[index]).attr('class')).to.include('below-threshold');
      });
    });
  });
});
