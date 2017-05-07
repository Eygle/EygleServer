/**
 * Created by eygle on 5/6/17.
 */

const mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

const FileSchema = new Schema({
  filename: String,
  ext: String,
  size: Number,
  path: String,
  normalized: String,
  mtime: Date,
  directory: Boolean,

  _parent: {type: ObjectId, ref: 'File'},
  _episode: {type: ObjectId, ref: 'Episode'},
  _movie: {type: ObjectId, ref: 'Movie'},

  mediaInfo: {
    title: String,
    season: Number,
    episode: Number,
    episodeName: String,
    region: String,
    year: Number,
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
  },

  creationDate: {type: Date, default: Date.now},
  updateDate: {type: Date, default: Date.now},

  deleted: {type: Boolean, default: false}
});

module.exports = mongoose.model('File', FileSchema);