
var _ = require('underscore');

var app = require('express')();
var bodyParser = require('body-parser');
var server = require('http').Server(app);

// app.use()
app.get('/', function(req, res) {
  console.log(req.url);
});



var port = 8080;
server.listen(port);

module.exports = server;