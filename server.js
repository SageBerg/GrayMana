const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const postgres = require('pg');
const jwt = require('jsonwebtoken');

const worldGen = require('./world_gen.js');

const PORT = process.env.PORT || 3002;
const SESSION_LENGTH = '600s'; //argument in seconds for jwt constructor

//Maintain the game state in memory for speed
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
app.post('/login', login);
app.post('/map.json', respondWithMap);
app.post('/influenced_map.json', respondWithInfluencedMap);
app.post('/refresh_token', respondWithNewToken);

//define handlers
function login(req, res) {
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
      res.json(CHUNKS(req.body.chunkCoords));
    } else {
      var grid = worldGen.genMap([]);
      CHUNKS[req.body.chunkCoords] === grid;
      res.json(grid);
    }
  }
}

function respondWithInfluencedMap(req, res) {
  if (isAuth(req.body.token)) {
    res.json(worldGen.genMap(req.body["presetPotentialTiles[]"]));
  }
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

function gameLoop() {
  while (true) {
    //save the game state in Postgres
    //update the time
    //boot inactive players?
  }
}
