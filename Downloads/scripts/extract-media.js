/**
 * Created by eygle on 4/27/17.
 */
const q = require('q')
  , files = require('./modules/files')
  , movies = require('./modules/movies')
  , tvshows = require('./modules/tvShows')
  , db = require('../server/modules/db');

const interval = 10000; // milliseconds

function process() {
  const start = Date.now();

  files.synchronize().then(() => {
    files.save();

    // q.allSettled([
    //   movies.processAll(files.getMovies()),
    //   tvshows.processAll(files.getTVShows())
    // ]).then(() => {
    //   console.log("save files");
    //   files.saveNewFiles().then(() => process.exit());
    // });

    const duration = Date.now() - start;
    if (duration >= interval) {
      process();
    } else {
      console.log(`wait ${Math.round((interval - duration) / 1000)} seconds`);
      setTimeout(process, interval - duration);
    }
  });
}

db.init(() => {
  process();
});