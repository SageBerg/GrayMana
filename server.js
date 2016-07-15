const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const postgres = require('pg');
const jwt = require('jsonwebtoken');

const worldGen = require('./world_gen.js');
const port = process.env.PORT || 3002;

var conString = "postgres://sage:" + process.env.PSQLPASSWORD +
  "@localhost:5432/sage";
var psqlClient = new postgres.Client(conString);
psqlClient.connect();

const app = express();
const server = http.createServer(app);
server.listen(port);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

app.post('/login', login);
app.post('/map.json', respondWithMap);
app.post('/influenced_map.json', respondWithInfluencedMap);
app.post('/refresh_token', respondWithNewToken);

function login(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  //TODO only allow unique user names (emails)
  var queryResult = psqlClient.query(
    'SELECT count(*) FROM users WHERE email = $1 AND password = $2',
    [username, password]);
  queryResult.on('row', function(row) {
    if (row.count === '1') {
      //token expires in 10 seconds
      var token = jwt.sign({"username": username}, process.env.TOKEN_SECRET, {expiresIn: '10s'});
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

    var grid = worldGen.genMap([])
    var psqlGrid = parseJavaScriptMapToPostgresMap(grid);
    var email = getEmailFromToken(req.body.token);

    var queryResult = psqlClient.query('SELECT world_id FROM users WHERE email = $1', [email]);
    queryResult.on('row', function(row) {
      psqlClient.query(
        'UPDATE worlds SET grid = $1 WHERE id = $2', [psqlGrid, row.world_id]);
    });

    res.json(grid);
  }
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

function respondWithInfluencedMap(req, res) {
  if (isAuth(req.body.token)) {
    res.json(worldGen.genMap(req.body["presetPotentialTiles[]"]));
  }
}

function isAuth(token) {
  if (jwt.verify(token, process.env.TOKEN_SECRET)) {
    return true;
  }
  return false;
}

function respondWithNewToken(req, res) {
  if (isAuth(req.body.token)) {
    var username = getEmailFromToken(req.body.token);
    var newToken = jwt.sign({"username": username}, process.env.TOKEN_SECRET, {expiresIn: '10s'});
    res.json({"token": newToken});
  }
}

function getEmailFromToken(token) {
  var decodedToken = jwt.decode(token, {complete: true});
  return decodedToken.payload.username;
}
