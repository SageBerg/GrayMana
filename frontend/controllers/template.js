app.controller('templateController', function($scope, $http, $window) {
  $scope.currentTemplate = 'login.html';

  $window.onbeforeunload = function() {
    return $http({
      method: 'POST',
      url: 'logout',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
  };

  $scope.$on('changeToCharacterTemplate', function() {
    $scope.currentTemplate = 'character.html';
  });

  $scope.$on('changeToGameTemplate', function() {
    $scope.currentTemplate = 'game.html';
  });

  $scope.logout = function() {
    $http({
      method: 'POST',
      url: 'logout',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function(res) {
      $scope.currentTemplate = 'login.html';
    });
  };
});
