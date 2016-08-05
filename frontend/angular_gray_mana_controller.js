app.controller('grayManaController', function($scope) {
  $scope.damageTypeIds = ['damage-1-red', 'damage-2-orange', 'damage-3-yellow',
    'damage-4-green', 'damage-5-blue', 'damage-6-indigo', 'damage-7-violet',
    'damage-8-black', 'damage-9-gray', 'damage-10-white'];
  $scope.manaBarIds = ['mana-bar-1-red',
    'mana-bar-2-orange', 'mana-bar-3-yellow', 'mana-bar-4-green',
    'mana-bar-5-blue', 'mana-bar-6-indigo', 'mana-bar-7-violet',
    'mana-bar-8-black', 'mana-bar-9-gray', 'mana-bar-10-white'];
  $scope.metaButtons = [{title: 'Log Out', hotKey: 'x', modal: 'logOut'},
                        {title: 'Edit Options', hotKey: 'o', modal: 'editOptions'},
                        {title: 'Get Game Info', hotKey: 'g', modal: 'getGameInfo'} ];
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
  $scope.damages = {red: 0, orange: 0, yellow: 0, green: 0, blue: 0, indigo: 0,
    violet: 0, black: 0, gray: 0, white: 0
  };

  $scope.widthObj = {
    red: {'width': $scope.damages['red'] + '%'},
    orange: {'width': $scope.damages['orange'] + '%'},
    yellow: {'width': $scope.damages['yellow'] + '%'},
    green: {'width': $scope.damages['green'] + '%'},
    blue: {'width': $scope.damages['blue'] + '%'},
    indigo: {'width': $scope.damages['indigo'] + '%'},
    violet: {'width': $scope.damages['violet'] + '%'},
    black: {'width': $scope.damages['black'] + '%'},
    gray: {'width': $scope.damages['gray'] + '%'},
    white: {'width': $scope.damages['white'] + '%'}
  };

  $scope.takeSomeDamage = function(amount, color) {
    $scope.damages[color] += amount;
    $scope.widthObj[color].width = parseInt(($scope.widthObj[color].width).slice(0, -1)) + amount + '%';
  };

  $scope.openModal = function(modalContent) {
    //document.getElementsByClassName('modal')[0].style.display = 'block';
    $scope.showModal = true;
    switch (modalContent) {
      case 'learnSpells':
        $scope.initLearnSpellsModal();
        break;
      case 'editOptions':
        $scope.showEditOptions = true;
        break;
    }
  }

  $scope.switchShowTitles = true;
  $scope.switchShowHotKeys = true;

  $scope.showModal = false;

  $scope.showEditOptions = false;
  $scope.showLearnSpells = false;

  $scope.initLearnSpellsModal = function() {
    $scope.showLearnSpells = true;
    renderRunes();
    renderLearnSpellList();
  }

  $scope.closeModal = function() {
    $scope.showModal = false;
    $scope.showEditOptions = false;
    $scope.showLearnSpells = false;
  }

  $scope.manatateHotKey = 'm';
  $scope.interactHotKey = 'k';
  $scope.eatHotKey = 'e';
  $scope.sleepHotKey = 'z';

  $scope.learnSpellsHotKey = 'l';
  $scope.prepareSpellsHotKey = 'p';
  $scope.castSelectedSpellHotKey = 'r';

  $scope.talkHotKey = 't';
  $scope.questHotKey = 'q';
  $scope.factionHotKey = 'f';

  $scope.inventoryHotKey = 'i';
  $scope.achievementsHotKey = 'c';

});
