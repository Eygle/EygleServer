/**
 * Created by eygle on 5/11/17.
 */

/**
 * Created by eygle on 4/29/17.
 */

const db = require('../../../modules/db')
  , movies = require('../../../modules/movies');

module.exports = {
  Resource: {
    delete: function (uid, callback) {
      db.models.Proposal.find({_file: uid})
        .remove()
        .exec((err) => {
          if (err) return callback(500, err);
          callback(null, {status: 'ok'});
        });
    },
    put: function (uid, callback) {
      db.models.Proposal.findOne({_id: uid})
        .select({tmdbId: 1, _file: 1})
        .exec((err, proposal) => {
          if (err || !proposal) return callback(500, err);
          movies.fetchMovie(proposal.tmdbId, proposal).then(movie => {
            proposal.save(err => {
              if (err) return callback(500, err);
              movie.save(err => {
                if (err) return callback(500, err);
                module.exports.Resource.delete(proposal._file, callback);
              });
            });
          }).catch(err => {
            callback(500, err)
          });
        });
    }
  },
  Collection: {
    get: function (callback) {
      db.models.Proposal.find()
        .select({_file: 1, date: 1, title: 1, originalTitle: 1, poster: 1})
        .populate('_file')
        .exec((err, items) => {
          if (err) return callback(500, err);
          const files = {};

          for (let i of items) {
            const fid = i._file._id;
            if (!files[fid]) {
              files[fid] = {
                _id: i._file._id,
                filename: i._file.filename,
                size: i._file.size,
                path: i._file.path,
                mtime: i._file.mtime,
                proposals: []
              };
            }

            i._file = null;
            files[fid].proposals.push(i);
          }

          const res = [];
          for (let f in files) {
            if (files.hasOwnProperty(f)) {
              res.push(files[f]);
            }
          }
          callback(null, res);
        });
    }
  }
};