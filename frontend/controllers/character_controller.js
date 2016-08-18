app.controller('characterController', function($scope) {
  $scope.character = {
    damage: {red: 0, orange: 0, yellow: 0, green: 0, blue: 0, indigo: 0,
      violet: 0, gray: 0},
    life: 100,
    mana: {red: 0, orange: 0, yellow: 0, green: 0, blue: 0, indigo: 0,
      violet: 0, gray: 0},
    runes: {a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0,
      l: 0, m: 0, n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0,
      x: 0, y: 0, z: 0, ' ': 0},
    state: 'active', //things like 'casting', 'sleeping', 'manatating', 'dead'
    spellsKnown: {}
  };

  $scope.getTreasure = function() {
    $scope.getMana();
    $scope.getRunes();
  };

  $scope.getRunes = function() {
    var treasureGen = new TreasureGen();
    var runeDrop = treasureGen.runeDrop();
    for (var i = 0; i < runeDrop.length; i++) {
      $scope.character.runes[runeDrop[i]] += 1;
    }
  }

  $scope.getMana = function() {
    var treasureGen = new TreasureGen();
    var manaBundle = treasureGen.manaDrop();
    var color = manaBundle.manaColor;
    $scope.character.mana[color] += manaBundle.manaAmount;
    var fill = 100 - Math.min(10, $scope.character.mana[color]) * 10;
    $scope.manaHeights[color].height = fill + '%';
  }

  $scope.manaHeights = {
    red: {'height': '100%'},
    orange: {'height': '100%'},
    yellow: {'height': '100%'},
    green: {'height': '100%'},
    blue: {'height': '100%'},
    indigo: {'height': '100%'},
    violet: {'height': '100%'},
    gray: {'height': '100%'},
  };

  $scope.knownSpells = new Set();
  $scope.runeCost = function(spell) {
    return spell.length;
  };

  $scope.isLearnable = function(spellName) {
    var spellName = spellName.toLowerCase();
    var runesCopy = $.extend({}, $scope.character.runes);
    if ($scope.knownSpells.has(spellName)) {
      return false;
    }
    for (var i = 0; i < spellName.length; i++) {
      if (runesCopy[spellName[i]] === 0) {
        return false;
      } else {
        runesCopy[spellName[i]] -= 1;
      }
    }
    return true;
  }

  $scope.getLearnableSpells = function() {
    var learnableSpells = [];
    for (var spell of $scope.spellList) {
      if ($scope.isLearnable(spell)) {
        learnableSpells.push(spell);
      }
    }
    return learnableSpells;
  };

  $scope.getUnlearnableSpells = function() {
    var unlearnableSpells = [];
    for (var spell of $scope.spellList) {
      if (!$scope.isLearnable(spell)) {
        unlearnableSpells.push(spell);
      }
    }
    return unlearnableSpells;
  };

  $scope.fadedOrClearRune = function(letter) {
    if ($scope.character.runes[letter] > 0) {
      return 'rune';
    } else {
      return 'rune-faded';
    }
  };

  $scope.letterOrQuotes = function(letter) {
    if (letter === ' ') {
      return '\' \''
    }
    return letter;
  };

  $scope.spellList = [
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

});
