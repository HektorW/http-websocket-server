#! /usr/bin/env node

var server = require('./http-server/server.js');
var io = require('socket.io')(server);
var Router = require('./websocket-router/router.js');

io.on('connection', function(socket) {
  socket.on('app.connect', function(data) {
    Router.addConnection(socket, data.appId);
  });
});