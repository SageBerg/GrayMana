const jwt = require('jsonwebtoken');

const DB = require('./db').DB;
const Auth = require('./auth_server').Auth;

const database = new DB();
const auth = new Auth();

var Handlers = function() {
  this.sessionLength = '600s'; //argument in seconds for jwt constructor
}

Handlers.prototype.authMiddleware = function(req, res, next) {
  if (auth.isAuth(req.body.token)) {
    next();
  } else {
    res.status(401);
    res.send();
  }
};

Handlers.prototype.respondWithLogin = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var queryResult = database.auth(username, password);
  queryResult.on('row', function(row) {
    if (row.count === '1') {
      var token = jwt.sign({'username': username}, process.env.TOKEN_SECRET,
        {expiresIn: this.sessionLength});
      res.json({'token': token});
    } else {
      res.send();
    }
  });
}

Handlers.prototype.newAccount = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  if (auth.validateEmail(username) === false) {
    //log invalid email
  } else if (password.length < 8) {
    //log password too short
  } else {
    Promise.all([
      database.createNewAccount(username, password)
    ]).then(
      res.json({'token': jwt.sign({'username': username},
        process.env.TOKEN_SECRET, {expiresIn: this.sessionLength})})
    );
  }
}

Handlers.prototype.newCharacter = function(req, res) {
  var email = auth.getEmailFromToken(req.body.token);
  var queryResult = database.getUserIdQuery(email);
  queryResult.on('row', function(row) {
    database.createNewCharacter(req.body.characterName, req.body.characterSchool, row['id']);
    res.send();
  });
}

Handlers.prototype.respondWithNewToken = function(req, res) {
  var decodedToken = jwt.decode(req.body.token, {complete: true});
  var username = decodedToken.payload.username;
  var newToken = jwt.sign({'username': username}, process.env.TOKEN_SECRET,
    {expiresIn: this.sessionLength});
  res.json({'token': newToken});
}

exports.Handlers = Handlers;
