class MainController {
  constructor(private $scope: any,
              private $rootScope: any) {
    // Data
    //////////

    // Remove the splash screen
    $scope.$on('$viewContentAnimationEnded', function (event) {
      if (event.targetScope.$id === $scope.$id) {
        $rootScope.$broadcast('msSplashScreen::remove');
      }
    });
  }
}

angular
  .module('eygle')
  .controller('MainController', MainController);
