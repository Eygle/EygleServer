/**
 * Created by eygle on 4/28/17.
 */
const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;

const TVShowSchema   = new Schema({
    title: String,

    tvdbId: Number,
    imdbId: Number,

    banner: String,
    poster: String,
    genres: [{type: String}],
    overview: String,

    actors: [{type: ObjectId, ref: 'Actor'}],

    seasons: Number,
    episodes: Number,
    start: Date,
    end: Date,
    network: String
});

module.exports = mongoose.model('TVShow', TVShowSchema);