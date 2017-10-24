import * as mongoose from 'mongoose';
import * as q from 'q';

import DB from '../modules/DB';
import ASchema from './ASchema.schema';

const _schema: mongoose.Schema = DB.createSchema({
    title: String,
    originalTitle: String,
    date: Date,
    overview: String,
    poster: String,

    tmdbId: Number,

    file: {type: String, ref: 'File'}
}, false);

export class Proposal extends ASchema {

    public getAllByFileId(fid) {
        const defer = q.defer();

        this._model.find()
            .where('file').equals(fid)
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

const instance = new Proposal();

module.exports.schema = instance;
export default instance;