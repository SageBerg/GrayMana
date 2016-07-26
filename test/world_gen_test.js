var assert = require('chai').assert;

var WorldGen = require('../backend/world_gen').WorldGen;
var worldGen = new WorldGen();

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

describe('chooseTileCoords', function() {
  it('should return \'1 1\'', function() {
    var potentialTiles = new Set();
    potentialTiles.add("1 1");
    assert.equal(worldGen.chooseTileCoords(potentialTiles), "1 1");
  });
});
