/**
 * Created by eygle on 4/26/17.
 */
angular
    .module('mapui.home', [
    ])
    .config(configHome);

/** @ngInject */
function configHome($stateProvider, RoutingConfigProvider, msNavigationServiceProvider)
{
    // Navigation
    msNavigationServiceProvider.saveItem('home', {
        title: 'Home',
        icon: 'icon-home',
        state: 'eygle.home',
        weight: 1,
        translate: 'NAVIGATION.HOME'
    });

    $stateProvider.state('eygle.home', {
        url: '/',
        data: {
            access: true
        },
        views: {
            'content@eygle': {
                template: '<home></home>',
            }
        },
        resolve: {},
        bodyClass: 'home'
    });
}
