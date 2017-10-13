/**
 * Created by eygle on 4/26/17.
 */

class MovieDetailsController {
  public movie: IMovie;

  constructor(private Api: Api,
              private ToastService: ToastService,
              private $stateParams: any
    , private $state: any) {
  }

  $onInit() {
    this.Api.movies.byId.get({id: this.$stateParams.id}, (res: IMovie) => {
      res.date = new Date(res.date);
      this.movie = res;
    });
  }

  public unlink = (fileId) => {
    this.Api.movies.byId.unlink({id: this.movie._id, fileId: fileId}, (res) => {
      this.ToastService.show(EStatus.Ok);
      this.$state.go('eygle.movies');
    });
  };
}

angular.module('eygle.movies')
  .controller('MovieDetailsController', MovieDetailsController);