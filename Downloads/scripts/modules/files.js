/**
 * Created by eygle on 5/6/17.
 */

const _ = require("underscore")
  , path = require("path")
  , ptn = require('parse-torrent-name')
  , q = require('q')
  , normalize = require('../../server/modules/normalize')
  , dump = require("../../server/modules/dumpDirectory")
  , db = require("../../server/modules/db")
  , conf = require("../../server/config/env")
  , filesToAdd = []
  , filesToDelete = []
  , movies = []
  , tvShows = [];

let files
  , added = 0
  , deleted = 0;



/**
 * Compare current list of file with old list of files (from dump)
 * Add all new files and directory with parse-torrent-name info is available
 */
module.exports.synchronize = () => {
  const defer = q.defer();

  files = conf.env === 'development' ? dump.load() : require("../../server/modules/listDirectory")(conf.downloadsDir);
  const previous = conf.env === 'development' ? [] : dump.load();

  for (let f of files) {
    const idx = _.findIndex(previous, {filename: f.filename, size: f.size, parent: f.parent});

    if (idx === -1) {
      filesToAdd.push(f);
    } else {
      filesToDelete.push(f);
    }
  }

  q.allSettled([processFiles(filesToAdd), deleteFromDB()]).then(() => {
    console.log(`${deleted} files deleted !`);
    defer.resolve();
  });

  return defer.promise;
};

module.exports.saveNewFiles = () => {
  const defer = q.defer();

  saveAllFiles(filesToAdd).then(() => {
    console.log(`${added} files added !`);
    defer.resolve();
  });

  return defer.promise;
};

const saveAllFiles = (files) => {
  const defer = q.defer();
  const promises = [];

  for (let f of files) {
    if (!f.File._movie) {
      const deferFile = q.defer();
      promises.push(deferFile.promise);
      f.File.save(() => {
        deferFile.resolve();
      });
    }
    if (f.directory && f.children) {
      promises.push(saveAllFiles(f.children));
    }
  }

  if (promises.length) {
    q.allSettled(promises).then(() => {
      defer.resolve();
    });
  } else {
    defer.resolve();
  }

  return defer.promise;
};

/**
 * For each toAdd file or directory:
 * - Feed info from parse-torrent-name if is a video
 * - identify it as movie, tvshow or other
 * - Save in database (whether or not it's a video, including directories)
 * - If it's a directory then we call it recursively
 * @param list of files
 * @param parent File
 * @param path
 */
const processFiles = (list, parent = null) => {

  for (let f of list) {
    f.File = createDocument(f, parent);
    if (f.directory) {
      if (f.children) {
        processFiles(f.children, f.File);
      }
    } else {
      if (isVideo(f.filename)) {
        if (!f.info) {
          f.info = ptn(f.filename);
        }
        if (!f.info.title) continue;

        const fullPath = f.path ? `${f.path}/${f.filename}` : f.filename;
        if (isTVShow(fullPath)) {
          if (f.info.hasOwnProperty('episode') && f.info.hasOwnProperty('season'))
          tvShows.push(f);
        }
        else
          movies.push(f);
      }
    }

    added++;
  }
};

const createDocument = (file, parent) => {
  return new db.models.File({
    filename: file.filename,
    ext: file.extname,
    size: file.size,
    path: file.path,
    mtime: new Date(file.mtime),
    normalized: normalize(file.filename),
    directory: file.directory,
    _parent: parent ? parent._id : null,
    mediaInfo: file.info
  });
};

/**
 * Delete all filesToDelete from database (mark file as deleted AND matching Movie or Episode)
 */
const deleteFromDB = () => {
  const defer = q.defer();

  for (let i in filesToDelete) {
    // TODO find in database and mark as deleted (move and episode too)
    filesToDelete.splice(i, 1);
  }
  defer.resolve();

  return defer.promise;
};

/**
 * Check if file is a video using it's extension
 * @param filename
 * @returns {boolean}
 */
const isVideo = (filename) => {
  const videoExtensions = [".avi", ".mkv", ".webm", ".flv", ".vob", ".ogg", ".ogv", ".mov", ".qt",
    ".wmv", ".mp4", ".m4p", ".m4v", ".mpg", ".mp2", ".mpeg", ".mpe", ".mpv"];
  return videoExtensions.indexOf(path.extname(filename)) !== -1;
};

const isTVShow = (path) => {
  const files = path.split('/');

  for (let i = files.length - 1; i >= 0; i--) {
    const info = ptn(files[i]);
    if (info.season || info.episode)
      return true;
  }

  const r = /(seasons?|saisons?)/i;
  return files.length > 1 && files[files.length - 2].match(r);

};

/**
 * Return the full list of files
 * @returns {*}
 */
module.exports.getAll = () => {
  return files;
};

/**
 * Return only movies hierarchy
 * @returns {Array}
 */
module.exports.getMovies = () => {
  return movies;
};

/**
 * Return only tv shows hierarchy
 * @returns {Array}
 */
module.exports.getTVShows = () => {
  return tvShows;
};

/**
 * Save list of files
 */
module.exports.save = () => {
  dump.save(files);
};