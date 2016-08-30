const jwt = require('jsonwebtoken');
const TreasureGen = require('./treasure').TreasureGen;

var Handlers = function(state) {
  this.sessionLength = '600s'; //argument in seconds for jwt constructor
  this.state = state;
}

Handlers.prototype.respondWithLogin = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var queryResult = this.state.database.auth(username, password);
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
  if (this.state.auth.validateEmail(username) === false) {
    //log invalid email
  } else if (password.length < 8) {
    //log password too short
  } else {
    Promise.all([
      this.state.database.createNewAccount(username, password)
    ]).then(
      res.json({'token': jwt.sign({'username': username}, process.env.TOKEN_SECRET, {expiresIn: this.sessionLength})})
    );
  }
}

Handlers.prototype.newCharacter = function(req, res) {
  if (this.state.auth.isAuth(req.body.token)) {
    var email = this.state.auth.getEmailFromToken(req.body.token);
    var queryResult = this.state.database.getUserIdQuery(email);
    var ref = this.state.database; //this 'this' is out of scope in queryResult's callback
    queryResult.on('row', function(row) {
      ref.createNewCharacter(req.body.characterName, req.body.characterSchool, row['id']);
      res.send();
    });
  } //end isAuth
}

Handlers.prototype.respondWithChunk = function(req, res) {
  if (this.state.auth.isAuth(req.body.token)) {
    if (this.state.chunks[req.body.chunkCoords] !== undefined) {
      res.json(this.state.chunks[req.body.chunkCoords]);
    } else {
      var chunk = this.state.worldGen.genChunk(req.body.chunkCoords,
        this.state.chunkSize);
      this.state.chunks[req.body.chunkCoords] = chunk;
      res.json(chunk);
    }
  } //end isAuth
}

Handlers.prototype.respondWithChunkSize = function(req, res) {
  if (this.state.auth.isAuth(req.body.token)) {
    res.json(this.state.chunkSize);
  } //end isAuth
}

Handlers.prototype.respondWithCharacter = function(req, res) {
  if (this.state.auth.isAuth(req.body.token)) {
    var email = this.state.auth.getEmailFromToken(req.body.token);
    var queryResult = this.state.database.getCharacter(email);
    queryResult.on('row', function(row) {
      if (row.apples !== undefined) {
        res.json({'apple': row['apples']});
      } else {
        res.send();
      }
    });
  } //end isAuth
}

Handlers.prototype.respondWithMove = function(req, res) {
  if (this.state.auth.isAuth(req.body.token)) {

    //these variables will be used to edit the server's state
    var player = this.state.auth.getEmailFromToken(req.body.token);
    var requestedChunkCoords = req.body.chunkCoords;
    var requestedRow = req.body.row;
    var requestedCol = req.body.col;

    res.send(true);
  } //end isAuth
}

Handlers.prototype.respondWithNewToken = function(req, res) {
  if (this.state.auth.isAuth(req.body.token)) {
    var decodedToken = jwt.decode(req.body.token, {complete: true});
    var username = decodedToken.payload.username;
    var newToken = jwt.sign({'username': username}, process.env.TOKEN_SECRET,
      {expiresIn: this.sessionLength});
    res.json({'token': newToken});
  }
}

Handlers.prototype.respondWithTreasureDrop = function(req, res) {
  if (this.state.auth.isAuth(req.body.token)) {
    var treasureGen = new TreasureGen();
    var manaDrop = treasureGen.manaDrop();
    var runeDrop = treasureGen.runeDrop();
    var drop = {'manaDrop': manaDrop, 'runeDrop': runeDrop};
    res.json({treasureDrop: drop});
  }
}

exports.Handlers = Handlers;
