/**
 * Created by eygle on 5/13/17.
 */

class MovieSearchController {
  public onSelect: any;

  public label: string;

  constructor(private Api: Api,
              private $q: any,
              $translate: any) {
    this.label = $translate.instant('MOVIES.SEARCH');
  }

  public search = (term: string) => {
    const defer = this.$q.defer();

    this.Api.movies.byTitle.search({term: term}, (res: Array<IAutocompleteMovie>) => {
      defer.resolve(res);
    }, err => {
      defer.reject(err);
    });

    return defer.promise;
  };
}

angular.module('eygle.services.movies')
  .controller('MovieSearchController', MovieSearchController);