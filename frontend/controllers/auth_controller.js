app.controller('authController', function($scope, $http) {
  $scope.username = 'person@example.com';
  $scope.password = 'not_a_real_password_used_anywhere_else';

  $scope.login = function() {
    $http({
      method: 'POST',
      url: 'login.json',
      data: {username: $scope.username, password: $scope.password},
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then($scope.handleLogin);
  };

  $scope.handleLogin = function(res) {
    if (true) {
      window.sessionStorage.accessToken = res.data.token;
      $scope.$broadcast('loadInitialChunk');

      $scope.$broadcast('showHUD');
      $scope.$broadcast('bindKeys');
      $scope.$broadcast('bindWheel');

      //remove login view
      $('#login-div').html('');
      $('#login-div').css('height', 0);
    } else {
      //TODO handle auth failure case
    }
  };

  $scope.refreshToken = function() {
    $http({
      method: 'POST',
      url: 'refresh_token.json',
      data: {token: window.sessionStorage.accessToken},
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function(res) {
      window.sessionStorage.accessToken = res.data.token;
    });
  };
});
