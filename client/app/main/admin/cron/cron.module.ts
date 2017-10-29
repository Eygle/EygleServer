angular.module('eygle.admin.cron', [])
   .config(configCron);

function configCron($stateProvider) {
   $stateProvider.state('eygle.admin.cron', {
      url: '/cron',
      icon: 'icon-calendar-clock',
      translate: 'ADMIN.CRON.TITLE',
      weight: 22,
      views: {
         'content@eygle': {
            template: '<cron></cron>'

         }
      },
      access: EPermission.ManageCron,
      resolve: {},
      bodyClass: 'admin-cron'
   });
}

