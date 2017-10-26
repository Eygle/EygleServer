import * as mongoose from 'mongoose';

import DB from '../modules/DB';
import ASchema from './ASchema.schema';
import Utils from "../config/Utils";

const _schema: mongoose.Schema = DB.createSchema({
    filename: String,
    ext: String,
    size: Number,
    path: String,
    normalized: String,
    mtime: Date,
    directory: Boolean,

    mediaInfo: {
        title: String,
        season: Number,
        episode: Number,
        episodeName: String,
        region: String,
        year: Number,
        language: String,
        resolution: String,
        repack: Boolean,
        quality: String,
        proper: Boolean,
        hardcoded: Boolean,
        extended: Boolean,
        codec: String,
        audio: String,
        group: String,
        excess: [{
            type: String
        }]
    },

    parent: {type: String, ref: 'File'},
    episode: {type: String, ref: 'Movie'},
    movie: {type: String, ref: 'Movie'},
});

_schema.pre('save', function (next) {
    if (this.isNew) {
        this.normalized = Utils.normalize(this.filename);
    }
    next();
});

class File extends ASchema {

    /**
     * Schema getter
     * @return {mongoose.Schema}
     */
    getSchema(): mongoose.Schema {
        return _schema;
    }
}

const instance = new File();

module.exports.schema = instance;
export default instance;