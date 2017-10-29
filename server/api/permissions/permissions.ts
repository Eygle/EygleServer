import Config from '../../schemas/Config.schema';
import {ARoute} from "../../middlewares/Resty";

class Collection extends ARoute {
   /**
    * GET Route
    * @param next
    */
   public get(next: RestyCallback): void {
      Config.getPermissions()
         .then((items: Array<IPermission>) => {
            next(items);
         })
         .catch((err: Error) => {
            next(err);
         });
   }
}

module.exports.Collection = Collection;