/**
 * Created by eygle on 4/26/17.
 */
angular
   .module('eygle.admin.panel-admin', [])
   .config(($stateProvider) => {
      $stateProvider.state('eygle.admin.panel-admin', {
         url: '/panel',
         icon: 'icon-lock',
         translate: 'ADMIN.PANEL.TITLE',
         weight: 21,
         views: {
            'content@eygle': {
               template: '<panel-admin></panel-admin>',
            }
         },
         access: EPermission.SeeAdminPanel,
         resolve: {},
         bodyClass: 'panel-admin'
      });
   });