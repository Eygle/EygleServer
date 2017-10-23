import * as mongoose from 'mongoose';

import DB from '../modules/DB';
import ASchema from './ASchema.schema';

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