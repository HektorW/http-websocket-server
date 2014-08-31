

var server = require('./http-server/server.js');
// var io = require('socket.io')(server);
var io = require('socket.io').listen(8090);
var Router = require('./websocket-router/router.js');

io.on('connection', function(socket) {
  socket.on('connect.app', function(data) {
    Router.addConnection(socket, data.appId);
  });
});