app.controller('HUDController', function($scope) {
  $scope.HUDState = {
    selectedManaSlot: 8,
    selectedSpellSlot: 10
  };

  $scope.metaButtons = [
    {title: 'Log Out', hotKey: 'x', modal: 'logOut', disabled: false},
    {title: 'Edit Options', hotKey: 'o', modal: 'editOptions', disabled: false},
    {title: 'Get Game Info', hotKey: 'g', modal: 'getGameInfo', disabled: false}
  ];

  $scope.$on($scope.metaButtons[1].hotKey, function(event) {
    $scope.$emit('openEditOptionsModal');
  });

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

  $scope.$on('showHUD', function(event) {
    $scope.toggleShowHUD = true;
  });

  $scope.toggleShowHUD = false;

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
  $scope.disableLearnSpells = false;
  $scope.disableTalk = false;
  $scope.disableViewQuests = true;
  $scope.disableViewFactionDetails = true;
  $scope.disableViewInventory = true;
  $scope.disableAdmireAchievements = true;

  //$scope.runes = character.runes;
  
  $scope.alphabet ='abcdefghijklmnopqrstuvwxyz ';

  //$scope.character = character;
});