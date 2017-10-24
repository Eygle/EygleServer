import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';
import * as _ from 'underscore';

import Utils from '../config/Utils';
import {CustomEdError, EdError} from '../config/EdError';
import Emails from '../modules/Emails';
import User from '../schemas/User.schema';
import Permission from '../modules/Permissions';
import {EEnv, EHTTPStatus} from "../typings/enums";

class Auth {
   /**
    * Users login attempts failed
    */
   private _attempts: _.Dictionary<ILoginAttempt>;

   constructor() {
      this._attempts = <_.Dictionary<ILoginAttempt>>{};
   }

   /**
    * @return {(req:any, res:any, next:any)} Login middleware
    */
   public loginMiddleware() {
      return (req, res, next) => {
         passport.authenticate('local', (err, user) => {
            if (err) return next(err);
            if (!user || user.locked) {
               return this._addLoginFailedAttempt(user, req, res, next);
            }
            this._cleanExpiredAttempts(req.body.username);

            req.logIn(user, (err) => {
               if (err) {
                  return next(err);
               }
               this.addUserCookie(res, user);
               res.status(200).send(this._generateUserCookieData(user));
            });
         })(req, res, next);
      };
   }

   /**
    * @return {(req:any, res:any, next:any)} Logout middleware
    */
   public logoutMiddleware() {
      return (req, res) => {
         Utils.logger.log(`User ${req.user ? req.user.fullName || req.user.email : '[null]'}${req.user ? ` (${req.user._id})` : ''} logged out`);
         req.logout();
         return res.sendStatus(200);
      };
   }

   /**
    * @return {(req:any, res:any, next:any)} Register middleware
    */
   public registerMiddleware() {
      return (req, res, next) => {
         User.add({
            email: req.body.email,
            registerMessage: req.body.hospital
         })
            .then((user: IUser) => {
               Emails.sendNewAccountAlert(req.body.email, req.body.hospital);
               Utils.logger.log(`User ${req.body.email} registered successfully`);
               res.sendStatus(200);
            })
            .catch(err => next(err));
      };
   }

   /**
    * @return {(req:any, res:any, next:any)} Forgot password middleware
    */
   public forgotPasswordMiddleware() {
      return (req, res, next) => {
         User.findOneByEmail(req.body.email).then((user: IUser) => {
            if (!user) return res.status(404).send("User not found");
            user.password = null; // set password has null to force validMail generation
            User.save(user).then((user: IUser) => {
               User.getPasswordsById(user._id.toString()).then(user => {
                  Emails.sendPasswordRecovery(user.email, user.emailCheckCode);
                  Utils.logger.log(`User ${req.body.email} recovered password`);
                  res.sendStatus(200);
               }).catch((err) => next(err));
            }).catch((err) => next(err));
         }).catch((err) => next(err));
      };
   }

   /**
    * @return {(req:any, res:any, next:any)} Change password middleware
    */
   public changePasswordMiddleware() {
      return (req, res, next) => {
         const p = req.url.split('/');
         const id = p[p.length - 1];

         if (req.user._id !== id && !Permission.ensureAuthorized(req.user, 'admin')) {
            return next(new CustomEdError(`Permission denied (admin) for user ${req.user ? req.user.fullName || req.user.email : '[null]'}`, EHTTPStatus.Forbidden));
         }

         User.changePasswordById(id, req.body.oldPwd, req.body.password)
            .then((user) => {
               Utils.logger.log(`User ${req.user.email} changed password`);
               res.status(200).json(user);
            })
            .catch(err => next(err));
      };
   }

   /**
    * Anti login brute-force
    * This security will lock accounts after a certain amount of tries
    * @return {(req:any, res:any, next:any)} Login limit middleware
    */
   public loginLimitMiddleware() {
      return (req, res, next) => {
         const username = req.body.username;

         if (!(<any>this._attempts).hasOwnProperty(username)) {
            return next();
         }

         this._cleanExpiredAttempts(username);
         if (this._attempts[username].locked) {
            return res.status(429).send("TooManyAttempts");
         }

         next();
      };
   }

