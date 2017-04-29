/**
 * Created by eygle on 4/28/17.
 */
const mongoose = require('mongoose')
    , Schema = mongoose.Schema;

const EpisodeSchema = new Schema({
    title: String,

    tvdbId: Number,
    tvdbSeasonId: Number,

    _creator: { type: ObjectId, ref: 'TVShow' },

    number: Number,
    season: Number,

    overview: String,

    creationDate: {type: Date, default: Date.now},
    updateDate: {type: Date, default: Date.now},

    deleted: {type: Boolean, default: false}
});

module.exports = mongoose.model('Episode', EpisodeSchema);