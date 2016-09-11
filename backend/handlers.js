const session = require('express-session');

const DB = require('./db').DB;
const Auth = require('./auth_server').Auth;

const database = new DB();
const auth = new Auth();

var Handlers = function() {};

Handlers.prototype.authMiddleware = function(req, res, next) {
  if (auth.isAuth(req)) {
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
  queryResult.on('end', function(result) {
    if (result.rowCount === 1) {
      req.session.regenerate(function(err) {
        if (err) {
          res.status(500);
          res.send();
        }
        req.session.userId = result.rows[0].id
        res.send();
      });
    } else {
      res.status(401);
      res.send();
    }
  });
};

Handlers.prototype.getCharacters = function(req, res) {
  var queryResult = database.getCharacters(req.session.userId);
  var characters = [];
  queryResult.on('end', function(result) {
    for (row of result.rows) {
      characters.push({name: row.name, id: row.id});
    }
    res.json(characters);
  });
};

Handlers.prototype.newAccount = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  if (auth.validateEmail(username) === false) {
    //log invalid email
  } else if (password.length < 8) {
    //log password too short
  } else {
    var queryResult = database.createNewAccount(username, password);
    queryResult.on('end', function(result) {
      res.send();
      //TODO alert client of failure
    });
  }
};

Handlers.prototype.newCharacter = function(req, res) {
  var queryResult = database.createNewCharacter(req.body.characterName, req.body.characterSchool, req.session.userId);
  queryResult.on('end', function(result) {
    res.send();
  })
}

exports.Handlers = Handlers;
