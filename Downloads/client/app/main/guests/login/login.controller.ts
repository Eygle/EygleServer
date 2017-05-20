class LoginController {
  public user: IUser;

  constructor(private Api: Api,
              private Auth: Auth,
              private ToastService: ToastService,
              private $state: any) {
    this.user = <IUser>{};
  }

  public submit = () => {
    this.Api.user.login.query(this.user, () => {
      this.ToastService.show(EStatus.Ok);
      this.Auth.init();
      this.$state.go('eygle.home');
    }, err => {
      console.error(err);
      this.ToastService.show(EStatus.RejectByServer);
    });
  };
}

angular.module('eygle.login')
    .controller('LoginController', LoginController);