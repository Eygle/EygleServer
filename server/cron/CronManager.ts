import * as fs from "fs";
import * as q from "q";
import * as _ from "underscore";

import Utils from '../config/Utils';
import CronJob from '../schemas/CronJob';
import {EEnv, EIntercomTopic} from "../typings/enums";
import AJob from "./AJob";

class CronManager {
    /**
     * Path of jobs folder
     * @type {string}
     * @private
     */
    private _jobsPath = `${Utils.root}/server/cron/jobs/`;

    /**
     * All [[AJob]]s
     */
    private _list: Array<AJob>;

    /**
     * Load of services from folder _jobsPath and schedule cron jobs if needed
     * @private
     */
    public init(): void {
        if (EEnv.Prod !== Utils.env || parseInt(process.env.pm_id) === 1) { // Limit to a pm2 single instance for prod
            CronJob.getAll()
                .then((dbItems: Array<ICronJob>) => {
                    this._list = [];
                    const promises = [];
                    const added = [];

                    for (let filename of fs.readdirSync(this._jobsPath)) {
                        const item: AJob = require(this._jobsPath + filename);
                        const dbItem: ICronJob = _.find(dbItems, (i) => {
                            return i.name === item.name;
                        });

                        this._list.push(item);
                        added.push(item.name);

                        if (dbItem) {
                            item.setModel(dbItem);
                        } else {
                            // Schedule only if there is not environment restriction or the restriction is matched
                            item.isScheduled = !item.environments || !!~item.environments.indexOf(Utils.env);
                            promises.push(
                                CronJob.add(item)
                                    .then((model: ICronJob) => {
                                        item.setModel(model);
                                    })
                            );
                        }
                    }

                    for (let item of dbItems) {
                        if (!~added.indexOf(item.name)) {
                            CronJob.remove(item);
                        }
                    }

                    q.allSettled(promises)
                        .then(() => {
                            for (let item of this._list) {
                                if (item.isScheduled) {
                                    item.schedule();
                                }
                            }
                            Utils.logger.log('Crontab ready\n');
                        });
                })
                .catch(err => Utils.logger.error);
        }
    }

    /**
     * Run job once
     * @param job
     */
    public runJob(job: string): void {
        for (let item of this._list) {
            if (item.name === job) {
                item.run();
                break;
            }
        }
    }

    /**
     * Schedule job once
     * @param job
     */
    public scheduleJob(job: string): void {
        for (let item of this._list) {
            if (item.name === job) {
                item.schedule();
                break;
            }
        }
    }

    /**
     * Un-schedule job once
     * @param job
     */
    public unScheduleJob(job: string): void {
        for (let item of this._list) {
            if (item.name === job) {
                item.unSchedule();
                break;
            }
        }
    }

    /**
     * Return list of jobs
     * @return {Array<ICronJob>}
     */
    public jobs(): Array<ICronJob> {
        return this._list;
    }
}

export default new CronManager();