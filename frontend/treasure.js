'use strict';

var TreasureGen = function() {
  //it's a class to make testing easier
};

TreasureGen.prototype.randInt = function(upperBound) {
  return Math.floor(Math.random() * upperBound);
};

exports.TreasureGen = TreasureGen;
