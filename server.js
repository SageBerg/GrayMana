const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const worldGen = require('./world_gen.js');

const postgres = require('pg');
const jwt = require('jsonwebtoken');

var conString = "postgres://sage:" + process.env.PSQLPASSWORD +
  "@localhost:5432/sage";

var psqlClient = new postgres.Client(conString);
psqlClient.connect();

const app = express();
const server = http.createServer(app);
server.listen(3002);

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended: false}));

app.post('/login', login);
app.post('/map_auth.json', respondWithMapIfAuth);

app.get('/map.json', respondWithMap);
app.post('/influenced_map.json', respondWithInfluencedMap);

function respondWithMap(req, res) {
  res.json(worldGen.genMap([]));
}

function respondWithMapIfAuth(req, res) {
  console.log("got into respond with map");
  if (isAuth(req.body.token)) {
    res.json(worldGen.genMap([]));
  }
}

function respondWithInfluencedMap(req, res) {
  res.json(worldGen.genMap(req.body));
}

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
      var token = jwt.sign({}, "secret", {expiresIn: '10s'});
      psqlClient.query(
        'UPDATE users SET token = $1 WHERE email = $2 AND password = $3',
        [token, username, password]);
      res.json({"token": token});
    } else {
      res.send();
    }
  });
}

function isAuth(token) {
  console.log("got into isAuth");
  if (jwt.verify(token, "secret")) {
    console.log("authenticated!");
    return true;
  }
  return false;
}
