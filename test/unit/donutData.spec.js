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
});
