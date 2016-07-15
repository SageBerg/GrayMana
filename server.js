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

  printWorldName(username);

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

function printWorldName(email) {
  var queryResult = psqlClient.query('SELECT world_id FROM users WHERE email = $1', [email]);
  queryResult.on('row', function(row) {
    console.log(row);
    var queryResult2 = psqlClient.query('SELECT name FROM worlds WHERE id = $1', [row.world_id]);
    queryResult2.on('row', function(row2) {
      console.log(row2);
    });
  });
}

function respondWithMap(req, res) {
  if (isAuth(req.body.token)) {
    res.json(worldGen.genMap([]));
  }
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
    var decodedToken = jwt.decode(req.body.token, {complete: true});
    var username = decodedToken.payload.username;
    var newToken = jwt.sign({"username": username}, process.env.TOKEN_SECRET, {expiresIn: '10s'});
    res.json({"token": newToken});
  }
}
