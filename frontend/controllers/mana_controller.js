app.controller('manaController', function($scope) {
  $scope.mana = {red: 0, orange: 0, yellow: 0, green: 0, blue: 0, indigo: 0,
    violet: 0, black: 0, gray: 0, white: 0
  };

  $scope.getMana = function(amount, color) {
    $scope.mana[color] += amount;
    var fill = 100 - Math.min(10, $scope.mana[color]) * 10;
    $scope.manaHeights[color].height = fill + '%';
  }

  $scope.manaHeights = {
    red: {'height': '100%'},
    orange: {'height': '100%'},
    yellow: {'height': '100%'},
    green: {'height': '100%'},
    blue: {'height': '100%'},
    indigo: {'height': '100%'},
    violet: {'height': '100%'},
    black: {'height': '100%'},
    gray: {'height': '100%'},
    white: {'height': '100%'}
  };
});
