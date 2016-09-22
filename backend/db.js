const postgres = require('pg');

var DB = function() {
  var conParam = 'postgres://' + process.env.PSQL_USER + ':' +
    process.env.PSQL_PASSWORD + '@localhost:5432/graymana';
  this.psqlClient = new postgres.Client(conParam);
  this.psqlClient.connect();
};

DB.prototype.allowedToPlayAsCharacter = function(characterId, userId) {
  return this.psqlClient.query('SELECT id FROM characters WHERE id = $1 AND user_id = $2', [characterId, userId]);
};

DB.prototype.moveCharacter = function(character, characterId) {
  this.psqlClient.query('UPDATE characters SET x_coord = $1, y_coord = $2 WHERE id = $3', [character.x_coord, character.y_coord, characterId]);
};

DB.prototype.getUserIdQuery = function(email) {
  return this.psqlClient.query('SELECT id FROM users WHERE email LIKE $1', [email]);
};

DB.prototype.createNewCharacter = function(name, school, userId) {
  return this.psqlClient.query('INSERT INTO characters (name, school, user_id, world_id, x_coord, y_coord) VALUES ($1, $2, $3, 1, 0, 0)', [name, school, userId]);
};

DB.prototype.getCharacter = function(characterId) {
  return this.psqlClient.query('SELECT x_coord, y_coord FROM characters WHERE id = $1', [characterId]);
};

DB.prototype.saveChunkToDB = function(chunkCoords, chunk) {
  var psqlChunk = this.parseJavaScriptChunkToPostgresChunk(chunk);
  this.psqlClient.query('INSERT INTO chunks (chunk, world_id, coords) VALUES ' +
    '($1, 1, $2)', [psqlChunk, chunkCoords]
  );
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
};

DB.prototype.loadAllChunksFromDB = function(chunks) {
  var psqlResponse = this.psqlClient.query('SELECT chunk, coords FROM chunks');
  psqlResponse.on('row', function(row) {
    chunks[row['coords']] = row['chunk'];
  });
};

DB.prototype.auth = function(email, password) {
  return this.psqlClient.query(
    'SELECT id FROM users WHERE email = $1 AND password = $2',
    [email, password]
  );
};

DB.prototype.createNewAccount = function(email, password) {
  return this.psqlClient.query(
    'INSERT INTO users (email, password) VALUES ($1, $2)', [email, password]
  );
};

DB.prototype.getCharacters = function(userId) {
  return this.psqlClient.query(
    'SELECT name, id FROM characters WHERE user_id = $1 ORDER BY id', [userId]
  );
};

exports.DB = DB;
