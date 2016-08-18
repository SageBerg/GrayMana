app.controller('learnSpellsController', function($scope) {
  $scope.fadedOrClearRune = function(letter) {
    if ($scope.runes[letter] > 0) {
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

  $scope.runes = {a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0,
    l: 0, m: 0, n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0,
    x: 0, y: 0, z: 0, ' ': 0};

  $scope.knownSpells = new Set();
  $scope.runeCost = function(spell) {
    return spell.length;
  };

  $scope.isLearnable = function(spellName) {
    var spellName = spellName.toLowerCase();
    var runesCopy = $.extend({}, $scope.runes);
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
});
