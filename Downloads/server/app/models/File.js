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

  _episode: {type: ObjectId, ref: 'Episode'},
  _movie: {type: ObjectId, ref: 'Movie'},

  creationDate: {type: Date, default: Date.now},
  updateDate: {type: Date, default: Date.now},

  deleted: {type: Boolean, default: false}
});

module.exports = mongoose.model('File', FileSchema);