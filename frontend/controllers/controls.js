app.controller('controlsController', function($scope, hotKeyService) {

  //TODO move to HUD controller
  $scope.HUDState = {
    selectedSpellSlot: 8
  }

  $scope.addWheelHandler = function() {
    document.addEventListener('wheel', $scope.wheelHandler);
  };

  $scope.wheelHandler = function(e) {
    e.preventDefault();
    var prev_spell_slot = document.getElementById('spell-slot-' +
      $scope.HUDState.selectedSpellSlot);
    prev_spell_slot.removeAttribute('class', 'selected-spell-slot');
    prev_spell_slot.setAttribute('class', 'spell-logo-frame');
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    if (delta === 1) {
       $scope.HUDState.selectedSpellSlot -= 1;
       if ($scope.HUDState.selectedSpellSlot < 1) {
         $scope.HUDState.selectedSpellSlot = 8;
       }
    } else {
      $scope.HUDState.selectedSpellSlot += 1;
      if ($scope.HUDState.selectedSpellSlot > 8) {
        $scope.HUDState.selectedSpellSlot = 1;
      }
    }
    var current_spell_slot = document.getElementById("spell-slot-" +
      $scope.HUDState.selectedSpellSlot);
    current_spell_slot.setAttribute('class',
      'selected-spell-slot spell-logo-frame');
  };

  $scope.bindKeys = function() {
    $(document).keydown(function(event) {
      switch(event.which) {
        case 37:
          $scope.$emit('moveLeft');
          break;

        case 38:
          $scope.$emit('moveUp');
          break;

        case 39:
          $scope.$emit('moveRight');
          break;

        case 40:
          $scope.$emit('moveDown');
          break;

        default:
          return;
      }
      event.preventDefault(); //prevent scrolling
    });
  };

  //$scope.$on('bindKeys', function(event) {
    $scope.bindKeys();
  //});

  //$scope.$on('bindWheel', function(event) {
    $scope.addWheelHandler();
  //});

  $scope.getSwitchToCloneHotKey = function() {
    return hotKeyService.switchToCloneHotKey;
  };

  $scope.getInteractHotKey = function() {
    return hotKeyService.interactHotKey;
  };

  $scope.getEatHotKey = function() {
    return hotKeyService.eatHotKey;
  };

  $scope.getSleepHotKey = function() {
    return hotKeyService.sleepHotKey;
  };

  $scope.getCastSelectedSpellHotKey = function() {
    return hotKeyService.castSelectedSpellHotKey;
  };

  $scope.getPrepareSpellsHotKey = function() {
    return hotKeyService.prepareSpellsHotKey;
  };

  $scope.getLearnSpellsHotKey = function() {
    return hotKeyService.learnSpellsHotKey;
  };

  $scope.getTalkHotKey = function() {
    return hotKeyService.talkHotKey;
  };

  $scope.getLogOutHotKey = function() {
    return hotKeyService.logOutHotKey;
  };

  $scope.getEditOptionsHotKey = function() {
    return hotKeyService.editOptionsHotKey;
  };

  $scope.getGetGameInfoHotKey = function() {
    return hotKeyService.getGameInfoHotKey;
  };

  $scope.getAdmireAchievementsHotKey = function() {
    return hotKeyService.admireAchievementsHotKey;
  };

  $scope.getManageQuestsHotKey = function() {
    return hotKeyService.manageQuestsHotKey;
  };

  $scope.getViewFactionDetailsHotKey = function() {
    return hotKeyService.viewFactionDetailsHotKey;
  };

  $scope.getManageInventoryHotKey = function() {
    return hotKeyService.manageInventoryHotKey;
  };


  //listen for hot keys

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

});
