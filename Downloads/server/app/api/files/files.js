/**
 * Created by eygle on 4/29/17.
 */

const db = require('../../../modules/db');

module.exports = {
  Collection: {
    get: function (callback) {
      db.models.File.find({deleted: false})
        .select({_parent: 1, filename: 1, _movie: 1, _tvshow: 1, mtime: 1, size: 1, ext: 1, directory: 1})
        .sort({mtime: -1})
        .exec((err, items) => {
          if (err) return callback(500, {error: err});
          callback(null, createHierarchy(items));
        });
    }
  }
};

const createHierarchy = (files, parent = null) => {
  const root = [];

  for (let i in files) {
    if (files.hasOwnProperty(i)) {
      let f = files[i];
      if ((f._parent && f._parent.equals(parent)) || (f._parent === parent)) {
        if (f.directory) {
          f = f.toObject();
          f.children = createHierarchy(files, files[i]._id);
        }
        root.push(f);
        delete files[i];
      }
    }
  }

  return root.length > 0 ? root : null;
};