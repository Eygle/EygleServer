angular
    .module('eygle.login', [])
    .config(($stateProvider) => {
        $stateProvider.state('eygle.login', {
            url: '/login',
            views: {
                'main@': {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@eygle': {
                    template: '<login></login>',
                }
            },
            resolve: {},
            bodyClass: 'files'
        });
    });