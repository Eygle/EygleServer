/**
 * Created by eygle on 4/26/17.
 */

angular
    .module('eygle.home', ['ui.router'])
    .config(($stateProvider) => {
        $stateProvider.state('eygle.home', {
            url: '/',
            icon: 'icon-home',
            translate: 'GENERAL.HOME.TITLE',
            weight: 1,
            views: {
                'content@eygle': {
                    template: '<home></home>',
                }
            },
            resolve: {},
            bodyClass: 'home'
        });
    });