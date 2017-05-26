/**
 * Created by eygle on 4/28/17.
 */
const mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

const MovieSchema = new Schema({
  _files: [{type: ObjectId, ref: 'File'}],

  title: String,
  originalTitle: String,
  date: Date,
  countries: [{type: String}],
  genres: [{type: String}],
  overview: String,
  budget: Number,
  revenue: Number,
  originalLanguage: String,
  runtime: Number,

  poster: String,
  posterThumb: String,
  backdrop: String,

  cast: [{
    tmdbId: Number,
    name: String,
    character: String,
    image: String
  }],
  crew: [{
    tvdbId: Number,
    name: String,
    job: String,
    image: String,
  }],

  videos: [{
    id: String,
    lang: String,
    key: String,
    name: String,
    site: String,
    size: Number,
    videoType: String
  }],

  tmdbId: Number,
  imdbId: String,

  creationDate: {type: Date, default: Date.now},
  updateDate: {type: Date, default: Date.now},

  deleted: {type: Boolean, default: false}
});

MovieSchema.pre('save', function (next) {
  this.updateDate = new Date();
  next();
});

module.exports = mongoose.model('Movie', MovieSchema);