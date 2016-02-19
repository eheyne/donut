var chai = require('chai');
var expect = chai.expect;
var donut = require('../donut.js');

describe('donut', function() {
  it('should start as an empty object', function() {
    expect(typeof donut).to.equal('object');
  });
});
