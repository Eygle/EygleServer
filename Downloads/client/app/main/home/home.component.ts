/**
 * Created by eygle on 4/26/17.
 */
class HomeComponent {
    public controller : string;
    public controllerAs : string;
    public templateUrl : string;
    public bindings : any;

    constructor() {
        this.controller = 'HomeController';
        this.controllerAs = 'vm';
        this.templateUrl = 'app/main/home/home.html';
    }
}

angular.module('eygle.home')
    .component('home', new HomeComponent());
