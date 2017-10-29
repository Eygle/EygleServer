/**
 * Created by eygle on 4/26/17.
 */
class TVShowDetailsComponent {
   public controller: string;
   public controllerAs: string;
   public templateUrl: string;

   constructor() {
      this.controller = 'TVShowDetailsController';
      this.controllerAs = 'vm';
      this.templateUrl = 'app/main/general/tv-shows/tv-show-details/tv-show-details.html';
   }
}

angular.module('eygle.tv-shows')
   .component('tvShowDetails', new TVShowDetailsComponent());
