/**
 * Created by eygle on 6/4/17.
 */

const tracer = require('tracer');

const movieLogger = tracer.dailyfile({root: '/home/eygle/logs', maxLogFiles: 10, allLogsFileName: 'movies-extract'});
const tvShowLogger = tracer.dailyfile({root: '/home/eygle/logs', maxLogFiles: 10, allLogsFileName: 'tv-shows-extract'});
const defaultLogger = tracer.dailyfile({root: '/home/eygle/logs', maxLogFiles: 10, allLogsFileName: 'media-extract'});

module.exports = {
  tvshow: {
    log: (...args) => {
      tvShowLogger.log.apply(this, args);
    },
    info: (...args) => {
      tvShowLogger.info.apply(this, args);
    },
    error: (...args) => {
      tvShowLogger.error.apply(this, args);
    }
  },

  movie: {
    log: (...args) => {
      movieLogger.log.apply(this, args);
    },
    info: (...args) => {
      movieLogger.info.apply(this, args);
    },
    error: (...args) => {
      movieLogger.error.apply(this, args);
    }
  },

  log: (...args) => {
    defaultLogger.log.apply(this, args);
  },

  info: (...args) => {
    defaultLogger.info.apply(this, args);
  },

  error: (...args) => {
    defaultLogger.error.apply(this, args);
  }
};