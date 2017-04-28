/**
 * Created by eygle on 4/28/17.
 */
const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;

const VideoSchema   = new Schema({
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
    }]
});

module.exports = mongoose.model('Video', VideoSchema);