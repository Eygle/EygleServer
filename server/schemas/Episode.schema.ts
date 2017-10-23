import * as mongoose from 'mongoose';

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