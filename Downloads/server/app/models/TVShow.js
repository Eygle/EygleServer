/**
 * Created by eygle on 4/28/17.
 */
const mongoose = require('mongoose')
  , Schema = mongoose.Schema;

const TVShowSchema = new Schema({
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

  creationDate: {type: Date, default: Date.now},
  updateDate: {type: Date, default: Date.now}
});

TVShowSchema.pre('save', function (next) {
  this.updateDate = new Date();
  next();
});

module.exports = mongoose.model('TVShow', TVShowSchema);