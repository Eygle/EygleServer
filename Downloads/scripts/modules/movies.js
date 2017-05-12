/**
 * Created by eygle on 5/6/17.
 */

const q = require('q')
  , movies = require('../../server/modules/movies')
  , db = require('../../server/modules/db');

let processed = 0, total = false;
let minDuration = 250 * 2; // ms

/**
 * Process a list of movies
 * @param list
 */
module.exports.processAll = (list) => {
  const defer = q.defer();
  let startTime = Date.now();

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
      const duration = Date.now() - startTime;
      if (duration < minDuration) {
        setTimeout(() => {
          module.exports.processAll(list).then(() => defer.resolve());
        }, minDuration - duration);
      } else {
        module.exports.processAll(list).then(() => defer.resolve());
      }
    });
  } else {
    console.log("End of movies");
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
    searchMovieByFile(file, callback);
  } else {
    console.log('  Skipped: no exploitable title');
    callback();
  }
};

const searchMovieByFile = (file, callback) => {
  movies.searchMovieByTitle(file.info.title).then(results => {
    if (results.length === 0) {
      callback();
    } else if (results.length === 1) {
      fetchInfoAndSave(file, results[0].id, callback);
    } else {
      if (file.info.year) {
        for (let m of results) {
          if (m.release_date && new Date(m.release_date).getFullYear() === file.info.year) {
            fetchInfoAndSave(file, m.id, callback);
            return;
          }
        }
      }

      saveProposals(results, file, callback);
    }
  }).catch(err => {
    console.error(err);
    callback();
  });
};

const fetchInfoAndSave = (file, id, callback) => {
  movies.fetchMovie(id, file.File).then((movie) => {
    file.File.save(err => {
      if (err)
        console.error(err);
      movie.save(err => {
        if (err) return console.error(err);
        console.info(movie._files.length === 1 ? '  Movie added' : `  Linked to existed movie ${movie.title}`);
        callback();
      });
    });
  }).catch(err => {
    console.error(err);
    callback();
  });
};

const saveProposals = (results, file, callback) => {
  if (results.length && results[0]) {
    const proposal = movies.createProposalFromTMDBResult(results.shift(), file.File);
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