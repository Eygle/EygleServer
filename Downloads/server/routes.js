/**
 * Created by eygle on 4/29/17.
 */

const resty = require('resty')
    , express = require('express')
    , path = require('path')
    , conf = require('./config/env')
  , serve = path.join(conf.root, 'client');

module.exports.default = (app) => {
    // Root is for client
    app.use('/', express.static(serve));

    // Define bower_components path
    app.use('/bower_components', express.static(path.join(conf.root, '../bower_components')));

    // Define Api entry point
    app.use('/api', resty.middleware(__dirname + '/app/api'));

    // Fallback to serve dir (when loading an angular route directly
    app.use('*', express.static(serve));
};