/**
 * Created by eygle on 4/26/17.
 */
class MovieDetailsComponent {
  public controller: string;
  public controllerAs: string;
  public templateUrl: string;

  constructor() {
    this.controller = 'MovieDetailsController';
    this.controllerAs = 'vm';
    this.templateUrl = 'app/main/general/movies/movie-details/movie-details.html';
  }
}

angular.module('eygle.movies')
  .component('movieDetails', new MovieDetailsComponent());
