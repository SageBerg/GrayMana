app.controller('characterController', function($scope, characterStateService) {
  $scope.alphabet ='abcdefghijklmnopqrstuvwxyz ';

  $scope.getTreasure = function() {
    $scope.getMana();
    $scope.getRunes();
  };

  $scope.getManaAmount = function(color) {
    return characterStateService.character.currentBody.mana[color];
  };

  $scope.getRuneAmount = function(letter) {
    return characterStateService.character.currentBody.runes[letter];
  };

  $scope.getRunes = function() {
    var treasureGen = new TreasureGen();
    var runeDrop = treasureGen.runeDrop();
    for (var i = 0; i < runeDrop.length; i++) {
      characterStateService.character.currentBody.runes[runeDrop[i]] += 1;
    }
  }

  $scope.getMana = function() {
    var treasureGen = new TreasureGen();
    var manaBundle = treasureGen.manaDrop();
    var color = manaBundle.manaColor;
    characterStateService.character.currentBody.mana[color] += manaBundle.manaAmount;
    var fill = 100 - Math.min(10, characterStateService.character.currentBody.mana[color]) * 10;
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

  $scope.runeCost = function(spell) {
    return spell.length;
  };

  $scope.isLearnable = function(spellName) {
    var spellName = spellName.toLowerCase();
    var runesCopy = $.extend({}, characterStateService.character.currentBody.runes);
    if (characterStateService.character.spellsKnown.has(spellName)) {
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
    if (characterStateService.character.currentBody.runes[letter] > 0) {
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
