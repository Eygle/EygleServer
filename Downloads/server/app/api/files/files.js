/**
 * Created by eygle on 4/29/17.
 */

const listDirectory = require("../../../modules/listDirectory")
  , dump = require("../../../modules/dumpDirectory")
  , conf = require("../../../config/env");

module.exports = {
  Collection: {
    get: function (callback) {
      if (conf.env === "development") {
        callback(null, dump.load());
      } else {
        callback(null, listDirectory(conf.downloadsDir));
      }
    }
  }
};