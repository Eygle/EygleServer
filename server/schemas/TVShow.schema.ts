import * as mongoose from 'mongoose';
import * as q from 'q';

import DB from '../modules/DB';
import ASchema from './ASchema.schema';
import Episode from './Episode.schema';
import {ITVDBShow} from "../modules/TVDB";

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

class TVShow extends ASchema {
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
     * Find show linked to file id
     * @param fid
     * @return {Q.Promise<any>}
     */
    public findWithFileId(fid) {
        const defer = q.defer();

        this._model.find()
            .where('files').in([fid])
            .populate('files')
            .exec((err, item) => {
                if (err) return defer.reject(err);
                defer.resolve(item);
            });

        return defer.promise;
    }

    public createOrUpdateFromTVDBResult(t: ITVDBShow) {
        const defer = q.defer();

        this._model.findOne()
            .where('tvdbId').equals(t.id)
            .exec((err, item) => {
                const create = !!(err || !item);

                item = item || {};

                if (create) {
                    item.title = t.seriesName;
                    item.tvdbId = t.id;
                    item.imdbId = t.imdbId;
                    item.genres = t.genre;
                    item.overview = t.overview;
                    item.start = t.firstAired ? new Date(t.firstAired) : null;
                    item.network = t.network;
                }

                item.banner = `http://thetvdb.com/banners/${t.banner}`;
                item.poster = t.posters ? `http://thetvdb.com/banners/${t.posters[0].fileName}` : null;
                item.posterThumb = t.posters ? `http://thetvdb.com/banners/${t.posters[0].thumbnail}` : null;
                item.actors = _.map(
                    _.sortBy(t.actors, (s) => {
                        return s.sortOrder
                    }),
                    (v) => {
                        return {
                            tvdbId: v.id,
                            name: v.name,
                            character: v.role,
                            image: v.image ? `http://thetvdb.com/banners/${v.image}` : null
                        }
                    });
                item.runtime = parseInt(t.runtime);
                item.status = t.status;
                defer.resolve(create ? this.create(item) : item);
            });

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