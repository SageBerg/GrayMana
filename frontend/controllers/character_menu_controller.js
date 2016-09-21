app.controller('characterMenuController', function($scope, $http, $window) {

  $scope.characters = [];

  $http({
    method: 'GET',
    url: 'characters',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  }).then(function(res) {
    for (character of res.data) {
      $scope.characters.push(character);
    }
  });

  $scope.startPlayingAs = function(characterId) {
    $http({
      method: 'POST',
      url: 'start_game',
      data: {characterId: characterId},
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function(res) {
      if (res.status === 200) {
        $scope.$emit('changeToGameTemplate');
      } else {
        //TODO prompt user with Error message
      }
    });
  };

  $scope.newCharacter = {characterName: '', characterSchool: ''};

  $scope.schools = [
    {textColor: 'red-text', schoolName: 'Sanimancy',
      description: 'Sanimancers practice the magic of cleanliness. They use their powers to clean or organize objects and nulify spells.'
    },
    {textColor: 'orange-text', schoolName: 'Gravomancy',
      description: 'Gravomancers practice the magic of force. They use their powers to build and destroy.'
    },
    {textColor: 'yellow-text', schoolName: 'Thermomancy',
      description: 'Thermomancers practice the magic of heat. They use their powers to heat and cool people and objects.'
    },
    {textColor: 'green-text', schoolName: 'Vitomancy',
      description: 'Vitomancers practice the magic of sustenance. They use their powers to grow crops and strengthen themselves and their allies.'
    },
    {textColor: 'blue-text', schoolName: 'Locomancy',
      description: 'Locomancers practice the magic of air. They use their powers to increase movement capabilities.'
    },
    {textColor: 'indigo-text', schoolName: 'Sombromancy',
      description: 'Sombomancers practice the magic of sleep. They use their powers to heal or incapacitate.'
    },
    {textColor: 'violet-text', schoolName: 'Sociomancy',
      description: 'Sociomancers practice the magic of camaraderie. They use their powers to build connections between people.'
    },
    {textColor: 'gray-text', schoolName: 'Infomancy',
      description: 'Infomancers practice the magic of information. They use their powers to learn or hide information.'
    }
  ];

  $scope.cannotCreateNewCharacter = function() {
    if ($scope.newCharacter.characterName === '' ||
        $scope.newCharacter.characterSchool === '') {
      return true;
    }
    return false;
  };

  $scope.createNewCharacter = function() {
    $http({
      method: 'POST',
      url: 'characters',
      data: {characterName: $scope.newCharacter.characterName, characterSchool: $scope.newCharacter.characterSchool},
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function(res) {
      $scope.startPlayingAs();
    });
  }

});
