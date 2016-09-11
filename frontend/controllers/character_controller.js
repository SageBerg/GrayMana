app.controller('characterController', function($scope, $http, characterStateService) {
  $scope.alphabet ='abcdefghijklmnopqrstuvwxyz ';

  $scope.$on('loadCharacter', function(event) {
    $http({
      method: 'POST',
      url: 'load_character',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function(res) {
      characterStateService.character.x_coord += res.data.x_coord;
      characterStateService.character.y_coord += res.data.y_coord;
    });
  });

/*
  $scope.requestNewItem(item, quantity) {
    $http({
      method: 'POST',
      url: 'new_item',
      data: {item: item, quantity: quanity},
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function(res) {
      characterStateService.character.inventory[item] += res.data[item];
    });
  }
*/

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
      url: 'get_treasure',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function(res) {
      $scope.getMana(res.data.treasureDrop.manaDrop);
      $scope.getRunes(res.data.treasureDrop.runeDrop)
    });
  };

  $scope.getApple = function() {
    characterStateService.character.inventory['apple'] += 1;
  };

  $scope.eat = function() {
    characterStateService.character.inventory['apple'] -= 1;
    console.log(characterStateService.character.inventory['apple'] + ' apples left.');
  }

  $scope.sleep = function() {
    if (characterStateService.character.state !== 'asleep') {
      characterStateService.character.state = 'asleep';
    } else {
      characterStateService.character.state = 'active';
    }
  }

  $scope.getManaAmount = function(color) {
    return characterStateService.character.mana[color];
  };

  $scope.getRuneAmount = function(letter) {
    return characterStateService.character.runes[letter];
  };

  $scope.getRunes = function(runeDrop) {
    for (var i = 0; i < runeDrop.length; i++) {
      characterStateService.character.runes[runeDrop[i]] += 1;
    }
  }

  $scope.getMana = function(manaDrop) {
    var color = manaDrop.manaColor;
    characterStateService.character.mana[color] += manaDrop.manaAmount;

    var fill = 100 - Math.min(10, characterStateService.character.mana[color]) * 10;
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
    var runesCopy = $.extend({}, characterStateService.character.runes);
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
    if (characterStateService.character.runes[letter] > 0) {
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
    red: {'width': characterStateService.character.damage['red'] + '%'},
    orange: {'width': characterStateService.character.damage['orange'] + '%'},
    yellow: {'width': characterStateService.character.damage['yellow'] + '%'},
    green: {'width': characterStateService.character.damage['green'] + '%'},
    blue: {'width': characterStateService.character.damage['blue'] + '%'},
    indigo: {'width': characterStateService.character.damage['indigo'] + '%'},
    violet: {'width': characterStateService.character.damage['violet'] + '%'},
    gray: {'width': characterStateService.character.damage['gray'] + '%'},
  };

  $scope.takeDamage = function(amount, color) {
    characterStateService.character.damage[color] += amount;
    console.log(characterStateService.character.damage)
    $scope.widthObj[color].width = parseInt(($scope.widthObj[color].width).slice(0, -1)) + amount + '%';
  };

});
