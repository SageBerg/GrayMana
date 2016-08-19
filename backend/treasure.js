'use strict';

//using require for unit testing
try {
  var SPELL_LIST = require('./globals').SPELL_LIST;
} catch (exception) {
}

var SPELL_LIST = [
  'Clean',
  'Detox',
  'Dispel Magic',
  'Organize',
  'Resist Magic',
  'Levitate',
  'Gavity',
  'Pessure',
  'Bulid',
  'Burst',
  'Shield',
  'Sentinel',
  'Heat',
  'Heat Wall',
  'Heat Minion',
  'Weather',
  'Warm Egg',
  'Mana Chest',
  'Clone',
  'Summon Food',
  'Toughen',
  'Increase Mana Maximum',
  'Quickness',
  'Flight',
  'Teleport',
  'Portal',
  'Breathing',
  'Heal',
  'Sleep',
  'Stun',
  'Resurrect',
  'Regenerate',
  'Befriend',
  'Found Faction',
  'Induct to Faction',
  'Message',
  'Storage',
  'Quest',
  'Banner',
  'Market',
  'Detect Magic',
  'Light',
  'Map',
  'Profile Person',
  'Alert',
  'Scry',
  'Coordinates',
  'Advertise',
  'Invisibility',
  'Hide Magic'
];

var TreasureGen = function() {
  this.manaColors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo',
    'violet', 'gray'];
  this.manaSpread = 2047;
  this.maxRunes = 21;
  this.runeProbability = 0.75;
  this.runes = 'abcdefghijklmnopqrstuvwxyz ';
  this.allRuneLetters = this.initializeAllRuneLetters();
};

TreasureGen.prototype.randInt = function(upperBound) {
  return Math.floor(Math.random() * upperBound);
};

TreasureGen.prototype.initializeAllRuneLetters = function() {
  var allRuneLetters = '';
  for (var i = 0; i < SPELL_LIST.length; i++) {
    for (var j = 0; j < SPELL_LIST[i].length; j++) {
      allRuneLetters += SPELL_LIST[i][j].toLowerCase();
    }
  }
  return allRuneLetters;
};

TreasureGen.prototype.chooseRune = function() {
  return this.allRuneLetters[this.randInt(this.allRuneLetters.length)];
}

TreasureGen.prototype.runeDrop = function() {
  var runes = [];
  var runeCount = 0;
  while (Math.random() < this.runeProbability && runeCount < this.maxRunes) {
    runes.push(this.chooseRune());
    runeCount += 1;
  }
  return runes;
};

TreasureGen.prototype.manaDrop = function() {
  var manaBundle = {manaColor: null, manaAmount: 0};
  manaBundle.manaColor = this.manaColors[this.randInt(this.manaColors.length)];
  var manaAmount = 0;
  var manaRoll = this.randInt(this.manaSpread);
  if (manaRoll < 1024) {
    manaAmount += 10;
  } else if (manaRoll < 1024 + 512) {
    manaAmount += 20;
  } else if (manaRoll < 1024 + 512 + 256) {
    manaAmount += 40;
  } else if (manaRoll < 1024 + 512 + 256 + 128) {
    manaAmount += 80;
  } else if (manaRoll < 1024 + 512 + 256 + 128 + 64) {
    manaAmount += 160;
  } else if (manaRoll < 1024 + 512 + 256 + 128 + 64 + 32) {
    manaAmount += 320;
  } else if (manaRoll < 1024 + 512 + 256 + 128 + 64 + 32 + 16) {
    manaAmount += 640;
  } else if (manaRoll < 1024 + 512 + 256 + 128 + 64 + 32 + 16 + 8) {
    manaAmount += 1280;
  } else if (manaRoll < 1024 + 512 + 256 + 128 + 64 + 32 + 16 + 8 + 4) {
    manaAmount += 2560;
  } else if (manaRoll < 1024 + 512 + 256 + 128 + 64 + 32 + 16 + 8 + 4 + 2) {
    manaAmount += 5120;
  } else if (manaRoll < 1024 + 512 + 256 + 128 + 64 + 32 + 16 + 8 + 4 + 2 + 1) {
    manaAmount += 10280;
  }
  manaBundle.manaAmount = manaAmount;
  return manaBundle;
};

TreasureGen.prototype.wizmarkDrop = function() {
}

TreasureGen.prototype.clueDrop = function() {
}

try {
  exports.TreasureGen = TreasureGen;
} catch (exception) {
}
