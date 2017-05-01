/**
 * Created by eygle on 4/27/17.
 */
const fs = require("fs")
  , _ = require("underscore")
  , ptn = require('parse-torrent-name')
  , util = require("util")
  , path = require("path")
  , dump = require("../server/modules/dumpDirectory")
  , conf = require("../server/config/env");

const extractFilesList = () => {
  let files = require("../server/modules/listDirectory")(conf.downloadsDir);
  const previous = dump.load();
  const toAdd = [];
  const toDelete = [];

  for (let f of files) {
    const idx = _.findIndex(previous, {filename: f.filename, size: f.size, parent: f.parent});

    if (idx === -1) {
      toAdd.push(f);
    } else {
      toDelete.push(f);
    }
  }

  return {files: files, toAdd: toAdd, toDelete: toDelete};
};

const removeFilesFromDatabase = (files) => {
  for (let f of files) {
    // TODO find in database and mark as deleted
  }
};

const isVideo = (filename) => {
  const videoExtensions = [".avi", ".mkv", ".webm", ".flv", ".vob", ".ogg", ".ogv", ".mov", ".qt",
    ".wmv", ".mp4", ".m4p", ".m4v", ".mpg", ".mp2", ".mpeg", ".mpe", ".mpv"];
  return videoExtensions.indexOf(path.extname(filename)) !== -1;
};

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

const groupTVShowAndMovies = (files, parents = null) => {
  const tvShows = [];
  let movies = [];

  for (let f of files) {
    if (isVideo(f.filename)) {
      const info = ptn(f.filename);

      if (info.season) {
        const show = _.findWhere(tvShows, {title: info.title.toLowerCase()}) || {};
        if (!show.title) {
          show.title = info.title.toLowerCase();
          show.seasons = {};
          tvShows.push(show);
        }

        if (show.seasons[info.season]) {
          show.seasons[info.season].push(f.filename); // TODO add all info
        } else {
          show.seasons[info.season] = [f.filename]; // TODO add all info
        }
      } else {
        movies.push([f.filename, info]); // TODO add all info
      }
    } else if (f.isDirectory) {
      const [dirTvShows, dirMovies] = groupTVShowAndMovies(f.children, parents ? parents.concat(f.filename) : [f.filename]);
      mergeTVShowsLists(tvShows, dirTvShows);
      movies = movies.concat(dirMovies);
    }
    // else {
    //     console.log("Not a video", f.filename);
    // }
  }

  return [tvShows, movies];
};

const extractMediaFromFiles = (files) => {
  const [tvShows, movies] = groupTVShowAndMovies(files);

  console.log(util.inspect(tvShows, false, null));
  console.log(movies);
};

// Execute script
// const {files, toAdd, toDelete} = extractFilesList();
const toAdd = dump.load();
extractMediaFromFiles(toAdd);
// removeFilesFromDatabase(toDelete);
// dump.save(files);