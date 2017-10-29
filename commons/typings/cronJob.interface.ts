interface ICronJob extends IModel {
   /**
    * Service name
    */
   name: string;

   /**
    * Get cron schedule

    *    *    *    *    *    *
    ┬    ┬    ┬    ┬    ┬    ┬
    │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
    │    │    │    │    └───── month (1 - 12)
    │    │    │    └────────── day of month (1 - 31)
    │    │    └─────────────── hour (0 - 23)
    │    └──────────────────── minute (0 - 59)
    └───────────────────────── second (0 - 59, OPTIONAL)
    */
   scheduleRule: string;

   /**
    * Limited to specific environments (no limit if not set)
    */
   environments: Array<number>;

   /**
    * Is scheduled
    */
   isScheduled: boolean;

   /**
    * Is running
    */
   isRunning: boolean;

   /**
    * Status
    */
   lastRun: Date;
}