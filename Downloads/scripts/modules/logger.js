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
      tvShowLogger.log.apply(...arguments);
    },
    info: (...args) => {
      tvShowLogger.info.apply(...arguments);
    },
    error: (...args) => {
      tvShowLogger.error.apply(...arguments);
    }
  },

  movie: {
    log: (...args) => {
      movieLogger.log.apply(...arguments);
    },
    info: (...args) => {
      movieLogger.info.apply(...arguments);
    },
    error: (...args) => {
      movieLogger.error.apply(...arguments);
    }
  },

  log: (...args) => {
    defaultLogger.log.apply(...arguments);
  },

  info: (...args) => {
    defaultLogger.info.apply(...arguments);
  },

  error: (...args) => {
    defaultLogger.error.apply(...arguments);
  }
};