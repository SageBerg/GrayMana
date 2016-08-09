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

  $scope.spellList = SPELL_LIST;
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
