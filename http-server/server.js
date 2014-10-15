
var colors = require('colors'),
    errorcodes = require('./errorcodes.js'),
    _ = require('underscore'),
    fs = require('fs'),
    path = require('path'),
    mime = require('mime'),
    app = require('express')(),
    server = require('http').Server(app),
    argv = require('minimist')(process.argv.slice(2));

var port = parseInt(argv.port, 10) || 8080;

var dirTemplate = _.template((function() {/*
<!doctype html>
  <head>
    <title><%= name %></title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <style>
      body{color:#111;}
      a{color:#0074D9;transition:color 0.2s;}
      a:hover{color:#7FDBFF;}
      a:visited{color:#85144B;}
      li{color:#111;}
    </style>
  </head>

  <body>
    <h1><%= url %></h1>
    <ul>
      <% _.each(files, function(file) { %>
        <li><a href="<%- file.url %>"><%- file.name %></a></li>
      <% }); %>
    </ul>
  </body>
</html>
*/}.toString().split('\n').slice(1, -1).join('\n')));






app.get('*', function(req, res) {
  var localpath = process.cwd() + req.url;
  var url = req.url;

  fs.stat(localpath, function(err, stat) {
    if (err) {
      sendError(res, err);
      return;
    }

    if (stat.isFile()) {
      // File
      sendFile(res, localpath);

    } else if (stat.isDirectory()) {

      // Directory
      sendDirectory(res, localpath, url);

    } else {

      // Send server error

    }
  });
});

function sendFile(response, localpath) {
  fs.readFile(localpath, function(err, data) {
    if (err) {
      sendError(response, err);
      return;
    }

    var mimetype = mime.lookup(localpath);

    response.type(mimetype);
    response.send(data);
  });
}

function sendDirectory(response, localpath, url) {
  fs.readdir(localpath, function(err, files) {
    if (err) {
      sendError(response, err);
      return;
    }

    var indexFile = _.find(files, function(file) {
      return file.toLowerCase() === 'index.html' || file.toLowerCase() === 'index.htm';
    });
    if (indexFile) {
      sendFile(response, path.join(localpath, indexFile));
    } else {
      var html = dirTemplate({
        name: path.basename(url),
        url: url,
        files: _.map(files, function(file) {
          return {
            url: path.join(url, file),
            name: file
          };
        })
      });

      response.type('text/html');
      response.send(html);
    }

  });
}

function sendError(response, error) {
  var httpError = errorcodes.getError(error.errno);
  response.status(httpError.code).send(httpError.description);
}



console.log(('started listening on port: ' + port).yellow);
server.listen(port);

module.exports = server;