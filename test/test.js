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

describe('chooseTileCoords', function() {
  it('should return \'1 1\'', function() {
    var potentialTiles = new Set();
    potentialTiles.add("1 1");
    assert.equal(worldGen.chooseTileCoords(potentialTiles), "1 1");
  });
});

describe('worldGen.genMap', function() {
  it('should ', function() {
    assert.equal();
  });
});

/* copy/paste unit test skeleton
describe('', function() {
  it('should ', function() {
    assert.equal();
  });
});
*/

//put back in once I can figure out how to load node.js client code without $ being undefined in Mocha
/*
describe('genMapHTML', function() {
  it('should return \'<div class=\'grass\'></div>\'', function() {
    assert.equal(genMapHTML([[0]]), '<div class=\'water\'></div>');
  });
});

describe('genMapHTML', function() {
  it('should return \'<div class=\'water\'></div>\'', function() {
    assert.equal(genMapHTML([[1]]), '<div class=\'grass\'></div>');
  });
});
*/
