/**
 * Created by eygle on 5/13/17.
 */

const _ = require('underscore')
  , movies = require('../../../modules/movies');

module.exports = {
  Resource: {
    get: function (term, callback) {
      movies.searchMovieByTitle(term).then(res => {
        callback(null, movies.createAutocompleteFromTMDBResults(res));
      }).catch(err => {
        callback(500, err);
      });
    }
  },

  Collection: {}
};