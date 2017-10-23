import * as tracer from "tracer";
import * as cron from "node-schedule";

import Utils from "../config/Utils";
import CronJob from "../schemas/CronJob";
import {EEnv} from "../typings/enums";

abstract class AJob implements ICronJob {
    /**
     * Log file name
     */
    public logFilename: string;
    /**
     * Task name
     */
    public name: string;
    /**
     * Job schedule rule
     */
    public scheduleRule: string;
    /**
     * Is running
     */
    public isScheduled: boolean;
    /**
     * Is running
     */
    public isRunning: boolean;
    /**
     * Limited to specific environments (no limit if not set)
     */
    public environments: Array<EEnv>;
    /**
     * Last run date
     */
    public lastRun: Date;
    /**
     * Logger
     */
    protected logger: ILogger;
    /**
     * node-cron job instance
     */
    private _job: cron.Job;

    /**
     * Database model
     */
    private _model: ICronJob;

    constructor(name: string) {
        this.name = name;
        this.logFilename = `mapui-${this._formatName()}`;
        if (EEnv.Prod === Utils.env || EEnv.Preprod === Utils.env) {
            this.logger = (<any>tracer).dailyfile({
                root: `${Utils.root}/logs`,
                maxLogFiles: 10,
                allLogsFileName: this.logFilename,
                format: "{{timestamp}} <{{title}}> {{message}}",
                dateformat: "HH:MM:ss.L"
            });
        }
        else {
            this.logger = (<any>tracer).colorConsole({
                format: "{{timestamp}} <{{title}}> {{message}}",
                dateformat: "HH:MM:ss.L"
            });
        }
    }

    /**
     * Set database model
     * @param {ICronJob} model
     */
    public setModel(model: ICronJob) {
        this._model = model;
        this.isScheduled = this._model.isScheduled;
        this.lastRun = this._model.lastRun;
        this.isRunning = false;
        if (model.isRunning) {
            this.saveDBModel();
        }
    }

    /**
     * Run job
     */
    public run(): void {
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastRun = new Date();
            this.logger.log(`Start task ${this.name}`);
            this.saveDBModel();
        }
    };

    /**
     * Schedule job
     */
    public schedule(): void {
        this.isScheduled = true;
        Utils.logger.trace(`Cron load job ${this.name} (rule: ${this.scheduleRule})`);
        if (this._job) {
            this._job.reschedule(this.scheduleRule);
        }
        else {
            this._job = cron.scheduleJob(this.scheduleRule, this._getExecutable());
        }
        this.saveDBModel();
    };

    /**
     * Un-schedule job
     */
    public unSchedule(): void {
        this.isScheduled = false;
        this._job.cancel();
        Utils.logger.trace(`Cron un-schedule job ${this.name}`);
        this.saveDBModel();
    };

    /**
     * Save job state in db
     * @private
     */
    public saveDBModel() {
        this._model.name = this.name;
        this._model.scheduleRule = this.scheduleRule;
        this._model.isScheduled = this.isScheduled;
        this._model.isRunning = this.isRunning;
        this._model.lastRun = this.lastRun;
        CronJob.save(this._model)
            .catch(Utils.logger.error);
    }

    /**
     * End of job execution
     */
    protected end() {
        this.isRunning = false;
        this.logger.log(`End of task ${this.name}`);
        this.saveDBModel();
    };

    /**
     * Allow to execute in another scope
     * @return {() => any}
     */
    private _getExecutable() {
        return () => {
            this.run();
        };
    }

    /**
     * Format name for log filename
     * @return {string}
     * @private
     */
    private _formatName(): string {
        return this.name.match(/([A-Z][a-z]+)/g).join('-').toLowerCase();
    }
}

export default AJob;