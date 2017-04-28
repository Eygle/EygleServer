/**
 * Created by eygle on 4/28/17.
 */
const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;

const EpisodeSchema   = new Schema({
    title: String,

    tvdbId: Number,
    tvdbSeasonId: Number,

    number: Number,
    season: Number,

    overview: String
});

module.exports = mongoose.model('Episode', EpisodeSchema);