const jwt = require('jsonwebtoken');

const SESSION_LENGTH = '600s'; //argument in seconds for jwt constructor

var Handlers = function(state) {
  this.state = state;
}

Handlers.prototype.loginHandler = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var queryResult = this.state.database.auth(username, password);
  queryResult.on('row', function(row) {
    if (row.count === '1') {
      var token = jwt.sign({'username': username}, process.env.TOKEN_SECRET,
        {expiresIn: SESSION_LENGTH});
      //PLAYERS[username] = {chunkCoords: "0 0", currentBlock: {row: 0, col: 0}};
      res.json({'token': token});
    } else {
      res.send();
    }
  });
}

Handlers.prototype.respondWithMap = function(req, res) {
  if (this.state.auth.isAuth(req.body.token)) {
    if (this.state.chunks[req.body.chunkCoords] !== undefined) {
      res.json(this.state.chunks[req.body.chunkCoords]);
    } else {
      var grid = this.state.worldGen.genMap(req.body.chunkCoords);
      this.state.chunks[req.body.chunkCoords] = grid;
      res.json(grid);
    }
  } //end isAuth
}

Handlers.prototype.respondWithMove = function(req, res) {
  if (this.state.auth.isAuth(req.body.token)) {
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
      {expiresIn: SESSION_LENGTH});
    res.json({'token': newToken});
  }
}

exports.Handlers = Handlers;
