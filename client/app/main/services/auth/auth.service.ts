/**
 * Created by eygle on 4/29/17.
 */

class Auth {
   /**
    * Current user
    */
   public user: IUser;

   /**
    * List of available permissions
    */
   private _allPermissions: Array<any>;

   constructor(private $cookieStore: any,
               private $http: any) {
      this._allPermissions = this.$cookieStore.get('permissions');
      this.$http.get('/api/permissions').then((res: any) => {
         this._allPermissions = res.data;
         this.$cookieStore.put('permissions', res.data);
      });

      this.init();
   }

   public init = () => {
      this.user = this.$cookieStore.get('user') || <IUser>{email: '', roles: ["public"]};
      this.$cookieStore.remove('user'); // Remove the cookie after reading it (then the user will be logged out if it's session expired)
   };

   public logout = () => {
      this.$cookieStore.remove('user');
      this.user = null;
   };

   /**
    * Does user has requested permission
    * @param accessLevel
    * @param {IUser} user
    * @return {boolean}
    */
   public authorize = (accessLevel, user: IUser = null) => {
      const memberRights = user && user.roles ? user.roles : this.user.roles || ["public"];

      if (!!~memberRights.indexOf("admin")) {
         return true;
      }
      if (!this._allPermissions || !this._allPermissions.length) {
         return false;
      }

      for (const perm of this._allPermissions) {
         if (perm.name === accessLevel) {
            for (const m of memberRights) {
               if (!!~perm.roles.indexOf(m)) {
                  return true;
               }
            }
         }
      }
      return false;
   };
}

angular
   .module('eygle.services.auth')
   .service('Auth', Auth);