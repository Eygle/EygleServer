/**
 * Created by eygle on 4/26/17.
 */

class MoviesController {
  public movies: Array<IMovie>;

  constructor(private Api: Api,
              private _: any) {
  }

  $onInit() {
    this.Api.movies.all((res: Array<IMovie>) => {
      this.movies = _.map(res, v => {
        v.date = new Date(v.date);
        return v;
      });
    });
  }
}

angular.module('eygle.movies')
  .controller('MoviesController', MoviesController);