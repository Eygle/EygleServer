import TVShow from "../../schemas/TVShow.schema"
import {ARoute} from "../../middlewares/Resty";
import {EPermission} from "../../typings/enums";

/**
 * Resource class
 */
class Resource extends ARoute {

    constructor() {
        super(EPermission.Admin);
    }

    /**
     * Resource PUT Route - Choose a given proposal
     * @param id
     * @param next
     */
    public get(id: string, next: RestyCallback): void {
        TVShow.getFull(id)
            .then(next)
            .catch(next);
    }
}

/**
 * Collection class
 */
class Collection extends ARoute {

    constructor() {
        super(EPermission.Admin);
    }

    /**
     * Collection GET Route
     * @param next
     */
    public get(next: RestyCallback): void {
        TVShow.getAll()
            .then(next)
            .catch(next);
    }
}

module.exports.Resource = Resource;
module.exports.Collection = Collection;