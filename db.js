const postgres = require('pg');

var DB = function() {
  //set up the database connection
  var conParam = 'postgres://sage:' + process.env.PSQLPASSWORD +
    '@localhost:5432/sage';
  this.psqlClient = new postgres.Client(conParam);
  this.psqlClient.connect();
};

DB.prototype.parseJavaScriptMapToPostgresMap = function(grid) {
  var postgresGrid = '\{';
  for (var i = 0; i < grid.length; i++) {
    postgresGrid += '{';
    for (var j = 0; j < grid.length; j++) {
      postgresGrid += '\"' + grid[i][j] + '\",';
    }
    postgresGrid = postgresGrid.slice(0,-1); //remove extra comma
    postgresGrid += '},';
  }
  postgresGrid = postgresGrid.slice(0,-1); //remove that last comma
  postgresGrid += '}';
  return postgresGrid;
}

DB.prototype.saveChunkToDB = function(chunkCoords, grid) {
  var psqlGrid = this.parseJavaScriptMapToPostgresMap(grid);
  this.psqlClient.query('INSERT INTO maps (grid, world_id, coords) VALUES ' +
    '($1, 1, $2)', [psqlGrid, chunkCoords]);
}

DB.prototype.loadAllChunksFromDB = function(chunks) {
  var psqlResponse = this.psqlClient.query('SELECT grid, coords FROM maps');
  psqlResponse.on('row', function(row) {
    chunks[row['coords']] = row['grid'];
  });
}

DB.prototype.auth = function(username, password) {
  return this.psqlClient.query(
    'SELECT count(*) FROM users WHERE email = $1 AND password = $2',
    [username, password]);
}

exports.DB = DB;
