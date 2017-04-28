/**
 * Created by eygle on 4/26/17.
 */
angular
    .module('eygle.admin.panel-admin', [])
    .config(($stateProvider) => {
        $stateProvider.state('eygle.admin.panel-admin', {
            url: '/panel-admin',
            icon: 'icon-lock',
            translate: 'ADMIN.PANEL.TITLE',
            weight: 21,
            views: {
                'content@eygle': {
                    template: '<panel-admin></panel-admin>',
                }
            },
            resolve: {},
            bodyClass: 'panel-admin'
        });
    });