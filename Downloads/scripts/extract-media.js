/**
 * Created by eygle on 4/27/17.
 */
const q = require('q')
  , files = require('./modules/files')
  , movies = require('./modules/movies')
  , tvshows = require('./modules/tvShows')
  , db = require('../server/modules/db');

db.init(() => {
  files.synchronize().then(() => {
    q.allSettled([
      movies.processAll(files.getMovies()),
      tvshows.processAll(files.getTVShows())
    ]).then(() => {
      console.log("save files");
      files.saveNewFiles().then(() => process.exit());
    });
  });
});