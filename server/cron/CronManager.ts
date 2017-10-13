import * as fs from "fs";
import * as _ from "underscore";
import * as cron from "node-schedule";

import Utils from '../config/Utils';
import Intercom from '../modules/Intercom';
import {EEnv, EIntercomTopic} from "../typings/enums";

class CronManager {
   /**
    * Path of jobs folder
    * @type {string}
    * @private
    */
   private _jobsPath = `${Utils.root}/server/cron/jobs/`;

   /**
    * All data needed to cron services
    */
   private _list: Array<{ service: ICronJob, job?: cron.Job }>;

   constructor() {
      if (EEnv.Prod !== Utils.env || parseInt(process.env.pm_id) === 1) { // Limit to a pm2 single instance for prod
         this._init();
         this._listen();
      }
   }

   /**
    * Start cron
    */
   public start(): void {
      if (EEnv.Prod !== Utils.env || parseInt(process.env.pm_id) === 1) { // Limit to a pm2 single instance for prod
         for (let item of this._list) {
            Utils.logger.trace(`Cron load job ${item.service.name} (rule: ${item.service.scheduleRule})`);
            if (item.job) {
               item.job.reschedule(item.service.scheduleRule);
            }
            else {
               item.job = cron.scheduleJob(item.service.scheduleRule, item.service.getExecutable());
            }
            item.service.status = "scheduled";
         }
         Utils.logger.log('Crontab ready\n');
      }
   }

   /**
    * Stop cron
    */
   public stop(): void {
      for (let item of this._list) {
         if (item.job) {
            item.job.cancel();
            item.service.status = "stopped";
         }
      }
   }

   /**
    * Execute job once
    * @param job
    */
   public executeJob(job: string): void {
      for (let item of this._list) {
         if (item.service.name === job) {
            if (item.service.status !== 'running') {
               item.service.getExecutable()(); // start job
            }
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
         if (item.service.name === job) {
            item.job.reschedule(item.service.scheduleRule);
            item.service.status = "scheduled";
            break;
         }
      }
   }

   /**
    * Unschedule job once
    * @param job
    */
   public unscheduleJob(job: string): void {
      for (let item of this._list) {
         if (item.service.name === job) {
            item.job.cancel();
            item.service.status = "stopped";
            break;
         }
      }
   }

   /**
    * Return list of jobs
    * @return {Array<ICronJob>}
    */
   public jobs(): Array<ICronJob> {
      return _.map(this._list, (v) => {
         return v.service;
      });
   }

   /**
    * Load of services from folder _jobsPath
    * @private
    */
   private _init(): void {
      this._list = [];
      for (let filename of fs.readdirSync(this._jobsPath)) {
         const item = {service: require(this._jobsPath + filename)};
         if (!item.service.environments || !!~item.service.environments.indexOf(Utils.env)) {
            this._list.push(item);
         }
      }
   }

   /**
    * Listen for directive to start job
    * @private
    */
   private _listen(): void {
      Intercom.listenMsg(EIntercomTopic.CronStartJob, (job) => {
         Utils.logger.info(`Received load balancer message to start cron job ${job}`);
         this.executeJob(job);
      });

      Intercom.listenMsg(EIntercomTopic.CronScheduleJob, (job) => {
         Utils.logger.info(`Received load balancer message to schedule cron job ${job}`);
         this.scheduleJob(job);
      });

      Intercom.listenMsg(EIntercomTopic.CronStopJob, (job) => {
         Utils.logger.info(`Received load balancer message to unschedule cron job ${job}`);
         this.unscheduleJob(job);
      });

      Intercom.listenMsg(EIntercomTopic.CronAskJobs, () => {
         Intercom.sendMsg(EIntercomTopic.CronListJobs, this.jobs());
      });
   }
}

export default new CronManager();