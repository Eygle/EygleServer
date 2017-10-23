import {ARoutes, RoutePermissions} from "../../../middlewares/Resty";
import CronJob from '../../../schemas/CronJob';
import {EHTTPStatus} from "../../../typings/enums";
import CronManager from "../../../cron/CronManager";
import EdError from "../../../config/EdError";

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
        CronJob.getAll()
            .then(next)
            .catch(next);
    }

    /**
     * Resource PUT Route
     * @param next
     */
    public post(next: RestyCallback): void {
            switch (this.data.action) {
                case 'run':
                    CronManager.runJob(this.data.job);
                    break;
                case 'schedule':
                    CronManager.scheduleJob(this.data.job);
                    break;
                case 'un-schedule':
                    CronManager.unScheduleJob(this.data.job);
                    break;
                default:
                    next(new EdError(EHTTPStatus.BadRequest));
                    return;
            }
        next();
    }
}

module.exports = {
    Collection: new Collection()
};