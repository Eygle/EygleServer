/**
 * Created by eygle on 5/17/17.
 */
class RegisterComponent {
   public controller: string;
   public controllerAs: string;
   public templateUrl: string;

   constructor() {
      this.controller = 'RegisterController';
      this.controllerAs = 'vm';
      this.templateUrl = 'app/main/guests/register/register.html';
   }
}

angular.module('eygle.register')
   .component('register', new RegisterComponent());