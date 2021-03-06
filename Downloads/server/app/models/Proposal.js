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

  creationDate: {type: Date, default: Date.now},
  updateDate: {type: Date, default: Date.now}
});

ProposalSchema.pre('save', function (next) {
  this.updateDate = new Date();
  next();
});

module.exports = mongoose.model('Proposal', ProposalSchema);