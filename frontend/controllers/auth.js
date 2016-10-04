app.controller('authController', function($scope, $http, $window) {
  $scope.email = 'person@example.com';
  $scope.password = 'not_a_real_password_used_anywhere_else';
  $scope.newEmail = 'testuser@example.com';
  $scope.newPassword = 'moremore';
  $scope.confirmPassword = 'moremore';

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

  $scope.login = function(email, password) {
    $http({
      method: 'POST',
      url: 'login',
      data: {email: email, password: password},
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then($scope.changeToCharacterTemplate);
  };

  $scope.createNewAccount = function() {
    $scope.clearInputErrorMessages();
    if ($scope.validateEmail($scope.newEmail) === false) {
      $scope.showInvaildEmailMessage = true;
    } else if ($scope.newPassword.length < $scope.minimumPasswordLengthAllowed) {
      $scope.showPasswordTooShortMessage = true;
    } else if ($scope.newPassword !== $scope.confirmPassword){
      $scope.showPasswordMissmatchMessage = true;
    } else {
      $http({
        method: 'POST',
        url: 'accounts',
        data: {email: $scope.newEmail, password: $scope.newPassword},
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then($scope.changeToCharacterTemplate);
    }
  }

  $scope.validateEmail = function(email) {
    //credit:
      //stackoverflow.com/questions/46155/validate-email-address-in-javascript
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  $scope.changeToCharacterTemplate = function(res) {
    $scope.$emit("changeToCharacterTemplate");
  }
});
