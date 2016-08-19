app.controller('HUDController', function($scope, characterStateService, hotKeyService) {

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

  $scope.$on(hotKeyService.switchToCloneHotKey, function(event) {
    console.log("switch to clone option chosen");
  });

  $scope.$on(hotKeyService.interactHotKey, function(event) {
    console.log("interact option chosen");
  });

  $scope.$on(hotKeyService.eatHotKey, function(event) {
    $scope.$emit('eat');
  });

  $scope.$on(hotKeyService.sleepHotKey, function(event) {
    $scope.$emit('sleep');
  });

  $scope.$on(hotKeyService.castSelectedSpellHotKey, function(event) {
    console.log("cast selected spell option chosen");
  });

  $scope.$on(hotKeyService.prepareSpellsHotKey, function(event) {
    console.log("prepare spells option chosen");
  });

  $scope.$on(hotKeyService.learnSpellsHotKey, function(event) {
    $scope.$emit('openLearnSpellsModal');
  });

  $scope.$on(hotKeyService.talkHotKey, function(event) {
    console.log("talk option chosen");
  });

  $scope.$on(hotKeyService.logOutHotKey, function(event) {
    console.log("log out option chosen");
  });

  $scope.$on(hotKeyService.editOptionsHotKey, function(event) {
    $scope.$emit('openEditOptionsModal');
  });

  $scope.$on(hotKeyService.getGameInfoHotKey, function(event) {
    console.log("get game info option chosen");
  });

  $scope.$on(hotKeyService.admireAchievementsHotKey, function(event) {
    console.log("admire achievements option chosen");
  });

  $scope.$on(hotKeyService.viewFactionDetailsHotKey, function(event) {
    console.log("view faction details option chosen");
  });

  $scope.$on(hotKeyService.manageQuestsHotKey, function(event) {
    console.log("manage quests option chosen");
  });

  $scope.$on(hotKeyService.manageInventoryHotKey, function(event) {
    console.log("manage inventory option chosen");
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
