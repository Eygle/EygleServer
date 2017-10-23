import * as mongoose from 'mongoose';

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
});

export class Proposal extends ASchema {

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