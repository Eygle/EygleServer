/**
 * Created by eygle on 4/26/17.
 */
class MoviesComponent {
    public controller : string;
    public controllerAs : string;
    public templateUrl : string;
    public bindings : any;

    constructor() {
        this.controller = 'MoviesController';
        this.controllerAs = 'vm';
        this.templateUrl = 'app/main/general/movies/movies.html';
    }
}

angular.module('eygle.movies')
    .component('movies', new MoviesComponent());
