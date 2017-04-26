/**
 * Created by eygle on 4/26/17.
 */

angular
    .module('eygle.error-404', [])
    .config(config);

/** @ngInject */
function config($stateProvider)
{
    // State
    $stateProvider.state('eygle.error-404', {
        url      : '/error-404',
        views: {
            'content@eygle': {
                template: '<div class="error"><h1>Erreur 404</h1><h2>Page not found</h2></div>',
            }
        },
        resolve: {},
        bodyClass: 'error-404'
    });

    // Translation
}