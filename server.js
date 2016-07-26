const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

var Authentication = require('./auth_server.js').Auth;
var WorldGen = require('./world_gen').WorldGen;
var DB = require('./db').DB;

var AUTH = new Authentication();
var DATABASE = new DB();

const PORT = process.env.PORT || 3002;
const SESSION_LENGTH = '600s'; //argument in seconds for jwt constructor

//Maintain the game state in memory for speed
const CHUNK_SIZE = 40;
var CHUNKS = {}; //the server's representation of the map
var PLAYERS = {}; //maps accounts to character objects
var TIME = {};

//start the server
const app = express();
const server = http.createServer(app);
server.listen(PORT);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

//set up routes
app.post('/login', loginHandler);
app.post('/map.json', respondWithMap);
app.post('/move', respondWithMove);
app.post('/refresh_token', respondWithNewToken);

//define handlers
function loginHandler(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var queryResult = DATABASE.auth(username, password);
  queryResult.on('row', function(row) {
    if (row.count === '1') {
      var token = jwt.sign({'username': username}, process.env.TOKEN_SECRET,
        {expiresIn: SESSION_LENGTH});
      PLAYERS[username] = {chunkCoords: "0 0", currentBlock: {row: 0, col: 0}};
      res.json({'token': token});
    } else {
      res.send();
    }
  });
}

function respondWithMap(req, res) {
  if (AUTH.isAuth(req.body.token)) {
    if (CHUNKS[req.body.chunkCoords] !== undefined) {
      res.json(CHUNKS[req.body.chunkCoords]);
    } else {
      var grid = WORLD_GEN.genMap(req.body.chunkCoords);
      CHUNKS[req.body.chunkCoords] = grid;
      res.json(grid);
    }
  } //end isAuth
}

function respondWithMove(req, res) {
  if (AUTH.isAuth(req.body.token)) {
    var player = AUTH.getEmailFromToken(req.body.token);
    var requestedChunkCoords = req.body.chunkCoords;
    var requestedRow = req.body.row;
    var requestedCol = req.body.col;
    if (true) { //CHUNKS[requestedChunkCoords][requestedRow][requestedCol] !== 0) {
      //PLAYERS[player].chunkCoords = requestedChunkCoords;
      //PLAYERS[player].currentBlock.row = requestedRow;
      //PLAYERS[player].currentBlock.col = requestedCol;
      res.send(true);
    } else {
      res.send(false);
    }
  } //end isAuth
}

function respondWithNewToken(req, res) {
  if (AUTH.isAuth(req.body.token)) {
    var decodedToken = jwt.decode(req.body.token, {complete: true});
    var username = decodedToken.payload.username;
    var newToken = jwt.sign({'username': username}, process.env.TOKEN_SECRET,
      {expiresIn: SESSION_LENGTH});
    res.json({'token': newToken});
  }
}

Promise.all([DATABASE.loadAllChunksFromDB(CHUNKS)]).then(defineWorldGen());

function defineWorldGen() {
  WORLD_GEN = new WorldGen(CHUNK_SIZE, CHUNK_SIZE, DATABASE);
}
