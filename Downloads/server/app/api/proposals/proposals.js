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
    delete: function (fileId, callback) {
      db.models.Proposal.find({_file: fileId})
        .remove()
        .exec((err) => {
          if (err) return callback(500, err);
          callback(null, {status: 'ok'});
        });
    },
    put: function (uid, callback) {
      db.models.Proposal.findOne({_id: uid})
        .select({tmdbId: 1, _file: 1})
        .populate('_file')
        .exec((err, proposal) => {
          if (err || !proposal) return callback(500, err);
          movies.fetchMovie(proposal.tmdbId, proposal._file).then(movie => {
            proposal._file.save(err => {
              if (err) return callback(500, err);
              movie.save(err => {
                if (err) return callback(500, err);
                module.exports.Resource.delete(proposal._file._id, callback);
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
        .exec((err, proposals) => {
          if (err) return callback(500, err);
          // Transform a flat list of proposals in a list of files owning an array of proposals

          // list of files as object to access by id
          const files = {};

          // populate files object with files
          // Each file has a proposal array
          for (let i in proposals) {
            if (proposals.hasOwnProperty(i)) {
              const proposal = proposals[i].toObject();
              const file = proposal._file;
              const fid = proposal._file._id;

              proposals[i] = proposal;

              if (!files[fid]) {
                file.proposals = [];
                files[fid] = file;
              }

              delete proposal._file;
              files[fid].proposals.push(proposal);
            }
          }

          // files object to array
          const res = [];
          for (let f in files) {
            if (files.hasOwnProperty(f)) {
              res.push(files[f]);
            }
          }

          // Return array
          callback(null, res);
        });
    }
  }
};