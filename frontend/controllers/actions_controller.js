app.controller('actionsController', function($scope, hotKeyService) {

  $scope.getSwitchToCloneHotKey = function() {
    return hotKeyService.switchToCloneHotKey;
  };

  $scope.getInteractHotKey = function() {
    return hotKeyService.interactHotKey;
  };

  $scope.getEatHotKey = function() {
    return hotKeyService.eatHotKey;
  };

  $scope.getSleepHotKey = function() {
    return hotKeyService.sleepHotKey;
  };

  $scope.getCastSelectedSpellHotKey = function() {
    return hotKeyService.castSelectedSpellHotKey;
  };

  $scope.getPrepareSpellsHotKey = function() {
    return hotKeyService.prepareSpellsHotKey;
  };

  $scope.getLearnSpellsHotKey = function() {
    return hotKeyService.learnSpellsHotKey;
  };

  $scope.getTalkHotKey = function() {
    return hotKeyService.talkHotKey;
  };

  $scope.getLogOutHotKey = function() {
    return hotKeyService.logOutHotKey;
  };

  $scope.getEditOptionsHotKey = function() {
    return hotKeyService.editOptionsHotKey;
  };

  $scope.getGetGameInfoHotKey = function() {
    return hotKeyService.getGameInfoHotKey;
  };

  $scope.getAdmireAchievementsHotKey = function() {
    return hotKeyService.admireAchievementsHotKey;
  };

  $scope.getManageQuestsHotKey = function() {
    return hotKeyService.manageQuestsHotKey;
  };

  $scope.getViewFactionDetailsHotKey = function() {
    return hotKeyService.viewFactionDetailsHotKey;
  };

  $scope.getManageInventoryHotKey = function() {
    return hotKeyService.manageInventoryHotKey;
  };

});
