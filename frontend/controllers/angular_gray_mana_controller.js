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
    'violet', 'gray'];

  $scope.toggleShowTitles = true;
  $scope.toggleShowHotKeys = true;
  $scope.toggleShowNotifications = true;

  $scope.disableManatate = false;
  $scope.disableSwitchToClone = true;
  $scope.disableInteract = true;
  $scope.disableEat = true;
  $scope.disableSleep = true;
  $scope.disableCastSelectedSpell = true;
  $scope.disablePrepareSpells = true;
  $scope.disableLearnSpells = true;
  $scope.disableTalk = false;
  $scope.disableViewQuests = true;
  $scope.disableViewFactionDetails = true;
  $scope.disableViewInventory = true;
  $scope.disableAdmireAchievements = true;

  $scope.runes = character.runes;
  $scope.alphabet ='abcdefghijklmnopqrstuvwxyz ';

  $scope.character = character;
});
