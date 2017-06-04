/**
 * Created by eygle on 5/6/17.
 */

const _ = require("underscore")
  , q = require('q')
  , db = require('../../../modules/db')
  , movies = require('../../../modules/movies')
  , ObjectId = require('mongodb').ObjectID;

function unlinkMovie(movie, fileId) {
  const defer = q.defer();

  if (movie._files.length > 1) {
    const idx = _.findIndex(movie._files, (f) => {
      return f._id === fileId;
    });
    if (idx !== -1) {
      movie._files[idx]._movie = null;
      movie._files[idx].save(() => {
        movie._files.splice(idx, 1);
        movie.save(() => {
          defer.resolve();
        });
      })
    } else {
      defer.resolve();
    }
  } else if (movie._files.length === 1) {
    movie._files[0]._movie = null;
    movie._files[0].save(() => {
      movie.remove(() => {
        defer.resolve();
      });
    });
  } else {
    movie.remove(() => {
      defer.resolve();
    });
  }

  return defer.promise;
}

function unlinkMovies(movies, fileId, movieId) {
  const defer = q.defer();
  const promises = [];

  for (let m of movies) {
    if (!m._id.equals(movieId)) {
      promises.push(unlinkMovie(m, fileId));
    }
  }

  q.allSettled(promises).then(() => defer.resolve());

  return defer.promise;
}

module.exports = {
  Resource: {
    get: function (uid, callback) {
      db.models.Movie.findOne({_id: uid})
        .populate('_files')
        .exec((err, item) => {
          if (err) return callback(500, {error: err});
          callback(null, item);
        });
    },
    // Change movie related to file
    put: function (fileId, callback) {
      // TODO check if is admin
      db.models.File.findOne({_id: fileId})
        .exec((err, file) => {
          if (err) return callback(500, {error: err});
          movies.fetchMovie(this.body.tmdbId, file).then(movie => {
            db.models.Movie.find({_files: {$in: [ObjectId(fileId)]}})
              .populate('_files')
              .exec((err, items) => {
                if (err || !items) return callback(500, err);
                unlinkMovies(items, fileId, movie._id).then(() => {
                  file.save(err => {
                    if (err) return callback(500, err);
                    movie.save(err => {
                      if (err) return callback(500, err);
                      callback(null, movie);
                    });
                  });
                });
              });
          }).catch(err => {
            return callback(500, {error: err})
          });
        });
    },

    delete: function (movieId, callback) {
      db.models.Movie.findOne({_id: movieId}).populate('_files').exec((err, movie) => {
        if (err) return callback(500, err);
        unlinkMovie(movie, this.query.fileId).then(() => {
          callback(null, {status: 'ok'});
        });
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
            for (let f of v._files) {
              if (f.mtime && (min === null || min.getTime() > f.mtime.getTime())) {
                min = f.mtime.getTime();
              }
            }
            return min;
          }).reverse());
        });
    }
  }
};