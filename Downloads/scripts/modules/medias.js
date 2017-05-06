/**
 * Created by eygle on 5/6/17.
 */

const ptn = require('parse-torrent-name')
  , files = require('./files')
  , tvShows = []
  , movies = []
  , misc = [];

/**
 * Load and separate movies, tvshows and other (misc) from list of files
 * @param list
 */
module.exports.loadFromFilesList = (list) => {
  for (let f of list) {
    if (files.isVideo(f.filename)) {
      if (!f.info) {
        f.info = ptn(f.filename);
      }

      if (f.info.title) {
        if (f.info.season || f.info.episode) {
          tvShows.push(f);
        } else {
          movies.push(f);
        }
      } else {
        misc.push(f);
      }
    } else {
      misc.push(f);
    }
  }
};

/**
 * Return movies list
 * @returns {Array}
 */
module.exports.getMovies = () => {
  return movies;
};

/**
 * Return TVShows list
 * @returns {Array}
 */
module.exports.getTvShows = () => {
  return tvShows;
};

/**
 * Return misc list (not videos)
 * @returns {Array}
 */
module.exports.getMisc = () => {
  return misc;
};