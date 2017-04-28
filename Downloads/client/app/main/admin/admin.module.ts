/**
 * Created by eygle on 4/28/17.
 */
angular
    .module('eygle.admin', [
        'eygle.admin.panel-admin'
    ])
    .config(($stateProvider) => {
        $stateProvider.state('eygle.admin', {
            weight: 20,
            separator: true
        });
    });