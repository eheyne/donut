module.exports = function(config) {
  config.set({
    basePath: './',
    frameworks: ['mocha'],
    files: [
      'node_modules/jquery/dist/jquery.js',
      'node_modules/mocha/mocha.js',
      'node_modules/chai/chai.js',
      'node_modules/jquery-mockjax/dist/jquery.mockjax.js',
      {pattern: 'donut.js', watched: true},
      {pattern: 'test/unit/*.spec.js', watched: true}],
    exclude: [],
    browsers: ['PhantomJS']
  });
};

