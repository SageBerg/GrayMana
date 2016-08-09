app.controller('damageController', function($scope) {
  $scope.damageTypeIds = ['damage-1-red', 'damage-2-orange', 'damage-3-yellow',
    'damage-4-green', 'damage-5-blue', 'damage-6-indigo', 'damage-7-violet',
    'damage-8-black', 'damage-9-gray', 'damage-10-white'];

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

});
