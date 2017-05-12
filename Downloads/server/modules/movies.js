/**
 * Created by eygle on 5/12/17.
 */

const q = require('q')
  , _ = require('underscore')
  , tmdb = require('moviedb')("22e2817ba73ca94f0b3971f847acefc6")
  , db = require('../../server/modules/db');

let tmdbConfig = null;

module.exports.fetchMovie = (tmdbId, file = null) => {
  const defer = q.defer();

  loadTMDBConfig().then(() => {
    // Check if we already have a movie with this tmdbId
    db.models.Movie.findOne({tmdbId: tmdbId})
      .exec((err, movie) => {
        if (err || !movie) {
          // Create a new movie with all info
          tmdb.movieInfo({id: tmdbId, language: 'fr', append_to_response: 'credits,videos'}, (err, res) => {
            if (err || !res) {
              defer.reject(err);
            } else {
              defer.resolve(createMovieFromTMDBResult(res, file));
            }
          });
        } else {
          file._movie = movie._id;
          if (movie._files) {
            if (movie._files.indexOf(file._id) === -1)
              movie._files.push(file._id);
          } else {
            movie._files = [file._id];
          }
          defer.resolve(movie);
        }
      });
  });

  return defer.promise;
};

module.exports.searchMovieByTitle = (title) => {
  const defer = q.defer();

  loadTMDBConfig().then(() => {
    tmdb.searchMovie({query: title, language: 'fr'}, (err, res) => {
      if (err || !res) {
        return defer.reject(err);
      }

      defer.resolve(res.results);
    });
  });

  return defer.promise;
};

module.exports.createProposalFromTMDBResult = (m, file = null) => {
  return new db.models.Proposal({
    title: m.title,
    originalTitle: m.original_title,
    date: m.release_date ? new Date(m.release_date) : null,
    overview: m.overview,
    poster: m.poster_path ? tmdbConfig.images.base_url + getSizeCloseTo('p', 154) + m.poster_path : null,
    tmdbId: m.id,
    _file: file ? file._id : null
  })
};

module.exports.linkMovieAndFile = (movie, file) => {
};

const loadTMDBConfig = () => {
  const defer = q.defer();

  if (tmdbConfig) {
    defer.resolve();
  } else {
    tmdb.configuration((err, res) => {
      tmdbConfig = res;
      defer.resolve();
    });
  }

  return defer.promise;
};

const createMovieFromTMDBResult = (m, file = null) => {
  const movie = new db.models.Movie({
    title: m.title,
    originalTitle: m.original_title,
    date: m.release_date ? new Date(m.release_date) : null,
    genres: _.map(m.genres, (v) => {
      return v.name;
    }),
    overview: m.overview,
    runtime: m.runtime,
    voteCount: m.vote_count,
    voteAverage: m.vote_average,
    budget: m.budget,
    revenue: m.revenue,
    posterThumb: m.poster_path ? tmdbConfig.images.base_url + getSizeCloseTo('p', 154) + m.poster_path : null,
    poster: m.poster_path ? tmdbConfig.images.base_url + getSizeCloseTo('p', 1000) + m.poster_path : null,
    backdrop: m.backdrop_path ? tmdbConfig.images.base_url + getSizeCloseTo('b', 2000) + m.backdrop_path : null,
    originalLanguage: m.original_language,
    countries: _.map(m.production_countries, (v) => {
      return v.iso_3166_1;
    }),

    cast: _.map(_.filter(m.credits.cast, (v) => {
      return v.order <= 15
    }), (v) => {
      return {
        tvdbId: v.id,
        name: v.name,
        character: v.character,
        image: v.profile_path ? tmdbConfig.images.base_url + getSizeCloseTo('c', 138) + v.profile_path : null
      }
    }),
    crew: _.map(_.filter(m.credits.crew, (v) => {
      return v.department === 'Directing' || v.department === 'Production';
    }), (v) => {
      return {
        tvdbId: v.id,
        name: v.name,
        job: v.job,
        image: v.profile_path ? tmdbConfig.images.base_url + getSizeCloseTo('c', 138) + v.profile_path : null
      }
    }),

    videos: _.map(m.videos.results, (v) => {
      return {
        id: v.id,
        lang: v.iso_639_1,
        key: v.key,
        name: v.name,
        site: v.site ? v.site.toLowerCase() : null,
        size: v.size,
        videoType: v.type
      }
    }),

    tmdbId: m.id,
    imdbId: m.imdb_id,
  });

  if (file) {
    file._movie = movie._id;
    movie._files = [file._id];
  }

  return movie;
};

const getSizeCloseTo = (type, width) => {
  switch (type) {
    case "p":
      type = "poster_sizes";
      break;
    case "b":
      type = "backdrop_sizes";
      break;
    case "c":
      type = "profile_sizes";
      break;
  }

  for (let s of tmdbConfig.images[type]) {
    if (parseInt(s.substr(1)) >= width) {
      return s;
    }
  }

  return 'original';
};