   /**
    * Anti login brute-force
    * This security will lock accounts after a certain amount of tries
    * @return {(req:any, res:any, next:any)} Login limit middleware
    */
   public unlockAccountMiddleware() {
      return (req, res, next) => {
         const p = req.url.split('/');
         const id = p[p.length - 1];

         if (!Permission.ensureAuthorized(req.user, 'admin')) {
            return next(new EdError(EHTTPStatus.Forbidden));
         }

         User.saveById(id,{
            locked: false
         }).then((user: IUser) => {
            this._cleanAttempts(user.userName);
            this._cleanAttempts(user.email);
            Emails.sendUnlockedAccount(user.email);
            Utils.logger.log(`User ${user.email} account has been unlocked by ${req.user.email}`);
            res.sendStatus(200);
         })
            .catch(err => next(err));
      };
   }

   /**
    * Add SET-COOKIE to request response headers
    * @param res
    * @param user
    */
   public addUserCookie(res, user) {
      res.cookie('user',
         JSON.stringify(this._generateUserCookieData(user)),
         {secure: EEnv.Dev !== Utils.env && EEnv.Test !== Utils.env});
   }

   /**
    * Generate user data used in clients
    * @param user
    * @return any
    * @private
    */
   private _generateUserCookieData(user) {
      return user ? {
         _id: user._id.toString(),
         userName: user.userName,
         email: user.email,
         roles: user.roles || ['public']
      } : {};
   }

   ///////////////////////////////////////////////////////////////////
   // Security utils methods (anti-bruteforce)
   ///////////////////////////////////////////////////////////////////
   /**
    * Add login failed attempt
    * @param user
    * @param req
    * @param res
    * @param next
    * @private
    */
   private _addLoginFailedAttempt(user, req, res, next) {
      const username = req.body.username;
      this._addAttempt(username);

      if (this._attempts[username].locked) {
         User.findOneByUserNameOrEmail(username).then((user: IUser) => {
            if (user && !user.locked) {
               user.locked = true;
               User.save(user).then((user: IUser) => {
                  Emails.sendLockedAccount(user.email);
                  Utils.logger.warn(`User ${username} account is locked due to too many login attempts`);
               }).catch(err => next(err));
            }
            else {
               Utils.logger.warn(`User ${username} tried to logged in with a locked account`);
            }
            res.status(403).send("TooManyAttempts");
         }).catch(err => {
            next(err);
         });
      }
      else if (user) {
         Utils.logger.warn(`User ${username} tried to logged in with a locked account`);
         res.status(403).send("TooManyAttempts");
      }
      else {
         res.status(400).send("FailedToLogin");
      }
   }

   /**
    * Clean attempts per username
    * @param username
    * @private
    */
   private _cleanAttempts(username) {
      if ((<any>this._attempts).hasOwnProperty(username)) {
         this._attempts[username] = {list: [], locked: false};
      }
   }

   /**
    * Add failed attempt to list
    * @param username
    * @private
    */
   private _addAttempt(username: string) {
      if (!(<any>this._attempts).hasOwnProperty(username)) {
         this._attempts[username] = {list: [], locked: false};
      }
      this._attempts[username].list.push(Date.now());

      if (!this._attempts[username].locked && this._attempts[username].list.length >= Utils.maxLoginAttempts) {
         this._attempts[username].locked = true;
      }
      if (this._attempts[username].list.length > Utils.maxLoginAttempts) {
         this._attempts[username].list.splice(0, 1);
      }
   }

   /**
    * Remove all expired attempts
    */
   private _cleanExpiredAttempts(username) {
      if (!(<any>this._attempts).hasOwnProperty(username)) return;
      const now = Date.now();
      const userAttempts: any = this._attempts[username].list;

      for (let idx in userAttempts) {
         if (userAttempts.hasOwnProperty(idx)) {
            if (now - userAttempts[idx] >= Utils.loginAttemptsExpire) {
               userAttempts.splice(idx, 1);
            }
         }
      }
   }
}

export default new Auth();
