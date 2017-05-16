/**
 * Created by eygle on 4/29/17.
 */
const passport = require("passport")
    , LocalStrategy = require('passport-local').Strategy
    , User = require('../app/models/User')
    , normalize = require('../modules/normalize');

exports.default = (app) => {
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login session

    // Login locally
    passport.use(new LocalStrategy(
        {passReqToCallback: true},
        (req, username, password, done) => {
            console.log("inside local strategy", username, password);
            this.local.findOne({$or: [{normalizeUserName: normalize(username)}, {email: username}]})
                .exec((err, user) => {
                    if (err || !user) {
                        return done(null, false, "FailedToLogin");
                    }

                    if (this.local.checkPassword(password)) {
                        return done(null, this.local.censure(user));
                    }
                    return done(null, false, "FailedToLogin");
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