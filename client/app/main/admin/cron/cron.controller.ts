class CronController {

   /**
    * List of cron jobs
    */
   public jobs: Array<ICronJob>;

   /**
    * Refresh interval promise
    */
   private _interval: any;

   /** @ngInject */
   constructor(private Api: Api,
               private ToastService: ToastService,
               private ModalService: ModalService,
               private $interval: any,
               private _: any) {
   }

   $onDestroy = () => {
      this._stopRefreshInterval();
   };

   $onInit = () => {
      this._refresh();
   };

   /**
    * Run cron job
    * @param {string} name
    */
   public runJob = (name: string): void => {
      this.ModalService.show({
         component: 'mp-modal-confirm',
         bindings: {
            data: {
               title: "ADMIN.CRON.MODAL.CONFIRM.TITLE",
               text: "ADMIN.CRON.MODAL.CONFIRM.RUN"
            }
         },
         escapeToClose: false
      }).then(() => {
         this.Api.cron.action({job: name, action: 'run'}, () => {
            this.ToastService.show(EStatus.Ok);
            this._refresh();
            this._startRefreshInterval();
         }, () => this.ToastService.show(EStatus.RejectByServer))
      });
   };

   /**
    * Schedule cron job
    * @param {string} name
    */
   public scheduleJob = (name: string): void => {
      this.Api.cron.action({job: name, action: 'schedule'}, () => {
         this.ToastService.show(EStatus.Ok);
         this._refresh();
      }, () => this.ToastService.show(EStatus.RejectByServer))
   };

   /**
    * Un-schedule cron job
    * @param {string} name
    */
   public unScheduleJob = (name: string): void => {
      this.ModalService.show({
         component: 'mp-modal-confirm',
         bindings: {
            data: {
               title: "ADMIN.CRON.MODAL.CONFIRM.TITLE",
               text: "ADMIN.CRON.MODAL.CONFIRM.UN_SCHEDULE"
            }
         },
         escapeToClose: false
      }).then(() => {
         this.Api.cron.action({job: name, action: 'un-schedule'}, () => {
            this.ToastService.show(EStatus.Ok);
            this._refresh();
         }, () => this.ToastService.show(EStatus.RejectByServer))
      });
   };

   public getStatusLabel = (job: ICronJob): string => {
      if (job.isRunning) {
         return 'ADMIN.CRON.STATUS.RUNNING';
      }
      return 'ADMIN.CRON.STATUS.' + (job.isScheduled ? 'SCHEDULED' : 'UN_SCHEDULED');
   };

   /**
    * Refresh jobs list
    * @private
    */
   private _refresh = () => {
      this.Api.cron.all({}, (items) => {
         this.jobs = items;
         if (this._.find(items, (v) => {
               return v.status === 'running';
            })) {
            this._startRefreshInterval();
         }
      });
   };

   /**
    * Start refresh each 10 seconds
    * @private
    */
   private _startRefreshInterval = () => {
      if (!this._interval) {
         this._interval = this.$interval(() => {
            this._refresh();
         }, 10000);
      }
   };

   /**
    * Stop interval refresh
    * @private
    */
   private _stopRefreshInterval = () => {
      if (this._interval) {
         this.$interval.cancel(this._interval);
         this._interval = null;
      }
   };
}

angular.module('eygle.admin.cron')
   .controller('CronController', CronController);
