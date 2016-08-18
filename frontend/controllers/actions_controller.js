app.controller('actionsController', function($scope, hotKeys) {
  $scope.manatateHotKey = hotKeys.manatateHotKey;
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

  $scope.$on($scope.manatateHotKey, function(event) {
    $scope.toggleManatate();
    $scope.$digest();
  });

  $scope.$on($scope.learnSpellsHotKey, function(event) {
    $scope.$emit('openLearnSpellsModal');
  });

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
