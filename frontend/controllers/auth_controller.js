app.controller('authController', function($scope, $http, $window) {
  $scope.username = 'person@example.com';
  $scope.password = 'not_a_real_password_used_anywhere_else';
  $scope.newUsername = '';
  $scope.newPassword = '';
  $scope.confirmPassword = '';

  $scope.toggleShowLogin = true;

  $scope.minimumPasswordLengthAllowed = 8;

  $scope.showInvaildEmailMessage = false;
  $scope.showPasswordMissmatchMessage = false;
  $scope.showPasswordTooShortMessage = false;

  $scope.clearInputErrorMessages = function() {
    $scope.showInvaildEmailMessage = false;
    $scope.showPasswordMissmatchMessage = false;
    $scope.showPasswordTooShortMessage = false;
  };

  $scope.login = function() {
    $http({
      method: 'POST',
      url: 'login.json',
      data: {username: $scope.username, password: $scope.password},
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then($scope.handleLogin);
  };

  $scope.createNewAccount = function() {
    $scope.clearInputErrorMessages();
    if ($scope.validateEmail($scope.newUsername) === false) {
      $scope.showInvaildEmailMessage = true;
    } else if ($scope.newPassword.length < $scope.minimumPasswordLengthAllowed) {
      $scope.showPasswordTooShortMessage = true;
    } else if ($scope.newPassword !== $scope.confirmPassword){
      $scope.showPasswordMissmatchMessage = true;
    } else {
      $http({
        method: 'POST',
        url: 'create_new_account.json',
        data: {username: $scope.newUsername, password: $scope.newPassword},
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then($scope.handleLogin);
    }
  }

  $scope.validateEmail = function(email) {
    //credit for the next line goes to community wiki at http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email);
  }

  $scope.handleLogin = function(res) {
    $window.sessionStorage.accessToken = res.data.token;
    $window.location.href = '/game.html';
  }

  $scope.refreshToken = function() {
    $http({
      method: 'POST',
      url: 'refresh_token.json',
      data: {token: window.sessionStorage.accessToken},
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function(res) {
      $window.sessionStorage.accessToken = res.data.token;
    });
  };
});
