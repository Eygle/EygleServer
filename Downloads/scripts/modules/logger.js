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
      tvShowLogger.log(...arguments);
    },
    info: (...args) => {
      tvShowLogger.info(...arguments);
    },
    error: (...args) => {
      tvShowLogger.error(...arguments);
    }
  },

  movie: {
    log: (...args) => {
      movieLogger.log(...arguments);
    },
    info: (...args) => {
      movieLogger.info(...arguments);
    },
    error: (...args) => {
      movieLogger.error(...arguments);
    }
  },

  log: (...args) => {
    defaultLogger.log(...arguments);
  },

  info: (...args) => {
    defaultLogger.info(...arguments);
  },

  error: (...args) => {
    defaultLogger.error(...arguments);
  }
};