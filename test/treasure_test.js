var assert = require('chai').assert;

var TreasureGen = require('../backend/treasure').TreasureGen;
var treasureGen = new TreasureGen();

describe('randInt', function() {
  it('should always return 0 if passed 1', function() {
    for (var i = 0; i < 10; i++) {
      var roll = treasureGen.randInt(1);
      if (roll !== 0) {
        assert.fail();
      }
    }
    assert.equal(true, true);
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
    assert.equal(true, true);
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
    assert.equal(true, true);
  });
});

describe('treasureGen.runeDrop()', function() {
  it('should return an array', function() {
    var runes = treasureGen.runeDrop();
    assert.isArray(runes);
  });
});

describe('treasureGen.runeDrop()', function() {
  it('should return an object of length <= treasureGen.maxRunes', function() {
    var runes = treasureGen.runeDrop();
    assert.equal(true, runes.length <= treasureGen.maxRunes);
  });
});

describe('treasureGen.runeDrop()', function() {
  it('should return number of runes in the expected statistical distribution',
    function() {

    var numberOfRuneDrops = 1000;
    var tolerableDeviaton = 0.3;

    var expectedProbabilities = {0: 0.25};
    expectedProbabilities[treasureGen.maxRunes] =
      Math.pow(0.75, treasureGen.maxRunes);
    var sumOfProbabilities = 0.25;
    for (var i = 1; i <= treasureGen.maxRunes - 1; i++) {
      var expectedProbability = Math.pow(0.75, i) * 0.25;
      sumOfProbabilities += expectedProbability;
      expectedProbabilities[i] = expectedProbability;
    }

    var runeDropCounts = {};
    for (var i = 0; i <= treasureGen.maxRunes; i++) {
      runeDropCounts[i] = 0;
    }
    for (var i = 0; i < numberOfRuneDrops; i++) {
      var numberOfRunesInDrop = treasureGen.runeDrop().length;
      runeDropCounts[numberOfRunesInDrop] += 1;
    }

    for (var i = 0; i < treasureGen.maxRunes; i++) {
      var diviationFromExpected = Math.abs(
        (runeDropCounts[i] / numberOfRuneDrops) - expectedProbabilities[i])
      if (diviationFromExpected > tolerableDeviaton) {
        console.log(diviationFromExpected);
        assert.fail();
      }
    }
    assert.equal(true, true);
  });
});

describe('treasureGen.manaDrop()', function() {
  it('should return an object with the manaColor field', function() {
    assert.isDefined(treasureGen.manaDrop().manaColor);
  });
});

describe('treasureGen.manaDrop()', function() {
  it('should return an object with the manaAmount field', function() {
    assert.isDefined(treasureGen.manaDrop().manaAmount);
  });
});

describe('treasureGen.manaDrop()', function() {
  it('should return an object with a string in the manaColor bucket',
    function() {
    assert.isString(treasureGen.manaDrop().manaColor);
  });
});

describe('treasureGen.manaDrop()', function() {
  it('should return an object with a number in the manaAmount bucket',
    function() {
    assert.isNumber(treasureGen.manaDrop().manaAmount);
  });
});

describe('treasureGen.manaDrop()', function() {
  it('should return an object with more than 0 mana', function() {
    assert.equal(true, treasureGen.manaDrop().manaAmount > 0);
  });
});
