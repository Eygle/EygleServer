/**
 * Created by eygle on 4/29/17.
 */

class Auth {
  public user: IUser;

  private _isLoggedIn: boolean;

  constructor(private $cookieStore: any) {
    this.init();
  }

  public init = () => {
    const cookieUser = this.$cookieStore.get('ED-USER');
    this.user = cookieUser || <IUser>{email: '', roles: ['public']};
    this._isLoggedIn = !!cookieUser;
    console.log(this.user);
  };

  public isLoggedIn = () => {
    return this._isLoggedIn;
  };

  public authorise = (access) => {
    return true;
  };

  public logout = () => {
    this.$cookieStore.remove('ED-USER');
    this._isLoggedIn = false;
    this.user = null;
  };
}

angular
  .module('eygle.services.auth')
  .service('Auth', Auth);