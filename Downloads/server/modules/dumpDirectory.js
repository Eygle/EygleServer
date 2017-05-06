/**
 * Created by eygle on 4/29/17.
 */

const fs = require("fs")
  , conf = require("../config/env");

module.exports.save = (data) => {
  fs.writeFileSync(conf.dumpFile, JSON.stringify(data));
};

module.exports.load = (dump = null) => {
  if (!dump) {
    dump = conf.dumpFile;
  }

  if (!fs.existsSync(dump)) {
    return [];
  }

  const json = fs.readFileSync(dump);
  return json ? JSON.parse(json) : [];
};