/**
 * Created by eygle on 4/28/17.
 */
angular
   .module('eygle.admin', [
      'eygle.admin.panel-admin',
      'eygle.admin.cron',
   ])
   .config(($stateProvider) => {
      $stateProvider.state('eygle.admin', {
         url: '/admin',
         weight: 20,
         separator: true,
         access: EPermission.SeeAdminPanel
      });
   });