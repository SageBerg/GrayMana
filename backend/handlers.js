const session = require('express-session');

const Auth = require('./auth').Auth;
const DB = require('./db').DB;

const auth = new Auth();
const database = new DB();

var Handlers = function() {};

Handlers.prototype.authMiddleware = function(req, res, next) {
  if (auth.isAuth(req)) {
    next();
  } else {
    res.status(401);
    res.send();
  }
};

Handlers.prototype.login = function(req, res) {
  var email = req.body.email;
  var password = req.body.password;

  var queryResult = database.auth(email, password);
  queryResult.on('end', function(result) {
    if (result.rowCount === 1) {

      //disallow multiple sessions with same account
      if (req.session.userId) {
        res.status(401);
        res.send();
        return;
      }

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

Handlers.prototype.newAccount = function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  if (auth.validateEmail(email) === false) {
    //TODO log invalid email
  } else if (password.length < 8) {
    //TODO log password too short
  } else {
    var queryResult = database.createNewAccount(email, password);
    queryResult.on('end', function(result) {
      next(); //TODO log in with the new account
      //TODO alert client of failure
    });
  }
};

Handlers.prototype.newCharacter = function(req, res) {
  var queryResult = database.createNewCharacter(req.body.characterName, req.body.characterSchool, req.session.userId);
  //TODO refactor to send character id so the player can start playing immediately
  queryResult.on('end', function(result) {
    res.send();
  })
};

exports.Handlers = Handlers;
