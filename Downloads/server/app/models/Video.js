/**
 * Created by eygle on 4/28/17.
 */
const mongoose = require('mongoose')
    , Schema = mongoose.Schema;

const VideoSchema = new Schema({
    filename: String,
    ext: String,
    size: String,
    path: String,

    movie_id: String,
    episode_id: String,

    season: Number,
    episode: Number,

    year: Number,
    region: String,
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
    }],

    creationDate: { type : Date, default : Date.now },
    updateDate: { type : Date, default : Date.now },

    deleted: { type : Boolean, default : false }
});

module.exports = mongoose.model('Video', VideoSchema);