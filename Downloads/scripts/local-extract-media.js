/**
 * Created by eygle on 5/7/17.
 */
const q = require('q')
  , files = require('./modules/files')
  , movies = require('./modules/movies')
  , tvshows = require('./modules/tvShows')
  , db = require('../server/modules/db')
  , conf = require('../server/config/env');

conf.env = 'development';

db.init(() => {
  files.synchronize().then(() => {
    q.allSettled([
      movies.processAll(files.getMovies())
    ]).then(() => {
      process.exit();
    });
  });
});