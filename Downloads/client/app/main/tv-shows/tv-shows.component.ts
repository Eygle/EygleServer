/**
 * Created by eygle on 4/26/17.
 */
class TVShowsComponent {
    public controller : string;
    public controllerAs : string;
    public templateUrl : string;
    public bindings : any;

    constructor() {
        this.controller = 'TVShowsController';
        this.controllerAs = 'vm';
        this.templateUrl = 'app/main/tv-shows/tv-shows.html';
    }
}

angular.module('eygle.tv-shows')
    .component('tvShows', new TVShowsComponent());
