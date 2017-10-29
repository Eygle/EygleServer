import File from "../../schemas/File.schema"
import {ARoute} from "../../middlewares/Resty";
import {EPermission} from "../../typings/enums";
import Utils from "../../config/Utils";

/**
 * Collection class
 */
class Collection extends ARoute {

   constructor() {
      super(EPermission.SeeFiles);
   }

   /**
    * Collection GET Route
    * @param next
    */
   public get(next: RestyCallback): void {
      File.getAll({
         select: 'filename mtime size ext directory parent movie tvshow',
         sort: {mtime: -1}
      })
         .then((items: Array<IEygleFile>) => next(this._createHierarchy(items)))
         .catch(next);
   }

   /**
    * Create files hierarchy
    * @param files
    * @param {any} parent
    * @returns {Array}
    * @private
    */
   private _createHierarchy(files: Array<IEygleFile>, parent = null) {
      const root = [];

      for (let i in files) {
         if (files.hasOwnProperty(i)) {
            let f: IEygleFile = files[i];
            if ((f.parent && Utils.compareIds(f.parent, parent) || (f.parent === parent))) {
               if (f.directory) {
                  f = (<any>f).toObject();
                  f.children = this._createHierarchy(files, files[i]._id);
               }
               root.push(f);
               delete files[i];
            }
         }
      }

      return root.length > 0 ? root : null;
   }
}

module.exports.Collection = Collection;