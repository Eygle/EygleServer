/**
 * Created by eygle on 5/13/17.
 */

class MovieSearchComponent {
   public controller: string;
   public controllerAs: string;
   public templateUrl: string;
   public bindings: any;

   constructor() {
      this.controller = 'MovieSearchController';
      this.controllerAs = 'vm';
      this.templateUrl = 'app/main/services/movies/movie-search/movie-search.html';
      this.bindings = {
         onSelect: '&'
      };
   }
}

angular.module('eygle.services.movies')
   .component('movieSearch', new MovieSearchComponent);