/**
 * Created by eygle on 4/26/17.
 */
class MyAccountComponent {
    public controller : string;
    public controllerAs : string;
    public templateUrl : string;

    constructor() {
        this.controller = 'MyAccountController';
        this.controllerAs = 'vm';
        this.templateUrl = 'app/main/profile/my-account/my-account.html';
    }
}

angular.module('eygle.profile.my-account')
    .component('my-account', new MyAccountComponent());
