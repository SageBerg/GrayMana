app.controller('modalController', function($scope) {
  $scope.showModal = false;

  $scope.showEditOptions = false;
  $scope.showLearnSpells = false;

  $scope.closeModal = function() {
    $scope.showModal = false;
    $scope.showEditOptions = false;
    $scope.showLearnSpells = false;
  }

  $scope.openModal = function(modalContent) {
    $scope.showModal = true;
    switch (modalContent) {
      case 'learnSpells':
        $scope.showLearnSpells = true;
        break;
      case 'editOptions':
        $scope.showEditOptions = true;
        break;
    }
  }

  $scope.$on('openLearnSpellsModal', function(event) {
    if ($scope.showModal == false) {
      $scope.openModal('learnSpells');
    } else {
      $scope.closeModal();
    }
    $scope.$digest();
  });

  $scope.$on('openEditOptionsModal', function(event) {
    if ($scope.showModal == false) {
      $scope.openModal('editOptions');
    } else {
      $scope.closeModal();
    }
    $scope.$digest();
  });

});
