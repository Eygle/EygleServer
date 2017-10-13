import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as q from 'q';

import DB from '../modules/DB';
import Cache from '../modules/Cache';
import Utils from '../config/Utils';
import ASchema from './ASchema.schema';
import {EHTTPStatus} from "../typings/enums";
import {CustomEdError} from "../config/EdError";

const _schema: mongoose.Schema = DB.createSchema({
   email: {
      type: String,
      unique: true,
      required: [true, 'User email required'],
      validate: {
         validator: function (v) {
            return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
         },
         message: 'Invalid email format'
      }
   },

   userName: {
      type: String,
      maxlength: 10,
      minlength: 2
   },

   password: {
      type: String,
      set: (plaintext) => {
         if (/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{6,}$/.test(plaintext)) {
            return bcrypt.hashSync(plaintext, bcrypt.genSaltSync())
         }
         return null;
      },
      validate: {
         validator: function (v) {
            return v.length > 10;
         },
         message: 'Invalid password format'
      },
      select: false
   },

   userNameNorm: {type: String, unique: true, sparse: true},

   emailCheckCode: {type: String, select: false},
   locked: {type: Boolean, 'default': false},

   googleId: String,
   googleToken: String,

   facebookId: String,
   facebookToken: String,

   roles: [{type: String}],

   desc: String,
}, false);

_schema.pre('save', function (next) { // DO NOT use big arrow here ( => )
   if (this.userName)
      this.userNameNorm = Utils.normalize(this.userName);
   this.emailCheckCode = Math.random().toString().substr(2, 12);
   this.roles = this.roles || ["public"];
   this.updateDate = new Date();
   next();
});

/**
 * Error's handler asynchronous hook
 */
_schema.post('save', function (error, doc, next) {
   if (!this.isNew) {
      Cache.remove(this._id.toString());
   }
   if (error.name === 'MongoError' && error.code === 11000) {
      const data = error.message.match(/E11000 duplicate key error[^{]+{\s*:\s*['"]([^"']+)['"]\s*}.*/);
      if (data.length >= 2) {
         if (!!~error.message.indexOf('email')) {
            next(new CustomEdError(`Email '${data[1]}' already assigned`, EHTTPStatus.BadRequest));
         }
         else if (!!~error.message.indexOf('userName')) {
            next(new CustomEdError(`Username '${data[1]}' already assigned`, EHTTPStatus.BadRequest));
         }
         else {
            next(error);
         }
      }
      else {
         next(error);
      }
   }
   else {
      next(error);
   }
});

/**
 * Synchronous success hook
 */
_schema.post('save', function (doc) {
   if (!this.isNew) {
      Cache.remove(this._id.toString());
   }
});

export class User extends ASchema {
   /**
    * Get by id
    * @param {string} id
    * @return {Q.Promise<any>}
    */
   public getFullCached(id) {
      const defer = q.defer();
      const user = Cache.get(id);

      if (user) {
         defer.resolve(user);
      }
      else {
         super.get(id, {
            select: '+roles +validMail +locked'
         })
            .then(item => {
               item = item.toObject();
               Cache.set(id, item, 3600 * 12);
               defer.resolve(item);
            })
            .catch(err => defer.reject(err));
      }

      return defer.promise;
   }


   /**
    * Find single user by email
    * @param email
    * @param queryParams
    * @return {Promise<T>}
    */
   public findOneByEmail(email: string, queryParams: any = null): q.Promise<IUser> {
      const defer = <q.Deferred<IUser>>q.defer();

      const query = this._model.findOne()
         .where('email').equals(email.toLowerCase());

      if (queryParams) {
         super.applyQueryParams(query, queryParams);
      }

      query.exec((err, user) => {
         if (err) return defer.reject(err);
         defer.resolve(user);
      });

      return defer.promise;
   }

   /**
    * Find single user by either email or userName
    * @param value
    * @param includePassword
    */
   public findOneByUserNameOrEmail(value: string, includePassword = false): q.Promise<IUser> {
      const defer = <q.Deferred<IUser>>q.defer();
      const query = this._model.findOne().or([{userName: value}, {email: value.toLowerCase()}]);

      if (includePassword) {
         query.select('+roles +password +validMail +locked');
      }

      query.exec((err, user) => {
         if (err) return defer.reject(err);
         defer.resolve(user);
      });

      return defer.promise;
   }

   /**
    * Get user password
    * @param {string} id
    * @return {Q.Promise<IUser>}
    */
   public getPasswordsById(id: string) {
      const defer = <q.Deferred<IUser>>q.defer();

      this._model.findById(id)
         .select('password validMail')
         .exec((err, user) => {
            if (err) return defer.reject(err);
            if (!user) return defer.reject(new Error("User not found"));
            defer.resolve(user);
         });

      return defer.promise;
   }

   /**
    * Change user's password
    * @param {string} id
    * @param {IUser} author
    * @param {string} oldPwd
    * @param {string} password
    * @return {Q.Promise<IUser>}
    */
   public changePasswordById(id: string, oldPwd: string, password: string) {
      const defer = <q.Deferred<IUser>>q.defer();

      this.getPasswordsById(id)
         .then(userPwds => {
            bcrypt.compare(oldPwd, userPwds.password, (err, same) => {
               if (err) return defer.reject(err);
               if (!same || !oldPwd) return defer.reject(new CustomEdError("Wrong password", EHTTPStatus.Forbidden));
               this.saveById(id, {_id: id, password: password})
                  .then((res: IUser) => defer.resolve(res))
                  .catch(err => defer.reject(err));
            });
         })
         .catch(err => defer.reject(err));

      return defer.promise;
   }

   /**
    * Get default role titles for a user linked to a hospital
    * @return {Array<string>}
    */
   public getDefaultRoleTitles() {
      return ["user"];
   }

   /**
    * Schema getter
    * @return {mongoose.Schema}
    */
   getSchema(): mongoose.Schema {
      return _schema;
   }
}

const instance = new User();

module.exports.schema = instance;
export default instance;