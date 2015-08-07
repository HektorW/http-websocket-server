/// <reference path="../typings/node/node.d.ts"/>

var colors = require('colors');
var express = require('express');
var minimist = require('minimist');
var path = require('path');
var http = require('http');
var serveIndex = require('serve-index');

var args = minimist(process.argv.slice(2));

var publicRoot = args._[0] || '';
var serverRoot = path.join(process.cwd(), publicRoot);

var serverPort = parseInt(args.port, 10) || 8080;

var app = express();

app.use(express.static(serverRoot));
app.use(serveIndex(serverRoot, { icons: true }));


var server = http.Server(app);
server.listen(serverPort, function() {
	console.log(('Server listening at http://' + server.address().address + ':' + server.address().port).yellow);
	console.log(('Serving from "' + serverRoot + '"').yellow);
});

module.exports = server;
