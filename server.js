const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const postgres = require('pg');
const jwt = require('jsonwebtoken');

//const worldGen = require('./world_gen.js');

const PORT = process.env.PORT || 3002;
const SESSION_LENGTH = '600s'; //argument in seconds for jwt constructor

//Maintain the game state in memory for speed
var CHUNK = null;
const CHUNK_SIZE = 40;
var CHUNKS = {}; //the server's representation of the map
var PLAYERS = {}; //maps accounts to character objects
var TIME = {};

//set up the database connection
var conParam = "postgres://sage:" + process.env.PSQLPASSWORD +
  "@localhost:5432/sage";
var psqlClient = new postgres.Client(conParam);
psqlClient.connect();

//start the server
const app = express();
const server = http.createServer(app);
server.listen(PORT);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

//set up routes
app.post('/login', loginHandler);
app.post('/map.json', respondWithMap);
app.post('/refresh_token', respondWithNewToken);

//define handlers
function loginHandler(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  //TODO only allow unique user names (emails)
  var queryResult = psqlClient.query(
    'SELECT count(*) FROM users WHERE email = $1 AND password = $2',
    [username, password]);
  queryResult.on('row', function(row) {
    if (row.count === '1') {
      var token = jwt.sign({"username": username}, process.env.TOKEN_SECRET,
        {expiresIn: SESSION_LENGTH});
      psqlClient.query(
        'UPDATE users SET token = $1 WHERE email = $2 AND password = $3',
        [token, username, password]);
      res.json({"token": token});
    } else {
      res.send();
    }
  });
}

function respondWithMap(req, res) {
  if (isAuth(req.body.token)) {

    if (CHUNKS[req.body.chunkCoords] !== undefined) {
      res.json(CHUNKS[req.body.chunkCoords]);
    } else {
      console.log(req.body.chunkCoords, "saving into Postgres");
      var grid = genMap(req.body.chunkCoords);
      CHUNKS[req.body.chunkCoords] = grid;
      res.json(grid);
    }

  } //end isAuth
}

function respondWithNewToken(req, res) {
  if (isAuth(req.body.token)) {
    var decodedToken = jwt.decode(req.body.token, {complete: true});
    var username = decodedToken.payload.username;
    var newToken = jwt.sign({"username": username}, process.env.TOKEN_SECRET,
      {expiresIn: SESSION_LENGTH});
    res.json({"token": newToken});
  }
}

//define functions
function isAuth(token) {
  if (jwt.verify(token, process.env.TOKEN_SECRET)) {
    return true;
  }
  return false;
}

function getEmailFromToken(token) {
  var decodedToken = jwt.decode(token, {complete: true});
  return decodedToken.payload.username;
}

function parseJavaScriptMapToPostgresMap(grid) {
  var postgresGrid = "\{";
  for (var i = 0; i < grid.length; i++) {
    postgresGrid += "{";
    for (var j = 0; j < grid.length; j++) {
      postgresGrid += "\"" + grid[i][j] + "\",";
    }
    postgresGrid = postgresGrid.slice(0,-1); //remove extra comma
    postgresGrid += "},";
  }
  postgresGrid = postgresGrid.slice(0,-1); //remove that last comma
  postgresGrid += "}";
  return postgresGrid;
}

function saveChunkToDB(chunkCoords, grid) {
  var psqlGrid = parseJavaScriptMapToPostgresMap(grid);
  psqlClient.query('INSERT INTO maps (grid, world_id, coords) VALUES ' +
    '($1, 1, $2)', [psqlGrid, chunkCoords]);
}

function loadAllChunksFromDB() {
  var psqlResponse = psqlClient.query('SELECT grid, coords FROM maps');
  psqlResponse.on('row', function(row) {
    CHUNKS[row["coords"]] = row["grid"];
    console.log('loaded chunk', row.coords);
  });
}

loadAllChunksFromDB();



