/**
 * Created by eygle on 4/29/17.
 */

const resty = require('./modules/resty')
  , express = require('express')
  , conf = require('./config/env')
  , passport = require('passport')
  , Auth = require('./middlewares/Auth');

const serve = `${conf.root}/client`;

module.exports.default = (app) => {
  // Root is for client
  app.use('/', express.static(serve));

  // Define bower_components path
  app.use('/bower_components', express.static(`${conf.root}/../bower_components`));

  // Define Api entry point
  app.use('/api', resty.middleware(__dirname + '/app/api'));

  // Fallback to serve dir (when loading an anular route directly
  app.use('*', express.static(serve));

  // Auth routes
  app.post('/login', [Auth.login]);
  app.post('/register', [Auth.register]);
};

const prepareRequestUserCookie = (req, res) => {
  res.cookie('ED-USER', JSON.stringify({
    _id: req.user._id,
    email: req.user.email,
    userName: req.user.userName,
    valid: req.user.valid
  }));
};