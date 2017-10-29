class RunBlock {
   /**
    * Checks to perform
    */
   private _checks: Array<{ func: (toState: string, fromState: string) => boolean, route?: string, modal?: string }>;

   /**
    * Routes not to include in checks
    */
   private _ignoreRoutes: Array<String>;

   constructor(private $rootScope: any,
               private $state: any,
               private Auth: Auth,
               private ModalService: ModalService) {

      // Store state in the root scope for easy access
      $rootScope.state = $state;

      this._checks = [
         {func: this._shouldLogin, route: 'eygle.login'},
         {func: this._hasNotAccessTo, route: 'eygle.home', modal: 'mp-modal-access'},
         {func: this._shouldSeeResetPassword, route: 'eygle.reset-password'}
      ];

      //REDIRECT
      $rootScope.$on("$stateChangeStart", (event, toState, toParams, fromState) => {
            // Activate loading indicator
            $rootScope.loadingProgress = true;

            // console.info('go to', toState.url);

            this._performChecksNRedirects(toState, fromState, event, $state);

            $rootScope.loadingProgress = false;
         }
      );
   }

   /**
    * Perform all checks and redirects
    * @param toState
    * @param fromState
    * @param event
    * @param $state
    * @return {boolean}
    * @private
    */
   private _performChecksNRedirects = (toState, fromState, event, $state) => {
      this._ignoreRoutes = ["/forgot-password", "/login", "/register"];

      for (let check of this._checks) {
         if (check.func(toState, fromState)) {
            if (check.modal) { // Display modal (access denied)
               this.ModalService.show({
                  escapeToClose: false,
                  clickOutsideToClose: false,
                  component: check.modal
               }).finally(() => {
                  if (check.route) // Redirect to route
                  {
                     $state.go('eygle.home');
                  }
               });
            } else if (check.route) { // Redirect to route
               event.preventDefault();
               console.info("Redirect to route", check.route);
               $state.go(check.route);
            }
            return true;
         }
      }

      return true;
   };

   /**
    * Should User be redirected to login view
    * @param toState
    * @return {boolean}
    * @private
    */
   private _shouldLogin = (toState) => {
      return !this.Auth.user.email && !this._urlIn(this._ignoreRoutes, toState.url);
   };

   /**
    * Should User be redirected to reset password view
    * @param toState
    * @return {boolean}
    * @private
    */
   private _shouldSeeResetPassword = (toState) => {
      this._ignoreRoutes.push('/reset-password');
      return !this._urlIn(this._ignoreRoutes, toState.url) && this.Auth.user.changePassword;
   };

   /**
    * Should User be redirected to cgu view
    * @param toState
    * @return {boolean}
    * @private
    */
   private _hasNotAccessTo = (toState) => {
      return toState.access && !this.Auth.authorize(toState.access);
   };

   /**
    * Is url in exclude list
    * @param exclude
    * @param {string} url
    * @return {number}
    * @private
    */
   private _urlIn = (exclude: any, url: string) => {
      exclude = exclude instanceof Array ? exclude : [exclude];
      return ~exclude.indexOf(url);
   };
}

angular.module('eygle')
   .run(RunBlock);