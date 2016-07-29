'use strict';

var TreasureGen = function() {
  this.maxRunes = 21;
  this.runeProbability = 0.75;
  this.runes = 'abcdefghijklmnopqrstuvwxyz ';
};

TreasureGen.prototype.randInt = function(upperBound) {
  return Math.floor(Math.random() * upperBound);
};

TreasureGen.prototype.runeDrop = function() {
  var runes = [];
  var runeCount = 0;
  while (Math.random() < this.runeProbability && runeCount < this.maxRunes) {
    runes.push(this.runes[this.randInt(this.runes.length)]);
    runeCount += 1;
  }
  return runes;
};

exports.TreasureGen = TreasureGen;
