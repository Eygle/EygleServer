/**
 * Created by eygle on 5/6/17.
 */

const _ = require('underscore')
  , q = require('q')
  , tmdb = require('moviedb')("22e2817ba73ca94f0b3971f847acefc6")
  , db = require('../../server/modules/db');

let tmdbConfig = null, processed = 0, total = false;

/**
 * Process a list of movies
 * @param list
 */
module.exports.processAll = (list) => {
  const defer = q.defer();

  if (processed === 0) {
    console.log("Start processing Movies...");
    total = list.length;
  }
  if (list.length > 0) {
    const file = list.shift();
    const filename = file.path ? file.path + '/' + file.info.title : file.info.title;
    console.log(`Process [${processed + 1}/${total}]: ${filename}`);
    module.exports.process(file, () => {
      processed++;
      setTimeout(() => {
        module.exports.processAll(list);
      }, 1000);
    });
  } else {
    defer.resolve();
  }

  return defer.promise;
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
  if (file.info.title) {
    if (!tmdbConfig) {
      tmdb.configuration((err, res) => {
        tmdbConfig = res;
        searchMovieByTitle(file, callback);
      });
    } else {
      searchMovieByTitle(file, callback);
    }
  } else {
    callback();
  }
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

const createMovieFromFileNTMDB = (m) => {
  return new db.models.Movie({
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
};

const createProposal = (m, file) => {
  return new db.models.Proposal({
    title: m.title,
    originalTitle: m.original_title,
    date: m.release_date ? new Date(m.release_date) : null,
    overview: m.overview,
    poster: m.poster_path ? tmdbConfig.images.base_url + getSizeCloseTo('p', 154) + m.poster_path : null,
    tmdbId: m.id,
    _file: file.File._id
  });
};

const fetchAllMovieInfo = (file, id, callback) => {
  db.models.Movie.findOne({tmdbId: id})
    .exec((err, item) => {
      if (err || !item) {
        // Create a new movie with all info
        tmdb.movieInfo({id: id, language: 'fr', append_to_response: 'credits,videos'}, (err, res) => {
          const movie = createMovieFromFileNTMDB(res);

          file.File._movie = movie._id;
          if (movie._files) {
            movie._files.push(file.File._id);
          } else {
            movie._files = [file.File._id];
          }

          file.File.save(err => {
            if (err)
              console.error(err);
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
        if (item._files) {
          item._files.push(file.File._id);
        } else {
          item._files = [file.File._id];
        }
        console.info(`  Linked to existed movie ${item.title}`);
        callback();
      }
    });
};

const saveProposals = (results, file, callback) => {
  if (results.length && results[0]) {
    const proposal = createProposal(results.shift(), file);
    proposal.save(err => {
      if (err)
        console.error(err);
      const year = proposal.date ? ' (' + proposal.date.getFullYear() + ')' : '';
      console.info(`   Add proposal: ${proposal.title}${year}`);
      saveProposals(results, file, callback);
    });
  } else {
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

      saveProposals(res.results, file, callback);
    }
  });
};