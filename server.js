const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const worldGen = require('./world_gen.js')

const app = express();
const server = http.createServer(app);
server.listen(3001);
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/map.json', respondWithMap);
app.post('/influenced_map.json', respondWithInfluencedMap);

function respondWithMap(req, res) {
  res.json(worldGen.genMap([]));
}

function respondWithInfluencedMap(req, res) {
  res.json(worldGen.genMap(req.body));
}
