
var _ = require('underscore');
var App = require('./app-connection.js');

var Router = {
  apps: {},


  addConnection: function(socket, appId) {
    var app = this.apps[appId];
    if (!app) {
      app = this.apps[appId] = new App(this, appId);
    }

    app.addConnection(socket); 
  },

  removeApp: function(app) {
    delete this.apps[app.id];
  }
};



module.exports = Router;