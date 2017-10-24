import * as mongoose from 'mongoose';
import * as q from 'q';

import DB from '../modules/DB';
import ASchema from './ASchema.schema';

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

export class Episode extends ASchema {

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