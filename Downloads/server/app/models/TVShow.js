/**
 * Created by eygle on 4/28/17.
 */
const mongoose = require('mongoose')
    , Schema = mongoose.Schema;

const TVShowSchema = new Schema({
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
    network: String,

    creationDate: {type: Date, default: Date.now},
    updateDate: {type: Date, default: Date.now},
});

module.exports = mongoose.model('TVShow', TVShowSchema);