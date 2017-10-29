class NavigationController {
   public parts: Array<any>;

   constructor(public $state, public Auth: Auth) {
      this.parts = [];

      for (let s of $state.get()) {
         if (s.weight && (!s.access || this.Auth.authorize(s.access))) {
            this.parts.push(s);
         }
      }
   }
}

angular
   .module('eygle')
   .controller('NavigationController', NavigationController);