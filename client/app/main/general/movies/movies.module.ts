/**
 * Created by eygle on 4/26/17.
 */
angular
   .module('eygle.movies', [])
   .config(($stateProvider) => {
      $stateProvider.state('eygle.movies', {
         url: '/movies',
         icon: 'icon-movie',
         translate: 'MOVIES.TITLE',
         weight: 3,
         views: {
            'content@eygle': {
               template: '<movies></movies>',
            }
         },
         access: EPermission.SeeMovies,
         resolve: {},
         bodyClass: 'movies'
      }).state('eygle.movies.details', {
         url: '/:id',
         views: {
            'content@eygle': {
               template: '<movie-details></movie-details>',
            }
         },
         access: EPermission.SeeMovies,
         resolve: {},
         bodyClass: 'movie-details'
      });
   });