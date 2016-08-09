app.controller('actionsController', function($scope) {
  $scope.manatateHotKey = 'm';
  $scope.cloneHotKey = 'c';

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
  $scope.achievementsHotKey = 'v';

  $scope.isManatating = false;

  $scope.toggleManatate = function() {
    $scope.isManatating = !$scope.isManatating;
  }

  $scope.getManatateButtonTitle = function() {
    if ($scope.isManatating) {
      return 'Stop Manatating';
    }
    return 'Manatate';
  }
});
