app.controller('HUDController', function($scope, characterStateService) {

  $scope.colorClasses = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo',
    'violet', 'gray'];

  $scope.spellSlots = [1, 2, 3, 4, 5, 6, 7, 8];

  $scope.lastSpellSlot = function(spellSlotNumber) {
    if (spellSlotNumber === $scope.spellSlots[$scope.spellSlots.length - 1]) {
      return 'selected-spell-slot ';
      //the space at the end provides a space between classes in the element
    } else {
      return '';
    }
  }

  $scope.$on('showHUD', function(event) {
    $scope.toggleShowHUD = true;
  });

  $scope.cannotSwitchToClone = function() {
    return characterStateService.character.bodies.length < 2;
  };

  $scope.cannotEat = function() {
    return characterStateService.character.currentBody.inventory['apple'] < 1 ||
           characterStateService.character.currentBody.state === 'asleep';
  };

  $scope.cannotManageInventory = function() {
    if (characterStateService.character.currentBody.state === 'asleep') {
      return true;
    }
    for (var key in characterStateService.character.currentBody.inventory) {
      if (characterStateService.character.currentBody.inventory.hasOwnProperty(key)) {
        if (characterStateService.character.currentBody.inventory[key] > 0) {
          return false;
        }
      }
    }
    return true; //meaning it's true that you have no inventory to manage
  };

  $scope.cannotTalk = function() {
    return characterStateService.character.currentBody.state === 'asleep';
  };

  $scope.toggleShowHUD = false;

  $scope.toggleShowTitles = true;
  $scope.toggleShowHotKeys = true;

  $scope.disableInteract = true;
  $scope.disableSleep = false;
  $scope.disableCastSelectedSpell = true;
  $scope.disablePrepareSpells = true;
  $scope.disableViewQuests = true;
  $scope.disableViewFactionDetails = true;
  $scope.disableAdmireAchievements = true;

  $scope.getSleepButtonTitle = function() {
    if (characterStateService.character.currentBody.state === 'asleep') {
      return "Wake Up";
    } else {
      return "Sleep";
    }
  }

});
