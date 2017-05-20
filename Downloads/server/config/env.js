/**
 * Created by eygle on 4/29/17.
 */

const path = require('path')
  , localProperties = require('../localProperties');

module.exports = {
  env: process.env.NODE_ENV || 'production',

  // Server port
  port: process.env.PORT || 4242,

  host: localProperties.host,

  // Application database
  db: localProperties.db,

  // Root path of server
  root: path.normalize(`${__dirname}/../../`),

  secrets: {
    session: localProperties.session,
    TVDB: localProperties.tvdb,
    TMDB: localProperties.tmdb
  },

  gmail: localProperties.gmail,

  // Directory containing all downloaded files
  downloadsDir: localProperties.dlPath,

  // File with a JSON representation of the downloadsDir architecture
  dumpFile: path.normalize(`${__dirname}/../../scripts/list-of-files.json`)
};