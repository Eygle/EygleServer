/**
 * Created by eygle on 5/17/17.
 */
class RegisterController {
  public user: IUser;
  public confirmPwd;

  constructor(private Api: Api,
              private ToastService: ToastService,
              private $state: any) {
    this.user = <IUser>{};
    console.log('inside register controller');
  }

  public submit = () => {
    console.log('inside register submit');
    this.Api.user.register.query(this.user, () => {
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