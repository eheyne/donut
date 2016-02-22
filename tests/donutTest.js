var expect = chai.expect;

describe('donut', function() {
  it('should be a typeof object', function() {
    var donut = $('#donut').Donut();
    expect(typeof donut).to.equal('object');
  });

  it('should support chaining', function() {
    var donut = $('#donut').Donut().append('<h1>Test</h1>');
    var h1 = $('#donut').find('h1');
    expect(h1.text()).to.equal('Test');
  });
});
