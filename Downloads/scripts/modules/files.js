/**
 * Created by eygle on 5/6/17.
 */

const _ = require("underscore")
  , path = require("path")
  , dump = require("../../server/modules/dumpDirectory")
  , conf = require("../../server/config/env")
  , filesToAdd = []
  , filesToDelete = [];

let files;

/**
 * Compare current list of file with old list of files (from dump)
 * @param autoDelete if true then delete all files that are not present anymore
 */
module.exports.synchronize = (autoDelete = true) => {
  files = require("../../server/modules/listDirectory")(conf.downloadsDir);
  const previous = dump.load();

  for (let f of files) {
    const idx = _.findIndex(previous, {filename: f.filename, size: f.size, parent: f.parent});

    if (idx === -1) {
      filesToAdd.push(f);
    } else {
      filesToDelete.push(f);
    }
  }

  if (autoDelete) {
    module.exports.deleteFromDB();
  }
};

/**
 * Delete all filesToDelete from database (mark file as deleted AND matching Movie or Episode)
 */
module.exports.deleteFromDB = () => {
  for (let i in filesToDelete) {
    // TODO find in database and mark as deleted (move and episode too)
    filesToDelete.splice(i, 1);
  }
};

/**
 * Check if file is a video using it's extension
 * @param filename
 * @returns {boolean}
 */
module.exports.isVideo = (filename) => {
  const videoExtensions = [".avi", ".mkv", ".webm", ".flv", ".vob", ".ogg", ".ogv", ".mov", ".qt",
    ".wmv", ".mp4", ".m4p", ".m4v", ".mpg", ".mp2", ".mpeg", ".mpe", ".mpv"];
  return videoExtensions.indexOf(path.extname(filename)) !== -1;
};

/**
 * Return the full list of files
 * @returns {*}
 */
module.exports.getAll = () => {
  return files;
};

/**
 * Return only new files
 * @returns {Array}
 */
module.exports.getNew = () => {
  return filesToAdd;
};

/**
 * Save list of files
 */
module.exports.save = () => {
  dump.save(files);
};