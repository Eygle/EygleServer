/**
 * Created by eygle on 5/20/17.
 */

const q = require('a')
  , db = require('./db');

module.exports = {
  load: () => {
    const defer = q.defer();

    db.models.Config
      .find()
      .exec();

    return defer.promise;
  }
};