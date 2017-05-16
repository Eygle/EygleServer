/**
 * Created by eygle on 4/29/17.
 */

class Auth {
    public user: IUser;

    private _isLoggedIn: boolean;

    constructor($cookieStore: any) {
        const cookieUser = $cookieStore.get('ed-user');
        this.user = cookieUser || <IUser>{email: '', roles: ['public']};
        this._isLoggedIn = !!cookieUser;
        console.log("Auth", this.user, this._isLoggedIn);
    }

    public isLoggedIn = () => {
        return this._isLoggedIn;
    };

    public authorise = (access) => {
        return true;
    };

    public logout = () => {

    };
}

angular
    .module('eygle.services.auth')
    .service('Auth', Auth);