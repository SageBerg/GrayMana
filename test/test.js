var assert = require('chai').assert;
var worldGen = require('../world_gen');

describe('addTileNumberToGrid', function() {
  it('should add a 1 to the middle of the grid', function() {
    assert.equal(worldGen.addTileNumberToGrid([[0,0,0], [0,0,0], [0,0,0]],
      1, "1 1")[1][1], 1);
  });
});

describe('getRow("1 0")', function() {
  it('should return 1', function() {
    assert.equal(worldGen.getRow("1 0"), "1");
  });
});
