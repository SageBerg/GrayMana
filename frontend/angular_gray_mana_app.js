var app = angular.module('angularFrontEnd', []).
directive('keypressEvents', [
  '$document',
  '$rootScope',
  function($document, $rootScope) {
    return {
      restrict: 'A',
      link: function() {
        $document.bind('keypress', function(e) {
          $rootScope.$broadcast(String.fromCharCode(e.which));
        });
      }
    };
  }
]);
