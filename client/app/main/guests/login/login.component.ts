class LoginComponent {
   public controller: string;
   public controllerAs: string;
   public templateUrl: string;

   constructor() {
      this.controller = 'LoginController';
      this.controllerAs = 'vm';
      this.templateUrl = 'app/main/guests/login/login.html';
   }
}

angular.module('eygle.login')
   .component('login', new LoginComponent());