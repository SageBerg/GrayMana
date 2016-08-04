app.controller("grayManaController", function($scope) {
  $scope.colorClasses = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo',
    'violet', 'black', 'gray', 'white'];
  $scope.damageTypeIds = ['damage-1-red', 'damage-2-orange', 'damage-3-yellow',
    'damage-4-green', 'damage-5-blue', 'damage-6-indigo', 'damage-7-violet',
    'damage-8-black', 'damage-9-gray', 'damage-10-white'];
  $scope.manaBarIds = ['mana-bar-1-red',
    'mana-bar-2-orange', 'mana-bar-3-yellow', 'mana-bar-4-green',
    'mana-bar-5-blue', 'mana-bar-6-indigo', 'mana-bar-7-violet',
    'mana-bar-8-black', 'mana-bar-9-gray', 'mana-bar-10-white'];
  $scope.metaButtons = ['Log Out (x)', 'Edit Options (o)', 'Get Game Info (h)'];
  $scope.spellSlots = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  $scope.lastSpellSlot = function(spellSlotNumber) {
    if (spellSlotNumber === $scope.spellSlots[$scope.spellSlots.length - 1]) {
      return 'selected-spell-slot ';
      //the space at the end provides a space between classes in the element
    } else {
      return '';
    }
  }

});
