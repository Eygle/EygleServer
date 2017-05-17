/**
 * Created by eygle on 5/17/17.
 */
class RegisterController {
  public user;

  constructor(private Api: Api,
              private ToastService: ToastService,
              private $state: any) {
    this.user = {};
  }

  public submit = () => {
    this.Api.user.register.add(this.user, () => {
      this.ToastService.show(EStatus.Ok);
      this.$state.go('eygle.login');
    }, err => {
      console.error(err);
      this.ToastService.show(EStatus.RejectByServer);
    });
  };
}

angular.module('eygle.register')
  .controller('RegisterController', RegisterController);