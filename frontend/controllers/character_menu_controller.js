app.controller('characterMenuController', function($scope) {
  $scope.characterList = ['alice', 'bob'];

  $scope.newCharacterName = '';
  $scope.selectedSchool = 'placeholder';

  $scope.schools = [
    {textColor: 'red-text', schoolName: 'Sanimancy', description: 'Sanimancers practice the magic of cleanliness. They use their powers to clean or organize objects and nulify spells.'},
    {textColor: 'orange-text', schoolName: 'Gravomancy', description: 'Gravomancers practice the magic of force. They use their powers to build, destroy, and move objects.'},
  ];

  $scope.cannotCreateNewCharacter = function() {
    if ($scope.newCharacterName === '' || selectedSchool === '') {
      return true;
    }
    return false;
  };

  $scope.getCharacterList = function() {
    return $scope.characterList;
  }
});
