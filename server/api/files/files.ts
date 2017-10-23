import File from "../../schemas/File.schema"
import {ARoutes, RoutePermissions} from "../../middlewares/Resty";

/**
 * Collection class
 */
class Collection extends ARoutes {
    public permissions: IRoutePermissions = new RoutePermissions('admin');

    /**
     * Collection GET Route
     * @param next
     */
    public get(next: RestyCallback): void {
        File.getAll({
            select: 'filename mtime size ext directory parent movie tvshow',
            sort: {mtime: -1}
        })
            .then(items => this._createHierarchy(items))
            .catch(next);
    }

    /**
     * Create files hierarchy
     * @param files
     * @param {any} parent
     * @returns {Array}
     * @private
     */
    private _createHierarchy(files, parent = null) {
        const root = [];

        for (let i in files) {
            if (files.hasOwnProperty(i)) {
                let f = files[i];
                if ((f._parent && f._parent.equals(parent)) || (f._parent === parent)) {
                    if (f.directory) {
                        f = f.toObject();
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

module.exports = {
    Collection: new Collection()
};