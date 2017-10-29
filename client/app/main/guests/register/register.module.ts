/**
 * Created by eygle on 5/17/17.
 */
angular
   .module('eygle.register', [])
   .config(($stateProvider) => {
      $stateProvider.state('eygle.register', {
         url: '/register',
         views: {
            'main@': {
               templateUrl: 'app/core/layouts/content-only.html',
               controller: 'MainController as vm'
            },
            'content@eygle.register': {
               template: '<register></register>',
            }
         },
         resolve: {},
         bodyClass: 'register'
      });
   });