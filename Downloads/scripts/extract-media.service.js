/**
 * Created by eygle on 6/4/17.
 */

const db = require('../server/modules/db');

const interval = 30000; // milliseconds

function process() {
  const start = Date.now();

  require('./extract-media');

  const rest = Date.now() - start;
  if (rest >= interval) {
    process();
  } else {
    setTimeout(process, rest);
  }
}

db.init(() => {
  process();
});