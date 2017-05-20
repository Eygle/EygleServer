/**
 * Created by eygle on 4/29/17.
 */
const passport = require("passport")
  , LocalStrategy = require('passport-local').Strategy
  , db = require('../modules/db')
  , User = require('../app/models/User')
  , normalize = require('../modules/normalize');

exports.default = (app) => {
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login session

  // Login locally
  passport.use(new LocalStrategy({
    passReqToCallback: true
  }, (req, username, password, done) => {
    console.log("Inside passport local strategy");
    db.models.User.findOne()
      .or([
        {email: username},
        {userNameNorm: normalize(username)}
      ])
      .select('+password')
      .exec((err, user) => {
        if (err) return done(err);
        if (!user) {
          return done("Invalid username or email");
        }
        if (!user.checkPassword(password)) {
          return done("Invalid password");
        }

        req.login(user, function (err) {
          if (err) return done(err);
          done(null, user);
        });
      });
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  }, {passReqToCallback: true});
};