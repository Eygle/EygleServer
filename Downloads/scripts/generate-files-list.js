/**
 * Created by eygle on 5/6/17.
 */

const db = require('./modules/db');
const files = require("./modules/files");

db.init(() => {
  files.synchronize();
  files.save();
});