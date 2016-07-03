//var React = require('react');
//var ReactDomServer = require('react-dom/server');
var express = require('express');
var http = require('http');
var worldGen = require('./world_gen.js')

var app = express();
var server = http.createServer(app);
server.listen(3001);
app.use(express.static(__dirname));

app.get('/map.json', respondWithMap);

function respondWithMap(req, res) {
  res.json(worldGen.genMap());
}
