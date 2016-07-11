//var React = require('react');
//var ReactDomServer = require('react-dom/server');
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var worldGen = require('./world_gen.js')

var app = express();
var server = http.createServer(app);
server.listen(3001);
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/map.json', respondWithMap);
app.post('/influenced_map.json', respondWithInfluencedMap);

function respondWithMap(req, res) {
  res.json(worldGen.genMap(["0 0 water"]));
}

function respondWithInfluencedMap(req, res) {
  res.json(worldGen.genMap(req.body));
}
