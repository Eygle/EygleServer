class RunBlock {
    constructor(private $rootScope: any,
                private $timeout: any,
                private $state: any,
                private $anchorScroll: any,
                private $location: any) {
        // Activate loading indicator
        const stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function () {
            $rootScope.loadingProgress = true;
        });

        // De-activate loading indicator
        const stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function () {
            $timeout(function () {
                $rootScope.loadingProgress = false;
                if ($location.hash()) {
                    $anchorScroll();
                }

            });
        });

        // Store state in the root scope for easy access
        $rootScope.state = $state;

        // Cleanup
        $rootScope.$on('$destroy', function () {
            stateChangeStartEvent();
            stateChangeSuccessEvent();
        });

        console.log("Inside app run");
        // $state.go('eygle.home');

        //REDIRECT
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState) {
            console.log("state change start");
            // if (toState.url != "/first-connect" && this.Access.isNotActivated() && !this.Access.CGUisAccepted()) {
            //     event.preventDefault();
            //     $state.go('eygle.first-connection');
            // }
            // else if (!('data' in toState) || !('access' in toState.data)) {
            //     $rootScope.error = "Access undefined for this state";
            //     $rootScope.loadingProgress = false;
            //     // event.preventDefault();
            // }
            // else if (!Auth.authorize(toState.data.access)) {
            //     /*$rootScope.error = "Vous n'avez pas les droits pour cet accès...";*/
            //     event.preventDefault();
            //     if (fromState.url === '^') {
            //         if (Auth.user.userName) {
            //             if (toState.url === '/')
            //                 $rootScope.error = "";
            //         } else {
            //             $rootScope.error = null;
            //             $state.go('eygle.home');
            //         }
            //     }
            // }
            $rootScope.loadingProgress = false;
        })
    }
}

angular.module('eygle')
    .run(RunBlock);