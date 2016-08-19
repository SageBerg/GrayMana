app.controller('characterController', function($scope, $http, characterStateService) {
  $scope.alphabet ='abcdefghijklmnopqrstuvwxyz ';

  $scope.$on('eat', function(event) {
    $scope.eat();
  });

  $scope.$on('sleep', function(event) {
    $scope.sleep();
    $scope.$digest();
  });

  $scope.getTreasure = function() {
    $http({
      method: 'POST',
      url: 'get_treasure.json',
      data: {token: window.sessionStorage.accessToken},
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function(res) {
      $scope.getMana(res.data.treasureDrop.manaDrop);
      $scope.getRunes(res.data.treasureDrop.runeDrop)
    });
  };

  $scope.getClone = function() {
    characterStateService.character.bodies.push("dummyTestBody");
  };

  $scope.getApple = function() {
    characterStateService.character.currentBody.inventory['apple'] += 1;
  };

  $scope.eat = function() {
    characterStateService.character.currentBody.inventory['apple'] -= 1;
    console.log(characterStateService.character.currentBody.inventory['apple'] + ' apples left.');
  }

  $scope.sleep = function() {
    if (characterStateService.character.currentBody.state !== 'asleep') {
      characterStateService.character.currentBody.state = 'asleep';
    } else {
      characterStateService.character.currentBody.state = 'active';
    }
  }

  $scope.getManaAmount = function(color) {
    return characterStateService.character.currentBody.mana[color];
  };

  $scope.getRuneAmount = function(letter) {
    return characterStateService.character.currentBody.runes[letter];
  };

  $scope.getRunes = function(runeDrop) {
    for (var i = 0; i < runeDrop.length; i++) {
      characterStateService.character.currentBody.runes[runeDrop[i]] += 1;
    }
  }

  $scope.getMana = function(manaDrop) {
    var color = manaDrop.manaColor;
    characterStateService.character.currentBody.mana[color] += manaDrop.manaAmount;

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

  $scope.widthObj = {
    red: {'width': characterStateService.character.currentBody.damage['red'] + '%'},
    orange: {'width': characterStateService.character.currentBody.damage['orange'] + '%'},
    yellow: {'width': characterStateService.character.currentBody.damage['yellow'] + '%'},
    green: {'width': characterStateService.character.currentBody.damage['green'] + '%'},
    blue: {'width': characterStateService.character.currentBody.damage['blue'] + '%'},
    indigo: {'width': characterStateService.character.currentBody.damage['indigo'] + '%'},
    violet: {'width': characterStateService.character.currentBody.damage['violet'] + '%'},
    gray: {'width': characterStateService.character.currentBody.damage['gray'] + '%'},
  };

  $scope.takeDamage = function(amount, color) {
    characterStateService.character.currentBody.damage[color] += amount;
    console.log(characterStateService.character.currentBody.damage)
    $scope.widthObj[color].width = parseInt(($scope.widthObj[color].width).slice(0, -1)) + amount + '%';
  };

});
