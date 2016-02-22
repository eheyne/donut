var filecopy = require('filecopy');

filecopy('./node_modules/jquery/dist/jquery.js', '.test',
  { mkdirp: true }, 
  function(err) {
});

filecopy('./node_modules/mocha/mocha.css', '.test',
  { mkdirp: true }, 
  function(err) {
});

filecopy('./node_modules/mocha/mocha.js', '.test',
  { mkdirp: true }, 
  function(err) {
});

filecopy('./node_modules/chai/chai.js', '.test',
  { mkdirp: true }, 
  function(err) {
});

filecopy('./donut.js', '.test',
  { mkdirp: true }, 
  function(err) {
});

filecopy('./tests/*.*', '.test',
  { mkdirp: true }, 
  function(err) {
});
