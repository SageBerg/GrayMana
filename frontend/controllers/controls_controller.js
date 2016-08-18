app.controller('controlsController', function($scope) {

  //TODO move to HUD controller
  $scope.HUDState = {
    selectedSpellSlot: 8
  }

  $scope.addWheelHandler = function() {
    document.addEventListener('wheel', $scope.wheelHandler);
  };

  $scope.wheelHandler = function(e) {
    e.preventDefault();
    var prev_spell_slot = document.getElementById('spell-slot-' + $scope.HUDState.selectedSpellSlot);
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
    var current_spell_slot = document.getElementById("spell-slot-" + $scope.HUDState.selectedSpellSlot);
    current_spell_slot.setAttribute('class', 'selected-spell-slot spell-logo-frame');
  };

  $scope.bindKeys = function() {
    $(document).keydown(function(event) {
      switch(event.which) {
        case 37:
          $scope.$broadcast('moveLeft');
          break;

        case 38:
          $scope.$broadcast('moveUp');
          break;

        case 39:
          $scope.$broadcast('moveRight');
          break;

        case 40:
          $scope.$broadcast('moveDown');
          break;

        default:
          return;
      }
      event.preventDefault(); //prevent scrolling
    });
  };

  $scope.$on('bindKeys', function(event) {
    $scope.bindKeys();
  });

  $scope.$on('bindWheel', function(event) {
    $scope.addWheelHandler();
  });

});
