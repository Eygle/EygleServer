/**
 * Created by eygle on 4/26/17.
 */

class TVShowDetailsController {
   public tvShow: ITVShow;
   public seasons: Array<any>;
   public lastEpisode: IEpisode;

   constructor(private Api: Api,
               private $stateParams: any) {
   }

   $onInit() {
      this.Api.tvShows.byId.get({id: this.$stateParams.id}, (res: ITVShow) => {
         res.start = new Date(res.start);
         this._populateSeasons(res.episodesList);
         delete res.episodes;
         this.tvShow = res;
      });
   }

   private _populateSeasons = (episodes: Array<IEpisode>) => {
      const seasons = [];

      for (let e of episodes) {
         let s = _.find(seasons, (s) => {
            return s.number === e.season
         });
         if (!s) {
            s = {number: e.season, episodes: []};
            seasons.push(s);
         }
         s.episodes.push(e);
      }

      this.seasons = _.sortBy(_.map(seasons, (s) => {
         s.episodes = _.sortBy(s.episodes, (e: IEpisode) => {
            return e.number
         });
         return s;
      }), s => {
         return -s.number
      });
      this.lastEpisode = this.seasons[0].episodes[this.seasons[0].episodes.length - 1];
   };
}

angular.module('eygle.tv-shows')
   .controller('TVShowDetailsController', TVShowDetailsController);