//define world generation functions
function genMap(chunkCoords) {
  var presetPotentialTiles = getPresetPotentialTiles(chunkCoords);
  console.log(presetPotentialTiles.length, 'presetPotentialTiles');
  var gridSize = 40;
  var grid = build_grid(gridSize);

  var filled = new Set();
  var potentialTerrains = {"water": new Set(), "grass": new Set(),
    "sand": new Set()};
  try {
    loadPresetPotentialTiles(presetPotentialTiles, potentialTerrains);
  } catch (e) {
    console.log(e);
  }
  for (var key in potentialTerrains) {
    if (potentialTerrains.hasOwnProperty(key)) {
       setSpawns(potentialTerrains[key], gridSize);
    }
  }
  populateMap(potentialTerrains, filled, grid);
  saveChunkToDB(chunkCoords, grid);
  return grid;
}

function build_grid(gridSize) {
  grid = [];
  for (var i = 0; i < gridSize; i++) {
    grid.push([]);
    for (var j = 0; j < gridSize; j++) {
      grid[i].push(null);
    }
  }
  return grid;
}

function loadPresetPotentialTiles(presetPotentialTiles, potentialTerrains) {
  for (var i = 0; i < presetPotentialTiles.length; i++) {
    var parsedPresetPotentialTiles = presetPotentialTiles[i].split(" ");
    var row = parsedPresetPotentialTiles[0];
    var col = parsedPresetPotentialTiles[1];
    var terrain = parsedPresetPotentialTiles[2];
    potentialTerrains[terrain].add(row + " " + col);
  }
}

//TODO replace this hardcoding with user-supplied parameters
function setSpawns(potentialTiles, gridSize) {
  var spawnCount = randInt(10) + 1;
  for (var i = 0; i < spawnCount; i++) {
    var spawn = randInt(gridSize - 1).toString() + " " +
      randInt(gridSize - 1).toString();
    potentialTiles.add(spawn);
  }
}

function populateMap(potentials, filled, grid) {
  var terrainNamesToCodes = {'water': 0, 'grass': 1, 'sand': 2};
  while (potentialsRemaining(potentials)) {
    for (var key in potentials) {
      if (potentials.hasOwnProperty(key)) {
        if (potentials[key].size > 0) {
          addTile(potentials[key], filled, grid, terrainNamesToCodes[key]);
        }
      } //end if
    } //end for
  } //end while
}

function potentialsRemaining(potentials) {
  for (var key in potentials) {
    if (potentials.hasOwnProperty(key)) {
      if (potentials[key].size > 0) {
        return true;
      }
    }
  }
  return false;
}

function randInt(upperBound) {
  return Math.floor(Math.random() * upperBound);
}

function addTile(potentialTiles, filled, grid, terrain_id_number) {
  var tileCoords = chooseTileCoords(potentialTiles);
  potentialTiles.delete(tileCoords);
  grid = addTileNumberToGrid(grid, terrain_id_number, tileCoords);
  filled.add(tileCoords);
  addPotentials(grid.length, filled, tileCoords, potentialTiles);
}

function chooseTileCoords(potentialTiles) {
  size = potentialTiles.size;
  index = randInt(size);
  var i = 0;
  for (tileCoords of potentialTiles) {
    if (i === index) {
      return tileCoords
    }
    i++
  }
}

function addTileNumberToGrid(grid, tileNumber, tileCoords) {
  grid[getRow(tileCoords)][getCol(tileCoords)] = tileNumber;
  return grid;
}

function getRow(coords) {
  return parseInt(coords.split(" ")[0])
}

function getCol(coords) {
  return parseInt(coords.split(" ")[1])
}

function addPotentials(gridSize, filled, tileCoords, potentialTiles) {
  var row = getRow(tileCoords);
  var col = getCol(tileCoords);

  var moves = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  for (move of moves) {
    var modCoords = coordInc(row, col, move[0], move[1])
    addPotential(modCoords, filled, gridSize, potentialTiles);
  }
}

