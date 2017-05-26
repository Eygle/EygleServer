/**
 * Created by eygle on 4/29/17.
 */

const db = require('../../../modules/db');

module.exports = {
  Resource: {
    get: function (uid, callback) {
      db.models.TVShow.findOne({_id: uid}).exec((err, tvShow) => {
        if (err || !tvShow) return callback(500, {error: err});
        tvShow = tvShow.toObject();

        db.models.Episode.find({_tvShow: uid})
          .populate('_files')
          .exec((err, episodes) => {
            if (err) return callback(500, {error: err});

            tvShow.episodesList = episodes;

            callback(null, tvShow);
          });
      });
    }
  },

  Collection: {
    get: function (callback) {
      db.models.TVShow.find()
        .exec((err, items) => {
          if (err) return callback(500, {error: err});
          callback(null, items);
        });
    }
  }
};