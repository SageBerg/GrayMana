app.controller('templateController', function($scope) {
  $scope.currentTemplate = 'login.html';

  $scope.$on('changeToCharacterTemplate', function() {
    $scope.currentTemplate = 'character.html';
  });

  $scope.$on('changeToGameTemplate', function() {
    $scope.currentTemplate = 'game.html';
  });

});