function coordInc(row, col, rowMod, colMod) {
  return (row + rowMod).toString() + " " + (col + colMod).toString();
}

function addPotential(modCoords, filled, gridSize, potentialTiles) {
  if (!filled.has(modCoords) && getRow(modCoords) >= 0 &&
    getRow(modCoords) < gridSize &&
    getCol(modCoords) >= 0 &&
    getCol(modCoords) < gridSize) {
    potentialTiles.add(modCoords);
  }
}

function getPresetPotentialTiles(chunkCoords) {
  var presetPotentialTiles = [];

  var x = parseInt(chunkCoords.split(" ")[0]);
  var y = parseInt(chunkCoords.split(" ")[1]);

  var upInfluencerChunk = x + " " + (y - 1);
  var downInfluencerChunk = x + " " + (y + 1);
  var rightInfluencerChunk = (x + 1) + " " + y;
  var leftInfluencerChunk = (x - 1) + " " + y;

  upPresetPotentialTiles(upInfluencerChunk, presetPotentialTiles);
  downPresetPotentialTiles(downInfluencerChunk, presetPotentialTiles);
  rightPresetPotentialTiles(rightInfluencerChunk, presetPotentialTiles);
  leftPresetPotentialTiles(leftInfluencerChunk, presetPotentialTiles);

  return presetPotentialTiles;
}

function upPresetPotentialTiles (upInfluencerChunk, presetPotentialTiles) {
  if (CHUNKS[upInfluencerChunk] !== undefined) {
    var relevantRow = CHUNKS[upInfluencerChunk][CHUNK_SIZE - 1];
    addPresetPotentialTiles(relevantRow, presetPotentialTiles, "\"0 \" + i");
  }
}

function downPresetPotentialTiles (downInfluencerChunk, presetPotentialTiles) {
  if (CHUNKS[downInfluencerChunk] !== undefined) {
    var relevantRow = CHUNKS[downInfluencerChunk][0];
    addPresetPotentialTiles(relevantRow, presetPotentialTiles,
      "(CHUNK_SIZE - 1).toString() + \" \" + i");
  }
}

function rightPresetPotentialTiles (rightInfluencerChunk,
  presetPotentialTiles) {
  if (CHUNKS[rightInfluencerChunk] !== undefined) {
    var relevantCol = [];
    for (var i = 0; i < CHUNK_SIZE; i++) {
      try {
        relevantCol.push(CHUNKS[rightInfluencerChunk][i][0]);
      } catch(exception) {
        console.log(exception);
      }
    }
    addPresetPotentialTiles(relevantCol, presetPotentialTiles,
      "i + \" \" + (CHUNK_SIZE - 1).toString()");
  }
}

function leftPresetPotentialTiles (leftInfluencerChunk, presetPotentialTiles) {
  console.log(leftInfluencerChunk, CHUNKS);
  if (CHUNKS[leftInfluencerChunk] !== undefined) {
    console.log("leftInfluencerChunk is defined");
    var relevantCol = [];
    for (var i = 0; i < CHUNK_SIZE; i++) {
      try {
        relevantCol.push(CHUNKS[leftInfluencerChunk][i][CHUNK_SIZE - 1]);
      } catch(exception) {
        console.log(exception);
      }
    }
    addPresetPotentialTiles(relevantCol, presetPotentialTiles, "i + \" 0\"");
  }
}

function addPresetPotentialTiles(tileArray, presetPotentialTiles, evalString) {
  for (var i = 0; i < tileArray.length; i++) {
    switch (tileArray[i]) {
      case 0:
        presetPotentialTiles.push(eval(evalString) + " water");
        break;
      case 1:
        presetPotentialTiles.push(eval(evalString) + " grass");
        break;
      case 2:
        presetPotentialTiles.push(eval(evalString) + " sand");
        break;
      default:
        console.log("error: invalid tilecode " + tileArray[i] + "found");
    } //end switch
  } //end for
}
