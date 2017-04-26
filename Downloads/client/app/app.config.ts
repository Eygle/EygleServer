/**
 * Created by eygle on 4/26/17.
 */
class AppConfig {
    constructor(private $translateProvider: any,
                private $translatePartialLoaderProvider: any,
                private $windowProvider: any) {
        var $window = this.$windowProvider.$get();
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
    }
}

angular.module('eygle').config(AppConfig);
