class ToastService {
  constructor(private $mdToast: any) {
  }

  private _ok = (txt) => {
    this.$mdToast.show({
      controller: 'ToastController',
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'app/main/services/toast/templates/toast-ok.html',
      hideDelay: 5000,
      position: 'top right',
      locals: {error: txt}
    });
  };

  private _error = (txt) => {
    this.$mdToast.show({
      controller: 'ToastController',
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'app/main/services/toast/templates/toast-error.html',
      hideDelay: 5000,
      position: 'top right',
      locals: {error: txt}
    });
  };

  public show = (status: EStatus, translate: string = null) => {
    switch (status) {
      case EStatus.Ok:
        this._ok('TOAST.OK');
        break;
      case EStatus.RejectByServer:
        this._error('TOAST.SERVER');
        break;
      case EStatus.NoDataProvided:
        this._error('TOAST.DATA');
        break;
      case EStatus.NoAccess:
        this._error('TOAST.ACCESS');
        break;
      case EStatus.LoginFail:
        this._error('TOAST.LOGIN.LOGIN_FAIL');
        break;
      case EStatus.LoginCaptchaFail:
        this._error('TOAST.LOGIN.CAPTCHA_FAIL');
        break;
      case EStatus.LoginEmailNotVerified:
        this._error('TOAST.LOGIN.EMAIL_NOT_VERIFIED');
        break;
      case EStatus.NoResult:
        this._error('TOAST.NO_RESULT');
        break;
      case EStatus.CustomOk:
        this._ok(translate);
        break;
      case EStatus.CustomError:
        this._error(translate);
        break;
      default:
        break;
    }
  };
}

angular.module('eygle.services.toast')
  .service('ToastService', ToastService);
