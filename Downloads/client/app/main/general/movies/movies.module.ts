/**
 * Created by eygle on 4/26/17.
 */
angular
    .module('eygle.movies', [])
    .config(($stateProvider) => {
        $stateProvider.state('eygle.movies', {
            url: '/movies',
            icon: 'icon-movie',
            translate: 'GENERAL.MOVIES.TITLE',
            weight: 3,
            views: {
                'content@eygle': {
                    template: '<movies></movies>',
                }
            },
            resolve: {},
            bodyClass: 'movies'
        });
    });