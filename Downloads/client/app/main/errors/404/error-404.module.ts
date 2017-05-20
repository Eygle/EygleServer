/**
 * Created by eygle on 4/26/17.
 */

angular
  .module('eygle.error-404', [])
  .config(($stateProvider) => {
    $stateProvider.state('eygle.error-404', {
      url: '/error-404',
      views: {
        'main@': {
          templateUrl: 'app/core/layouts/content-only.html',
          controller: 'MainController as vm'
        },
        'content@eygle.error-404': {
          template: '<div layout="column">'
          + '   <div class="header" layout="row" layout-align="center center">'
          + '      <h2 translate="ERRORS.404.TITLE"></h2>'
          + '   </div>'
          + '   <div layout="row" layout-align="center center">'
          + '      <p translate="ERRORS.404.LABEL"></p>'
          + '   </div>'
          + '   <div layout="row" layout-align="center center">'
          + '      <p><a ui-sref="eygle.home()" translate="RETURN_HOME"></a></p>'
          + '   </div>'
          + '</div>'
        }
      },
      resolve: {},
      bodyClass: 'error-404'
    });
  });