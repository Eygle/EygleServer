/**
 * Created by eygle on 4/26/17.
 */

class MyAccountController {
  constructor(private Auth: Auth,
              private $state: any) {
  }

  public logout = () => {
    this.Auth.logout();
    this.$state.go('eygle.login');
  };
}

angular.module('eygle.profile.my-account')
  .controller('MyAccountController', MyAccountController);