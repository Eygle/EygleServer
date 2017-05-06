/**
 * Created by eygle on 5/6/17.
 */
/**
 * Created by eygle on 4/28/17.
 */
const mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

const ProposalSchema = new Schema({
  _file: {type: ObjectId, ref: 'File'},

  title: String,
  originalTitle: String,
  date: Date,
  overview: String,

  poster: String,

  tmdbId: Number,

  episode: Number,
  season: Number,

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

  creationDate: {type: Date, default: Date.now},
  updateDate: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Proposal', ProposalSchema);