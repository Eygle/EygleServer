/**
 * Created by eygle on 5/6/17.
 */

const _ = require("underscore")
  , tvShows = [];

const mergeTVShowsLists = (tvShows, other) => {
  console.log(util.inspect(tvShows, false, null));
  console.log(util.inspect(other, false, null));

  let hasMerged = false;
  for (let o of other) {
    const show = _.findWhere(tvShows, {title: o.title});
    if (!show) {
      tvShows.push(o);
    } else {
      for (let s in o.seasons) {
        if (o.seasons.hasOwnProperty(s)) {
          console.log(util.inspect(o.seasons[s], false, null));
          if (show.seasons.hasOwnProperty(s)) {
            show.seasons[s] = show.seasons[s].concat(o.seasons[s]);
            hasMerged = true;
            process.exit();
          } else {
            show.seasons[s] = o.seasons[s];
          }
        }
      }
    }
  }
  if (hasMerged) {
    console.log(util.inspect(other, false, null));
    process.exit();
  }
};

/**
 * Load
 * @param files
 */
module.exports.loadFromList = (files) => {
  for (let f of files) {
    const show = _.findWhere(tvShows, {title: f.info.title.toLowerCase()}) || {};
    if (!show.title) {
      show.title = f.info.title.toLowerCase();
      show.seasons = {};
      tvShows.push(show);
    }

    if (show.seasons[info.season]) {
      // show.seasons[info.season].push(f); // TODO uncomment
      show.seasons[info.season].push(f.filename); // TODO rm (test)
    } else {
      // show.seasons[info.season] = [f]; // TODO uncomment
      show.seasons[info.season] = [f.filename]; // TODO rm (test)
    }
  }
};

/**
 * Return TVShows list
 * @returns {Array}
 */
module.exports.getList = () => {
  return tvShows;
};