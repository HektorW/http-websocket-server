
var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var mime = require('mime');

var app = require('express')();
var server = require('http').Server(app);


var dirTemplate = _.template((function() {/*
<!doctype html>
  <head>
    <title><%= name %></title>
    <meta name="viewport" content="width=device-width">
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
      console.log(err);
      res.send(err);
      return;
    }

    if (stat.isFile()) {
      // File

      fs.readFile(localpath, function(err, data) {
        if (err) {
          console.log(err);
          res.send(err);
          return;
        }

        var mimetype = mime.lookup(localpath);

        console.log('mime ', mimetype, localpath);

        res.type(mimetype);
        res.send(data);
      });

    } else if (stat.isDirectory()) {
      // Directory

      fs.readdir(localpath, function(err, files) {
        if (err) {
          console.log(err);
          res.send(err);
          return;
        }

        var html = dirTemplate({
          name: path.basename(url),
          url: url,
          files: _.map(files, function(file) {
            return {
              url: path.join(url, file),
              name: file
            }
          })
        });

        res.type('text/html');
        res.send(html);
      });
    }
  });
});



var port = 8080;
server.listen(port);


module.exports = server;