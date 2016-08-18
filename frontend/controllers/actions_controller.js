app.controller('actionsController', function($scope, hotKeys) {
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

  $scope.$on($scope.learnSpellsHotKey, function(event) {
    $scope.$emit('openLearnSpellsModal');
  });

});
