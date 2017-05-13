/**
 * Created by eygle on 4/29/17.
 */

angular
  .module('eygle.files', ['smart-table'])
  .config(($stateProvider) => {
    $stateProvider.state('eygle.files', {
      url: '/files',
      icon: 'icon-file-multiple',
      translate: 'FILES.TITLE',
      weight: 4,
      views: {
        'content@eygle': {
          template: '<files></files>',
        }
      },
      resolve: {},
      bodyClass: 'files'
    }).state('eygle.files.file', {
      url: '/:id',
      views: {
        'content@eygle': {
          template: '<files></files>',
        }
      },
      resolve: {},
      bodyClass: 'files'
    });
  });