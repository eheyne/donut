var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var fileToHost = process.argv[2] || 'public';

app.set('port', (process.env.PORT || 3000));
app.use('/', express.static(path.join(__dirname, fileToHost)));
app.use(bodyParser.json());

function randomize() {
  return Math.floor(Math.random() * 25 + 1);
}

app.get('/api/data', function(req, res) {
  res.json([randomize(), randomize(), randomize(), randomize()]);
});

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});

