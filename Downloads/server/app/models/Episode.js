/**
 * Created by eygle on 4/28/17.
 */
const mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

const EpisodeSchema = new Schema({
  title: String,

  tvdbId: Number,
  tvdbSeasonId: Number,

  _tvShow: {type: ObjectId, ref: 'TVShow'},
  _files: [{type: ObjectId, ref: 'File'}],

  number: Number,
  season: Number,

  date: Date,

  overview: String,

  creationDate: {type: Date, default: Date.now},
  updateDate: {type: Date, default: Date.now},

  deleted: {type: Boolean, default: false}
});

EpisodeSchema.pre('save', function (next) {
  this.updateDate = new Date();
  next();
});

module.exports = mongoose.model('Episode', EpisodeSchema);