var assert = require('chai').assert;

var TreasureGen = require('../frontend/treasure').TreasureGen;
var treasureGen = new TreasureGen();

describe('randInt', function() {
  it('should always return 0 if passed 1', function() {
    for (var i = 0; i < 10; i++) {
      var roll = treasureGen.randInt(1);
      if (roll !== 0) {
        assert.fail();
      }
    }
    assert.equal(true, true)
  });
});

describe('randInt', function() {
  it('should always return values within the specified range', function() {
    for (var i = 0; i < 10; i++) {
      var roll = treasureGen.randInt(10);
      if (roll < 0 || roll > 9) {
        assert.fail();
      }
    }
    assert.equal(true, true)
  });
});

describe('randInt', function() {
  it('should always return rounded values', function() {
    for (var i = 0; i < 10; i++) {
      var roll = treasureGen.randInt(10);
      if (roll.toString().length > 1) {
        assert.fail();
      }
    }
    assert.equal(true, true)
  });
});
