import Utils from "../config/Utils";

import Config from '../schemas/Config.schema';

/**
 * List of permissions
 */
let list: Array<IPermission> = null;

class Permissions {

   /**
    * Permission middleware
    */
   public middleware(): Function {
      return (req, res, next) => {
         if (!list) {
            Config.getPermissions()
               .then((permissions: Array<IPermission>) => {
                  list = permissions;
                  next();
               })
               .catch((err: Error) => {
                  Utils.logger.error("Mongo error", err);
                  next(err);
               });
         }
         else {
            next();
         }
      };
   }

   /**
    * Ensure [[IUser]] has accessRole access
    * @param user
    * @param accessRole
    * @return {boolean}
    */
   public ensureAuthorized(user: IUser, accessRole: string) {
      const memberRights = user.roles || ["public"];

      if (!!~memberRights.indexOf("admin")) {
         return true;
      }
      if (!list || !list.length) {
         return false;
      }

      for (const perm of list) {
         if (perm.name === accessRole) {
            for (const m of memberRights) {
               if (!!~perm.roles.indexOf(m)) {
                  return true;
               }
            }
         }
      }
      return false;
   }
}

const permission = new Permissions(); // Accessible via static methods

export default permission;
