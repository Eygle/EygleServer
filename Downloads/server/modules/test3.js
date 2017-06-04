/**
 * Created by eygle on 6/4/17.
 */

module.exports = {
  log: (...args) => {
    console.log.apply(this, args);
  }
};