import * as q from "q";
import * as _ from "underscore";
import * as NodeTVDB from "node-tvdb";

import ALimitedApi from "./ALimitedApi";
import Utils from "../config/Utils";

class TVDB extends ALimitedApi {
   constructor() {
      super();
      this.api = new NodeTVDB(Utils.tvdbToken);
   }

   /**
    * Get by id
    * @param tvdbId
    * @return {Q.Promise<ITVDBShow>}
    */
   public get(tvdbId): q.Promise<ITVDBShow> {
      const defer: q.Deferred<ITVDBShow> = q.defer();

      const show = <ITVDBShow>{};

      q.allSettled([
         this.request('getSeriesAllById', tvdbId, {lang: 'fr'})
            .then(res => _.map(res, (v, k) => {
               show[k] = v;
            })),
         this.request('getSeriesPosters', tvdbId).then(res => show.posters = res),
         this.request('getActors', tvdbId, {lang: 'fr'}).then(res => show.actors = res)
      ]).then(() => {
         defer.resolve(show);
      }).catch((err) => {
         defer.reject(err);
      });

      return defer.promise;
   }

   /**
    * Search by title
    * @param {string} title
    * @return {Q.Promise<Array<ITVDBShow>>}
    */
   public searchByTitle(title: string): q.Promise<Array<ITVDBShow>> {
      return <q.Promise<Array<ITVDBShow>>>this.request('getSeriesByName', title, {lang: 'fr'});
   }
}

export interface ITVDBShow {
   id: number;
   imdbId: string;
   seriesName: string;
   genre: Array<string>;
   overview: string;
   firstAired: string;
   network: string;
   runtime: string;
   status: string;

   banner: string;
   posters: Array<any>;

   actors: Array<any>;
   episodes: Array<ITVDBEpisode>;
}

export interface ITVDBEpisode {
   id: number;
   episodeName: string;
   overview: string;
   firstAired: string;
   airedSeason: number;
   airedEpisodeNumber: number;
}

export default new TVDB();