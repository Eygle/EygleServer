/**
 * Created by eygle on 4/28/17.
 */
angular
    .module('eygle.profile', [
        'eygle.profile.my-account',
        'eygle.profile.settings'
    ])
    .config(($stateProvider) => {
        $stateProvider.state('eygle.profile', {
            weight: 10,
            separator: true
        });
    });