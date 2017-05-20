/**
 * Created by eygle on 5/20/17.
 */

const Auth = require('./Auth');

module.exports = (req, res, next) => {
  Auth.includeRequestUserCookie(req, res);

  if (!req.user || !req.user.roles || req.user.roles[0] === 'public') {
    return res.status(401).json("Unauthorized");
  }

  next();
};