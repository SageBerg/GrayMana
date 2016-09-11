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
  for (characterId in state.characters) {
    if (state.characters.hasOwnProperty(characterId)) {
      database.updateCharacter(state.characters[characterId], characterId);
    };
  };
};

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

GameHandlers.prototype.startGame = function(req, res) {
  var queryResult = database.allowedToPlayAsCharacter(req.body.characterId, req.session.userId);
  queryResult.on('end', function(result) {
    if (result.rowCount === 1) {
      req.session.characterId = req.body.characterId;
      res.status(200);
      res.send();
    } else {
      res.status(401);
      res.send();
    }
  });
}

GameHandlers.prototype.respondWithChunk = function(req, res) {
  if (state.chunks[req.params.coords] !== undefined) {
    res.json(state.chunks[req.params.coords]);
  } else {
    var chunk = worldGen.genChunk(req.params.coords, state.chunkSize);
    state.chunks[req.params.coords] = chunk;
    res.json(chunk);
  }
}

GameHandlers.prototype.respondWithChunkSize = function(req, res) {
  res.json(state.chunkSize);
}

GameHandlers.prototype.respondWithCharacter = function(req, res) {
  var characterId = req.session.characterId;
  if (state[characterId] === undefined) {
    var queryResult = database.getCharacter(characterId);
    queryResult.on('row', function(row) {
      if (row.x_coord !== undefined && row.y_coord !== undefined) {
        state.characters[characterId] = {x_coord: row.x_coord, y_coord: row.y_coord};
        res.json({'x_coord': row.x_coord, 'y_coord': row.y_coord});
      } else {
        res.send();
      }
    });
  } else {
    res.json(state[characterId]);
  }
}

GameHandlers.prototype.respondWithMove = function(req, res) {
  var characterId = req.session.characterId;
  var terrain_code = getPixel(req.body.x, req.body.y);
  if (terrain_code > 0) { //means its not water
    state.characters[characterId].x_coord = parseInt(req.body.x);
    state.characters[characterId].y_coord = parseInt(req.body.y);
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

GameHandlers.prototype.command = function(req, res) {
  var characterId = req.session.characterId;

  switch (req.body.command) {
    case 'move':
      var terrain_code = getPixel(req.body.x, req.body.y);
      if (terrain_code > 0) { //means its not water
        state.characters[characterId].x_coord = parseInt(req.body.x);
        state.characters[characterId].y_coord = parseInt(req.body.y);
        res.send(true);
      } else {
        res.send(false);
      }
    default:
      res.status(400);
      res.send();
  }
}

exports.GameHandlers = GameHandlers;
