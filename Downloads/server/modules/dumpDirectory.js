/**
 * Created by eygle on 4/29/17.
 */

const fs = require("fs")
  , conf = require("../config/env");

module.exports.save = (data) => {
  fs.writeFileSync(conf.dumpFile, JSON.stringify(data));
};

module.exports.load = () => {
  if (!fs.existsSync(conf.dumpFile)) {
    return [];
  }

  const json = fs.readFileSync(conf.dumpFile);
  return json ? JSON.parse(json) : [];
};