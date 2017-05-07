/**
 * Created by eygle on 4/27/17.
 */
const files = require("./modules/files");

files.synchronize().then(() => {
// TODO movies
// TODO tvshows

  // Q.allSettle
  files.save();
});