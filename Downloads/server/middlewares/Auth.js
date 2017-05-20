/**
 * Created by eygle on 5/20/17.
 */

const passport = require('passport')
  , db = require('../modules/db')
  , emails = require('../modules/emails');

module.exports = {
  login: (req, res, next) => {
    if (!req.body.username || !req.body.password) {
      return res.status(403).json("No username or password provided");
    }

    passport.authenticate('local', function (err, user) {
      if (err) return res.status(401).json(err);

      module.exports.includeRequestUserCookie(req, res);
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
      if (err) return res.status(401).json(err);

      // emails.sendCheckEmail(user).then(() => {
        res.status(200).json({status: 'success'});
      // });
    });
  },

  checkEmail: (req, res) => {
    console.log(req);
  },

  includeRequestUserCookie: (req, res) => {
    const u = req.user;

    const string = JSON.stringify({
      _id: u._id,
      email: u.email,
      userName: u.userName,
      roles: u.roles,
      validMail: u.validMail
    });

    if (!req.cookies || (req.cookies['ED-USER'] !== string)) {
      res.cookie('ED-USER', string);
    }
  }
};