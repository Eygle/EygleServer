/**
 * Created by eygle on 5/6/17.
 */

const _ = require("underscore")
  , db = require('../../../modules/db');

module.exports = {
  Resource: {
    get: function (uid, callback) {
      db.models.Movie.findOne({_id: uid})
        .populate('_files')
        .exec((err, item) => {
          if (err) return callback(500, {error: err});
          callback(null, item);
        });
    }
  },

  Collection: {
    get: function (callback) {
      db.models.Movie.find()
        .select({_file: 1, title: 1, date: 1, posterThumb: 1, _files: 1})
        .populate({path: '_files', select: 'mtime'})
        .exec((err, items) => {
          if (err) return callback(500, {error: err});
          callback(null, _.sortBy(items, (v) => {
            let min = null;
            console.log(v);
            for (let f of v._files) {
              if (min === null || min.getTime() > f.mtime.getTime()) {
                min = f.mtime.getTime();
              }
            }
            return min;
          }).reverse());
        });
    }
  }
};