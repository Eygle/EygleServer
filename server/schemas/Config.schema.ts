import mongoose = require('mongoose');
import q = require('q');
import DB from '../modules/DB';
import ASchema from './ASchema.schema';

const _schema: mongoose.Schema = DB.createSchema({
   name: {type: String, required: true, unique: true},
   data: mongoose.Schema.Types.Mixed
}, false);

class Config extends ASchema {
   /**
    * Get list of permissions
    * @return {Promise<Array<IPermission>>}
    */
   public getPermissions(): Q.Promise<Array<IPermission>> {
      const defer: any = q.defer();

      this._model.findOne({name: "permissions"})
         .exec((err, permission: { data: Array<IPermission> }) => {
            if (err) return defer.reject(err);
            defer.resolve(permission ? permission.data : this._fill());
         });

      return defer.promise;
   }

   /**
    * Fill permissions if empty
    * @returns {{}[]}
    * @private
    */
   private _fill() {
      const permissions = [{
         name: "seeHome",
         roles: ['guest', 'user']
      }, {
         name: "seeLastAdded",
         roles: ['user']
      }, {
         name: "seeSoonToBeRemoved",
         roles: ['user']
      }, {
         name: "seeTVShows",
         roles: ['user']
      }, {
         name: "editTVShows",
         roles: ['contributor']
      }, {
         name: "deleteTVShows",
         roles: ['admin']
      }, {
         name: "seeMovies",
         roles: ['user']
      }, {
         name: "editMovies",
         roles: ['contributor']
      }, {
         name: "deleteMovies",
         roles: ['admin']
      }, {
         name: "addSubtitles",
         roles: ['contributor']
      }, {
         name: "removeSubtitles",
         roles: ['admin']
      }, {
         name: "seeFiles",
         roles: ['user']
      }, {
         name: "editFiles",
         roles: ['admin']
      }, {
         name: "deleteFiles",
         roles: ['admin']
      }, {
         name: "identifyMedia",
         roles: ['contributor']
      }, {
         name: "seeAccount",
         roles: ['guest', 'user']
      }, {
         name: "editAccount",
         roles: ['guest', 'user']
      }, {
         name: "seeSettings",
         roles: ['guest', 'user']
      }, {
         name: "editSettings",
         roles: ['guest', 'user']
      }, {
         name: "deleteAccount",
         roles: ['admin']
      }, {
         name: "seeAdminPanel",
         roles: ['admin']
      }, {
         name: "seeMultipleResults",
         roles: ['admin']
      }, {
         name: "manageMultipleResults",
         roles: ['admin']
      }, {
         name: "seeUsers",
         roles: ['admin']
      }, {
         name: "editUsers",
         roles: ['admin']
      }, {
         name: "seeStats",
         roles: ['admin']
      }, {
         name: "manageCron",
         roles: ['admin']
      }];

      this.add({
         name: "permissions",
         data: permissions
      });

      return permissions;
   }

   /**
    * Get File schema
    * @return {"mongoose".Schema}
    */
   public getSchema(): mongoose.Schema {
      return _schema;
   }
}

const instance = new Config();

module.exports.schema = instance; // Used by DB models loader (need require)
export default instance; // Used anywhere else
