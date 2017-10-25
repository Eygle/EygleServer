/**
 * Created by eygle on 4/29/17.
 */

class Auth {
  public user: IUser;

  constructor(private $cookieStore: any) {
    this.init();
  }

  public init = () => {
      this.user = this.$cookieStore.get('user') || <IUser>{ email: '', roleTitles: ["public"] };
      this.$cookieStore.remove('user'); // Remove the cookie after reading it (then the user will be logged out if it's session expired)
  };

  public logout = () => {
    this.$cookieStore.remove('user');
    this.user = null;
  };
}

angular
  .module('eygle.services.auth')
  .service('Auth', Auth);