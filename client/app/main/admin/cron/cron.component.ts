class CronComponent {
   public controller: string;
   public controllerAs: string;
   public templateUrl: string;

   constructor() {
      this.controller = 'CronController';
      this.controllerAs = 'vm';
      this.templateUrl = 'app/main/admin/cron/cron.html';
   }
}

angular.module('eygle.admin.cron')
   .component('cron', new CronComponent());
