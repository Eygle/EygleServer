/**
 * Created by eygle on 4/26/17.
 */

class TVShowsController {
  public tvShows: Array<ITVShow>;

  constructor(private Api: Api) {
  }

  $onInit() {
    this.Api.tvShows.byId.all((res: Array<IMovie>) => {
      this.tvShows = _.map(res, v => {
        v.start = new Date(v.start);
        return v;
      });
    });
  }
}

angular.module('eygle.tv-shows')
  .controller('TVShowsController', TVShowsController);