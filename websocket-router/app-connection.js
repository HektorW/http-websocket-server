
var _ = require('underscore');

function App(router, id) {
  this.id = id;
  this.router = router;

  this.connections = {};
};

App.prototype.addConnection = function(socket) {
  this._setupSocket(socket);
};

App.prototype._setupSocket = function(socket) {
  var app = this;

  if (this.connections[socket.id]) {
    // socket is already connected to this app
    return;
  }

  this.connections[socket.id] = socket;

  socket.on('app.emit', function(data) {
    var event = data.event;
    var eventData = data.data;
    var to = data.to;
    
    var recipients = to ? [app.connections[to]] : app.getOthers(socket);

    _.each(recipients, function(recipient) {
      recipient.emit(event, eventData);
    })
  });

  socket.on('app.connections', function(data) {
    app.emitConnections(socket);
  });

  socket.on('disconnect', function() {
    delete app.connections[socket.id];

    app.emitConnections();

    if (_.isEmpty(app.connections)) {
      app.router.removeApp(app);
    }
  });

  socket.emit('app.connected', {
    appId: this.id
  });
  app.emitConnections();
  console.log('sockets in app', _.map(app.connections, function() { return arguments[0].id; }));
};

App.prototype.emitConnections = function(socket) {
  if (!socket) {
    _.each(this.connections, _.bind(this.emitConnections, this));
  } else {
    var others = this.getOthers(socket);

    var data = {
      connections: _.map(others, function(other) {
        return {
          id: other.id
        };
      })
    };

    socket.emit('app.connections', data);
  }
};

App.prototype.getOthers = function(socket) {
  return _.filter(this.connections, function(other) {
    return other.id !== socket.id;
  });
};




module.exports = App;