/**
 * Created by eygle on 4/27/17.
 */
const files = require("./modules/files")
  , medias = require("./modules/medias");

files.synchronize();

medias.loadFromFilesList(files.getNew());

//files.save();