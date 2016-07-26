var assert = require('chai').assert;
var postgres = require('pg');

var DB = require('../backend/db').DB;
var db = new DB();

describe('DB.parseJavaScriptMapToPostgresMap', function() {
  it('should return a correctly formatted string', function() {
    var grid = [ [1, 2], [3, 4] ];
    var expected = '{{"1","2"},{"3","4"}}';
    assert.equal(expected, db.parseJavaScriptMapToPostgresMap(grid));
  });
});
