const postgres = require('pg');
var Promise = require('promise-polyfill');

var DB = function() {
  var conParam = 'postgres://' + process.env.PSQL_USER + ':' +
    process.env.PSQL_PASSWORD + '@localhost:5432/graymana';
  this.psqlClient = new postgres.Client(conParam);
  this.psqlClient.connect();
};

DB.prototype.updateCharacter = function(character, address) {
  this.psqlClient.query('UPDATE characters AS c SET x_coord = $1, y_coord = $2 WHERE c.account_name LIKE $3', [character.x_coord, character.y_coord, address]);
}

DB.prototype.getUserIdQuery = function(email) {
  return this.psqlClient.query('SELECT id FROM users WHERE email LIKE $1', [email]);
}

DB.prototype.createNewCharacter = function(name, school, userId) {
  this.psqlClient.query('INSERT INTO characters (name, school, user_id, world_id, x_coord, y_coord) VALUES ($1, $2, $3, 1, 0, 0)', [name, school, userId]);
};

DB.prototype.getCharacter = function(email) {
  return this.psqlClient.query('select x_coord, y_coord from users as u join characters as c on u.id = c.user_id where email like $1', [email]);
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

DB.prototype.auth = function(username, password) {
  return this.psqlClient.query(
    'SELECT count(*) FROM users WHERE email = $1 AND password = $2',
    [username, password]
  );
};

DB.prototype.createNewAccount = function(username, password) {
  this.psqlClient.query(
    'INSERT INTO users (email, password) VALUES ($1, $2)', [username, password]
  );
};

exports.DB = DB;
