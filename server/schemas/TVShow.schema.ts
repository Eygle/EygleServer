import * as mongoose from 'mongoose';
import * as q from 'q';

import DB from '../modules/DB';
import ASchema from './ASchema.schema';
import Episode from './Episode.schema';

const _schema: mongoose.Schema = DB.createSchema({
    title: String,

    tvdbId: Number,
    imdbId: String,

    banner: String,
    poster: String,
    posterThumb: String,
    genres: [{type: String}],
    overview: String,

    actors: [{
        tvdbId: Number,
        name: String,
        character: String,
        image: String
    }],

    seasons: Number,
    episodes: Number,
    start: Date,
    end: Date,
    runtime: Number,
    status: String,
    network: String,
});

export class TVShow extends ASchema {
    /**
     * Get full TVShow with episodes list
     * @param {string} id
     * @return {Q.Promise<any>}
     */
    public getFull(id: string) {
        const defer = q.defer();

        this.get(id)
            .then((tvShow: any) => {
                if (tvShow) {
                    tvShow = tvShow.toObject();
                    Episode.findAllByTVShowId(tvShow._id.toString())
                        .then(items => {
                            tvShow.episodesList = items;
                            defer.resolve(tvShow);
                        })
                        .catch(defer.reject);
                } else {
                    defer.resolve();
                }
            })
            .catch(defer.reject);

        return defer.promise;
    }

    /**
     * Schema getter
     * @return {mongoose.Schema}
     */
    getSchema(): mongoose.Schema {
        return _schema;
    }
}

const instance = new TVShow();

module.exports.schema = instance;
export default instance;