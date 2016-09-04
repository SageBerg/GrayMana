var Promise = require('promise-polyfill');

const TreasureGen = require('./treasure').TreasureGen;
const WorldGen = require('./world_gen').WorldGen;
const DB = require('./db').DB;
const Auth = require('./auth_server').Auth;
var state = require('./state').state;

const database = new DB();
const auth = new Auth();

var worldGen = null;
Promise.all(
  [database.loadAllChunksFromDB(state.chunks)]
).then(
  [worldGen = new WorldGen(state.chunkSize, state.chunks, database)]
);

var syncState = function() {
  for (email in state.characters) {
    if (state.characters.hasOwnProperty(email)) {
      database.updateCharacter(state.characters[email], email);
    };
  }
}

setInterval(syncState, 1000);

var getPixel = function (x, y) {
  var chunkX = Math.floor(x / state.chunkSize);
  var chunkY = Math.floor(y / state.chunkSize);

  var row = y % state.chunkSize;
  var col = x % state.chunkSize;

  if (row < 0) {
    row += state.chunkSize;
  }
  if (col < 0) {
    col += state.chunkSize;
  }

  return state.chunks[chunkX + ' ' + chunkY][row][col];
};

var GameHandlers = function() {}

GameHandlers.prototype.respondWithChunk = function(req, res) {
  if (state.chunks[req.body.chunkCoords] !== undefined) {
    res.json(state.chunks[req.body.chunkCoords]);
  } else {
    var chunk = worldGen.genChunk(req.body.chunkCoords, state.chunkSize);
    state.chunks[req.body.chunkCoords] = chunk;
    res.json(chunk);
  }
}

GameHandlers.prototype.respondWithChunkSize = function(req, res) {
  res.json(state.chunkSize);
}

GameHandlers.prototype.respondWithCharacter = function(req, res) {
  var email = auth.getEmailFromToken(req.body.token);
  if (state[email] === undefined) {
    var queryResult = database.getCharacter(email);
    queryResult.on('row', function(row) {
      if (row.x_coord !== undefined && row.y_coord !== undefined) {
        state.characters[email] = {x_coord: row.x_coord, y_coord: row.y_coord};
        res.json({'x_coord': row.x_coord, 'y_coord': row.y_coord});
      } else {
        res.send();
      }
    });
  } else {
    console.log('the character was already in local memory')
    res.json(state[email]);
  }
}

GameHandlers.prototype.respondWithMove = function(req, res) {
  var email = auth.getEmailFromToken(req.body.token);
  var terrain_code = getPixel(req.body.x, req.body.y);
  if (terrain_code > 0) { //means its not water
    state.characters[email].x_coord = parseInt(req.body.x);
    state.characters[email].y_coord = parseInt(req.body.y);
    res.send(true);
  } else {
    res.send(false);
  }
}

GameHandlers.prototype.respondWithTreasureDrop = function(req, res) {
  var treasureGen = new TreasureGen();
  var manaDrop = treasureGen.manaDrop();
  var runeDrop = treasureGen.runeDrop();
  var drop = {'manaDrop': manaDrop, 'runeDrop': runeDrop};
  res.json({treasureDrop: drop});
}

exports.GameHandlers = GameHandlers;
