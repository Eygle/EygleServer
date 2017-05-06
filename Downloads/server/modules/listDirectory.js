/**
 * Created by eygle on 4/27/17.
 */
const fs = require("fs");
const path = require("path");

const listDirectory = (dir, parent = null, filePath = null) => {
  const files = fs.readdirSync(dir);
  const list = [];

  for (let f of files) {
    const filename = path.join(dir, f);
    const stats = fs.statSync(filename);
    const file = {
      filename: f,
      isDirectory: stats.isDirectory(),
      parent: parent,
      mtime: stats.mtime,
      path: filePath
    };
    if (stats.isDirectory()) {
      file.children = listDirectory(filename, f, filePath ? filePath + '/' + f.filename : f.filename);
      file.size = calculateDirectorySize(file.children);
    } else {
      file.extname = path.extname(f);
      file.size = stats.size;
    }
    list.push(file);
  }
  return list;
};

const calculateDirectorySize = (files) => {
  let size = 0;

  for (let f of files) {
    size += f.size;
  }

  return size;
};

module.exports = (dir) => {
  if (fs.existsSync(dir)) {
    const stats = fs.statSync(dir);
    if (stats.isDirectory()) {
      return listDirectory(dir);
    } else {
      return false;
    }
  } else {
    return false;
  }
};