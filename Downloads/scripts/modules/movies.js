/**
 * Created by eygle on 5/6/17.
 */

const _ = require('underscore')
  , tmdb = require('moviedb')("22e2817ba73ca94f0b3971f847acefc6")
  , normalize = require('../../server/modules/normalize')
  , files = require('./files')
  , db = require('../../server/modules/db');

let tmdbConfig = null;

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

const createMovieFromFileNTMDB = (file, m) => {
  return new db.models.Movie({
    title: m.title,
    originalTitle: m.original_title,
    date: new Date(m.release_date),
    genres: _.map(m.genres, (v) => {
      return v.name;
    }),
    overview: m.overview,
    runtime: m.runtime,
    voteCount: m.vote_count,
    voteAverage: m.vote_average,
    budget: m.budget,
    revenue: m.revenue,
    poster: m.poster_path ? tmdbConfig.images.base_url + getSizeCloseTo('p', 154) + m.poster_path : null,
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
        image: v.profile_path ? tmdbConfig.images.base_url + getSizeCloseTo('c', 45) + v.profile_path : null
      }
    }),
    crew: _.map(_.filter(m.credits.crew, (v) => {
      return v.department === 'Directing' || v.department === 'Production';
    }), (v) => {
      return {
        tvdbId: v.id,
        name: v.name,
        job: v.job,
        image: v.profile_path ? tmdbConfig.images.base_url + getSizeCloseTo('c', 45) + v.profile_path : null
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

    language: file.info.language,
    resolution: file.info.resolution,
    repack: file.info.repack,
    quality: file.info.quality,
    proper: file.info.proper,
    hardcoded: file.info.hardcoded,
    extended: file.info.extended,
    codec: file.info.codec,
    audio: file.info.audio,
    group: file.info.group,
    excess: file.info.excess
  });
};

const fetchAllMovieInfo = (f, id, callback) => {
  db.models.Movie.findOne({tmdbId: id})
    .exec((err, item) => {
      if (err || !item) {
        tmdb.movieInfo({id: id, language: 'fr', append_to_response: 'credits,videos'}, (err, res) => {
          const file = new db.models.File({
            filename: f.filename,
            ext: f.extname,
            size: f.size,
            path: f.path,
            normalized: normalize(f.filename),
          });
          const movie = createMovieFromFileNTMDB(f, res);

          file._movie = movie._id.valueOf();
          movie._file = file._id.valueOf();

          file.save(err => {
            if (err)
              console.error(err);
            else
              console.info('  File added');
            movie.save(err => {
              if (err)
                console.error(err);
              else
                console.info('  Movie added');
              callback();
            });
          });
        });
      } else {
        console.info('  Already exists');
      }
    });
};

const saveProposals = (results, callback) => {
  if (results.length && results[0]) {
    const p = shift(results);
    saveProposals(results, callback);
  } else {
    console.info("   Multi results add as proposals", res.results);
    callback();
  }
};

const searchMovieByTitle = (file, callback) => {
  tmdb.searchMovie({query: file.info.title, language: 'fr'}, (err, res) => {
    if (err || !res || !res.results || res.results.length === 0) {
      console.info("  No results");
      callback();
    } else if (res.results.length === 1) {
      fetchAllMovieInfo(file, res.results[0].id, callback);
    } else {
      if (file.info.year) {
        for (let r of res.results) {
          if (r.release_date && new Date(r.release_date).getFullYear() === file.info.year) {
            fetchAllMovieInfo(file, res.results[0].id, callback);
            return;
          }
        }
      }

      saveProposals(res.results, callback);
    }
  });
};

/**
 * Process a list of movies
 * @param files
 * @param callback
 */
module.exports.processAll = (files, callback) => {
  if (files.length > 0) {
    module.exports.process(files.shift(), () => {
      module.exports.processAll(files);
    });
  } else {
    callback();
  }
};

/**
 * Process a single movie
 * Step 1: find the movie using TheMovieDB
 * Step 2: fetch all useful info for the movie
 * Step 3: execute callback
 * @param file
 * @param callback
 */
module.exports.process = (file, callback) => {
  if (!tmdbConfig) {
    tmdb.configuration((err, res) => {
      tmdbConfig = res;
      searchMovieByTitle(file, callback);
    });
  } else {
    searchMovieByTitle(file, callback);
  }
};