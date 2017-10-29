/**
 * Created by eygle on 4/26/17.
 */
class AppController {
   public login;

   constructor(private $scope: any) {
      this.login = false;

      // $scope.$on('$locationChangeStart', function (next, current) {
      //     vm.login = !(!Auth.user || !Auth.user.id || Auth.user.id == "" || Auth.user.role.title == "public");
      // });
   }
}

angular
   .module('eygle')
   .controller('AppController', AppController);
