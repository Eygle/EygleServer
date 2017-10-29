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
         console.log(this.Auth.user);
         this.$state.go('eygle.home');
      }, err => {
         this.ToastService.show(err.data === "FailedToLogin" ? EStatus.LoginFail : EStatus.RejectByServer);
      });
   };
}

angular.module('eygle.login')
   .controller('LoginController', LoginController);