app.controller('grayManaController', function($scope) {
  $scope.metaButtons = [
    {title: 'Log Out', hotKey: 'x', modal: 'logOut'},
    {title: 'Edit Options', hotKey: 'o', modal: 'editOptions'},
    {title: 'Get Game Info', hotKey: 'g', modal: 'getGameInfo'}
  ];

  $scope.spellSlots = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  $scope.lastSpellSlot = function(spellSlotNumber) {
    if (spellSlotNumber === $scope.spellSlots[$scope.spellSlots.length - 1]) {
      return 'selected-spell-slot ';
      //the space at the end provides a space between classes in the element
    } else {
      return '';
    }
  }

  $scope.colorClasses = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo',
    'violet', 'black', 'gray', 'white'];

  $scope.switchShowTitles = true;
  $scope.switchShowHotKeys = true;

  $scope.runes = character.runes;
  $scope.alphabet ='abcdefghijklmnopqrstuvwxyz ';

  $scope.character = character;
});
