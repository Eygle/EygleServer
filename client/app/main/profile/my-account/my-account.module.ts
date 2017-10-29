/**
 * Created by eygle on 4/26/17.
 */
angular
   .module('eygle.profile.my-account', [])
   .config(($stateProvider) => {
      $stateProvider.state('eygle.profile.my-account', {
         url: '/account',
         icon: 'icon-account',
         translate: 'PROFILE.MY_ACCOUNT.TITLE',
         weight: 11,
         views: {
            'content@eygle': {
               template: '<my-account></my-account>',
            }
         },
         access: EPermission.SeeAccount,
         resolve: {},
         bodyClass: 'my-account'
      });
   });