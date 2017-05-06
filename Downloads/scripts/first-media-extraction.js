/**
 * Created by eygle on 5/6/17.
 */
const prompt = require('prompt'),
  medias = require("./modules/medias")
  , newFiles = require("../server/modules/dumpDirectory").load()
  , movies = require("./modules/movies")
  , db = require('../server/modules/db');

medias.loadFromFilesList(newFiles);

prompt.start();
const promptSchema = {
  properties: {
    confirm: {
      pattern: /^(y|Y|n|N|yes|Yes|no|No)?$/,
      message: 'Simply type y or n (default y)'
    }
  }
};

const processMovies = (list) => {
  if (list.length > 0) {
    const m = list.shift();
    console.info("Process " + m.filename);
    prompt.get(promptSchema, (err, res) => {
      if (!res.confirm || ['y', 'yes'].indexOf(res.confirm.toLowerCase()) !== -1) {
        movies.process(m, () => {
          processMovies(list);
        });
      } else {
        console.info("  Skipped");
        processMovies(list);
      }
    });
  } else {
    process.exit();
  }
};

db.init(() => {
  processMovies(medias.getMovies());
});