/**
 * Created by eygle on 4/27/17.
 */
const q = require('q')
  , files = require('./modules/files')
  , movies = require('./modules/movies')
  , tvshows = require('./modules/tvShows')
  , db = require('../server/modules/db')
  , logger = require('./modules/logger');

const interval = 10000; // milliseconds

function process() {
  const start = Date.now();

  files.synchronize().then(() => {
    q.allSettled([
      movies.processAll(files.getMovies()),
      tvshows.processAll(files.getTVShows())
    ]).then(() => {
      files.saveNewFiles().then(() => {
        files.save();

        const duration = Date.now() - start;
        if (duration >= interval) {
          process();
        } else {
          logger.log(`wait ${Math.round((interval - duration) / 1000)} seconds`);
          setTimeout(process, interval - duration);
        }
      });
    });
  });
}

db.init(() => {
  process();
});