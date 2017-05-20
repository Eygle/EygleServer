class RunBlock {
    constructor(private $rootScope: any,
                private $state: any,
                private Auth: Auth) {

        // Store state in the root scope for easy access
        $rootScope.state = $state;

      const guestsRoutes = ['/login', '/register', '/error-404'];
        //REDIRECT
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState) {
            if (!!~guestsRoutes.indexOf(toState.url)) {
                // No need to check if the user is loggedIn
            } else if (!Auth.isLoggedIn()) {
                console.log("is not logged in");
                event.preventDefault();
                $state.go('eygle.login');
            } else if (toState.data && toState.data.access && !Auth.authorise(toState.data.access)) {
                event.preventDefault();
                $state.go('eygle.home');
            }
            $rootScope.loadingProgress = false;
        })
    }
}

angular.module('eygle')
    .run(RunBlock);