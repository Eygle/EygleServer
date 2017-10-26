import * as mongoose from 'mongoose';
import * as q from 'q';

import DB from '../modules/DB';
import ASchema from './ASchema.schema';
import {ITVDBEpisode} from "../modules/TVDB";

const _schema: mongoose.Schema = DB.createSchema({
    title: String,

    tvdbId: Number,
    tvdbSeasonId: Number,

    number: Number,
    season: Number,

    date: Date,

    overview: String,

    tvShow: {type: String, ref: 'TVShow'},
    files: [{type: String, ref: 'File'}]
});

class Episode extends ASchema {

    /**
     * Find all episodes by tvshow id
     * @param {string} tid
     * @return {Q.Promise<any>}
     */
    public findAllByTVShowId(tid: string) {
        const defer = q.defer();

        this._model.find()
            .where('tvShow').equals(tid)
            .populate('files')
            .exec((err, item) => {
                if (err) return defer.reject(err);
                defer.resolve(item);
            });

        return defer.promise;
    }

    /**
     * Create or update (if exists) episode from TVDB episode result
     * @param {ITVShow} show
     * @param {ITVDBEpisode} res
     * @param files
     * @return {Q.Promise<any>}
     */
    public createOrUpdateFromTVDBResult(show: ITVShow, res: ITVDBEpisode, files) {
        const defer = q.defer();

        this._model.findOne()
            .where('tvdbId').equals(res.id)
            .exec((err, item: IEpisode) => {
                if (err || !item) {
                    const ep = this.create({
                        title: res.episodeName,
                        tvdbId: res.id,
                        tvShow: show._id,
                        files: _.map(files, (f) => {
                            return f._id.toString()
                        }),
                        number: res.airedEpisodeNumber,
                        season: res.airedSeason,
                        overview: res.overview,
                        date: res.firstAired
                    });
                    for (let file of files) {
                        file.episode = ep._id;
                    }
                    return defer.resolve(ep);
                }

                item.files = item.files.concat(_.map(files, (f) => {
                    return f._id.toString();
                }));
                for (let file of files) {
                    file._episode = item._id;
                }
                defer.resolve(item);
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

const instance = new Episode();

module.exports.schema = instance;
export default instance;