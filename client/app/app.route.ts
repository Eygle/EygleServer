/**
 * Created by eygle on 4/26/17.
 */
class RouteConfig {
   constructor(private $stateProvider: any,
               private $urlRouterProvider: any,
               private $locationProvider: any) {
      $urlRouterProvider.rule(function ($injector, $location) {
         if ($location.protocol() === 'file')
            return;

         const path = $location.path();

         // check to see if the path already ends in '/'
         if (path[path.length - 1] === '/') {
            return path.substring(0, path.length - 1);
         }
      });


      $locationProvider.html5Mode(true);

      $urlRouterProvider.otherwise('/error-404');

      // FIX for trailing slashes. Gracefully "borrowed" from https://github.com/angular-ui/ui-router/issues/50

      // State definitions
      $stateProvider
         .state('eygle', {
            abstract: true,
            views: {
               'main@': {
                  templateUrl: 'app/core/layouts/corps.html',
                  controller: 'MainController as vm'
               },
               'navigation@eygle': {
                  templateUrl: 'app/core/navigation/navigation.html',
                  controller: 'NavigationController as vm'
               }
            }
         })
   }
}

angular.module('eygle').config(RouteConfig);