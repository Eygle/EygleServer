/**
 * Created by eygle on 4/26/17.
 */
angular
   .module('eygle.profile.settings', [])
   .config(($stateProvider) => {
      $stateProvider.state('eygle.profile.settings', {
         url: '/settings',
         icon: 'icon-cog',
         translate: 'PROFILE.SETTINGS.TITLE',
         weight: 12,
         views: {
            'content@eygle': {
               template: '<settings></settings>',
            }
         },
         access: EPermission.SeeSettings,
         resolve: {},
         bodyClass: 'settings'
      });
   });