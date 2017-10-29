/**
 * Created by eygle on 4/26/17.
 */
angular
   .module('eygle.tv-shows', [])
   .config(($stateProvider) => {
      $stateProvider.state('eygle.tv-shows', {
         url: '/tv-shows',
         icon: 'icon-television',
         translate: 'TV_SHOWS.TITLE',
         weight: 2,
         views: {
            'content@eygle': {
               template: '<tv-shows></tv-shows>',
            }
         },
         access: EPermission.SeeTVShows,
         resolve: {},
         bodyClass: 'tv-shows'
      }).state('eygle.tv-shows.details', {
         url: '/:id',
         views: {
            'content@eygle': {
               template: '<tv-show-details></tv-show-details>',
            }
         },
         access: EPermission.SeeTVShows,
         resolve: {},
         bodyClass: 'tv-show-details'
      });
   });