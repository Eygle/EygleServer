/**
 * Created by eygle on 4/26/17.
 */
angular
    .module('eygle.home', [])
    .config(configHome);

/** @ngInject */
function configHome($stateProvider)
{
    console.log("config home module");
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
