app.controller('controlsController', function($scope) {

  $scope.addWheelHandler = function() {
    document.addEventListener('wheel', $scope.wheelHandler);
  };

  $scope.wheelHandler = function(e) {
    e.preventDefault();
    var prev_spell_slot = document.getElementById('spell-slot-' + HUDState.selectedSpellSlot);
    prev_spell_slot.removeAttribute('class', 'selected-spell-slot');
    prev_spell_slot.setAttribute('class', 'spell-logo-frame');
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    if (delta === 1) {
       HUDState.selectedSpellSlot -= 1;
       if (HUDState.selectedSpellSlot < 1) {
         HUDState.selectedSpellSlot = 10;
       }
    } else {
      HUDState.selectedSpellSlot += 1;
      if (HUDState.selectedSpellSlot > 10) {
        HUDState.selectedSpellSlot = 1;
      }
    }
    var current_spell_slot = document.getElementById("spell-slot-" + HUDState.selectedSpellSlot);
    current_spell_slot.setAttribute('class', 'selected-spell-slot spell-logo-frame');
  };

  $scope.bindKeys = function() {
    $(document).keydown(function(event) {
      switch(event.which) {
        case 37: //left
          move(0, -1);
          break;

        case 38: //up
          move(-1, 0);
          break;

        case 39: //right
          move(0, 1)
          break;

        case 40: //down
          move(1, 0);
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
