/**
 * Created by eygle on 4/26/17.
 */

class MovieDetailsController {
  public movie: IMovie;

  constructor(private Api: Api,
              private $stateParams: any) {
  }

  $onInit() {
    this.Api.movies.get({id: this.$stateParams.id}, (res: IMovie) => {
      res.date = new Date(res.date);
      this.movie = res;
    });
  }
}

angular.module('eygle.movies')
  .controller('MovieDetailsController', MovieDetailsController);