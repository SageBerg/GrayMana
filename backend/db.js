const postgres = require('pg');

var DB = function() {
  var conParam = 'postgres://' + process.env.PSQL_USER + ':' +
    process.env.PSQL_PASSWORD + '@localhost:5432/graymana';
  this.psqlClient = new postgres.Client(conParam);
  this.psqlClient.connect();
};

DB.prototype.parseJavaScriptChunkToPostgresChunk = function(chunk) {
  var postgresChunk = '\{';
  for (var i = 0; i < chunk.length; i++) {
    postgresChunk += '{';
    for (var j = 0; j < chunk.length; j++) {
      postgresChunk += '\"' + chunk[i][j] + '\",';
    }
    postgresChunk = postgresChunk.slice(0,-1); //remove extra comma
    postgresChunk += '},';
  }
  postgresChunk = postgresChunk.slice(0,-1); //remove that last comma
  postgresChunk += '}';
  return postgresChunk;
}

DB.prototype.getCharacter = function(email) {
  return this.psqlClient.query('SELECT apples FROM users WHERE email = $1', [email]);
}

DB.prototype.saveChunkToDB = function(chunkCoords, chunk) {
  var psqlChunk = this.parseJavaScriptChunkToPostgresChunk(chunk);
  this.psqlClient.query('INSERT INTO chunks (chunk, world_id, coords) VALUES ' +
    '($1, 1, $2)', [psqlChunk, chunkCoords]
  );
}

DB.prototype.loadAllChunksFromDB = function(chunks) {
  var psqlResponse = this.psqlClient.query('SELECT chunk, coords FROM chunks');
  psqlResponse.on('row', function(row) {
    chunks[row['coords']] = row['chunk'];
  });
}

DB.prototype.auth = function(username, password) {
  return this.psqlClient.query(
    'SELECT count(*) FROM users WHERE email = $1 AND password = $2',
    [username, password]
  );
}

DB.prototype.createNewAccount = function(username, password) {
  this.psqlClient.query(
    'INSERT INTO users (email, password) VALUES ($1, $2)', [username, password]
  );
}

exports.DB = DB;
