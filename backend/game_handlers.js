const Auth = require('./auth').Auth;
const DB = require('./db').DB;
const TreasureGen = require('./treasure').TreasureGen;
const WorldGen = require('./world_gen').WorldGen;

var state = require('./state').state;

const auth = new Auth();
const database = new DB();
const treasureGen = new TreasureGen();

var worldGen = null;
Promise.all(
  [database.loadAllChunksFromDB(state.chunks)]
).then(
  [worldGen = new WorldGen(state.chunkSize, state.chunks, database)]
);

var syncState = function() {
  for (characterId in state.characters) {
    if (state.characters.hasOwnProperty(characterId)) {
      database.moveCharacter(state.characters[characterId], characterId);
    };
  };
  console.log(state.characters);
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

GameHandlers.prototype.logout = function(req, res) {
  delete state.characters[req.session.characterId];
  req.session.destroy(function(err) {
    if (err) {
      res.status(500);
      res.send();
    } else {
      res.send();
    }
  });
};

GameHandlers.prototype.chests = function (req, res) {
  res.send(worldGen.spawnChests());
};

GameHandlers.prototype.startGame = function(req, res) {
  var queryResult = database.allowedToPlayAsCharacter(req.body.characterId,
    req.session.userId);

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

GameHandlers.prototype.chunk = function(req, res) {
  if (state.chunks[req.params.coords] !== undefined) {
    res.json(state.chunks[req.params.coords]);
  } else {
    var chunk = worldGen.genChunk(req.params.coords, state.chunkSize);
    state.chunks[req.params.coords] = chunk;
    res.json(chunk);
  }
}

GameHandlers.prototype.chunkSize = function(req, res) {
  res.json(state.chunkSize);
}

GameHandlers.prototype.character = function(req, res) {
  var characterId = req.session.characterId;
  if (state[characterId] === undefined) {
    var queryResult = database.getCharacter(characterId);
    queryResult.on('row', function(row) {
      if (row.x_coord !== undefined && row.y_coord !== undefined) {

        state.characters[characterId] = {x_coord: row.x_coord, y_coord:
          row.y_coord};

        res.json({'x_coord': row.x_coord, 'y_coord': row.y_coord});
      } else {
        res.send();
      }
    });
  } else {
    res.json(state[characterId]);
  }
}

GameHandlers.prototype.treasure = function(req, res) {
  var manaDrop = treasureGen.manaDrop();
  var runeDrop = treasureGen.runeDrop();
  var drop = {'manaDrop': manaDrop, 'runeDrop': runeDrop};
  res.json({treasureDrop: drop});
}

GameHandlers.prototype.command = function(req, res) {
  var characterId = req.session.characterId;

  switch (req.body.command) {
    case 'move':
      var new_x = state.characters[characterId].x_coord + parseInt(req.body.x);
      var new_y = state.characters[characterId].y_coord + parseInt(req.body.y);
      var terrain_code = getPixel(new_x, new_y);
      if (terrain_code > 0) { //means its not water
        state.characters[characterId].x_coord = new_x;
        state.characters[characterId].y_coord = new_y;
        res.json({character: state.characters[characterId]});
      } else {
        res.json({error: "Cannot walk on water or fly"});
      }
    default:
      res.status(400);
      res.send();
  }
}

exports.GameHandlers = GameHandlers;
