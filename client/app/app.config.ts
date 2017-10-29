/**
 * Created by eygle on 4/26/17.
 */
class AppConfig {
   constructor($translateProvider: any,
               $translatePartialLoaderProvider: any,
               $windowProvider: any,
               $mdThemingProvider: any) {
      var $window = $windowProvider.$get();
      var lang = $window.navigator.language || $window.navigator.userLanguage;

      $translateProvider.useLoader('$translatePartialLoader', {
         urlTemplate: '{part}/i18n/{lang}.json'
      });
      if (lang.split('-')[0] === 'fr') {
         $translateProvider.preferredLanguage('fr');
      }
      else {
         $translateProvider.preferredLanguage('en');
      }
      $translateProvider.useSanitizeValueStrategy(null);
      $translateProvider.useCookieStorage();
      $translatePartialLoaderProvider.addPart('app');

      $mdThemingProvider.theme('default')
         .primaryPalette('blue-grey')
         .accentPalette('amber');
   }
}

angular.module('eygle').config(AppConfig);
