var Authentication = require('./auth_server').Auth;
var WorldGen = require('./world_gen').WorldGen;
var DB = require('./db').DB;

var State = function() {
  this.auth = new Authentication();
  this.database = new DB();

  this.chunks = {};
  this.chunkSize = 40;

  this.players = {};
  this.time = {};

  this.worldGen = null;
  Promise.all([this.database.loadAllChunksFromDB(this.chunks)]).then(
    this.initWorldGen()
  );
}

State.prototype.initWorldGen = function() {
  this.worldGen = new WorldGen(this.chunkSize, this.chunks, this.database);
}

exports.State = State;
