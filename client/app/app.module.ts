/**
 * Created by eygle on 4/26/17.
 */
angular.module('eygle', [
   'core',
   'eygle.general',
   'eygle.profile',
   'eygle.admin',
   'eygle.services',

   'eygle.error-404',

   'ngMaterial',
   'ui.router',
   'ngCookies',
   'pascalprecht.translate'
]);

// (function () {
//    // Get Angular's $http module.
//    const initInjector = angular.injector(['ng']);
//    const $http = initInjector.get('$http');
//
//    // Get permissions
//    $http.get('/api/permissions').then(
//       function (success: any) {
//          // Define a 'permConst' module which will be used by Auth service as first data.
//          angular.module('permConst', []).constant('permConst', success.data);
//          // Start application manually.
//          angular.element(document).ready(function () {
//             angular.bootstrap(document, ['eygle']);
//          });
//       });
// })();