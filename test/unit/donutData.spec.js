var expect = chai.expect;

describe('donut data plotting', function() {
  var donut;
  beforeEach(function() {
    $('body').append('<div id="donut"></div>');
    $('body').append('<div class="donuts"></div>');
    $('body').append('<div class="donuts"></div>');
  });

  afterEach(function() {
    if (donut) {
      donut.empty();
    }
  });

  it('should plot one data bar as an svg path given a data point and a total', function() {
    donut = $('#donut').Donut({ total: 100, data: 50 });
    var data = $('#donut').find('svg > path.data');
    expect(data.length).to.be.above(0);
    expect(data[0].tagName).to.equal('path');
  });
});
