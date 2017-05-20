/**
 * Created by eygle on 5/20/17.
 */

const passport = require('passport'),
  db = require('../modules/db');

module.exports = {
  login: (req, res, next) => {
    if (!req.body.username || !req.body.password) {
      return res.status(403).json("No username or password provided");
    }

    passport.authenticate('local', function (err, user) {
      if (err) return res.status(401).json(err);

      module.exports.includeRequestUserCookie(req, res, user);
      res.status(200).json({status: 'success'});
    })(req, res, next);
  },

  register: (req, res, next) => {
    const user = new db.models.User({
      email: req.body.email,
      password: req.body.password,
      userName: req.body.userName,
      desc: req.body.desc
    });

    user.save((err) => {
      if (err)
        res.status(401).json(err);
      else
        res.status(200).json({status: 'success'});
    });
  },

  includeRequestUserCookie: (req, res, user) => {
    const u = req.user || user;
    res.cookie('ED-USER', JSON.stringify({
      _id: u._id,
      email: u.email,
      userName: u.userName,
      roles: u.roles
    }));
  }
};