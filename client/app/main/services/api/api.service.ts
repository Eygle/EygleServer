/**
 * Created by eygle on 4/29/17.
 */

class Api {
   public tvShows;
   public movies;
   public files;
   public proposals;
   public cron: any;

   public user;

   public requests;

   constructor(private $resource: any) {
      this.tvShows = {
         byId: this.$resource('/api/tv-shows/:id', {id: '@id'}, {
            get: {method: 'GET'},
            all: {method: 'GET', isArray: true},
            save: {method: 'PUT'}
         }),
         byTitle: this.$resource('/api/search-tv-show/:term', {term: '@term'}, {
            search: {method: 'GET', isArray: true}
         })
      };

      this.movies = {
         byId: this.$resource('/api/movies/:id', {id: '@id'}, {
            get: {method: 'GET'},
            all: {method: 'GET', isArray: true},
            save: {method: 'PUT'},
            unlink: {method: 'DELETE'}
         }),
         byTitle: this.$resource('/api/search-movies/:term', {term: '@term'}, {
            search: {method: 'GET', isArray: true}
         })
      };

      this.files = this.$resource('/api/files/:id', {id: '@_id'}, {
         get: {method: 'GET', isArray: true}
      });

      this.proposals = this.$resource('/api/admin/proposals/:id', {id: '@id'}, {
         get: {method: 'GET', isArray: true},
         choose: {method: 'PUT'},
         remove: {method: 'DELETE'}
      });

      this.cron = this.$resource('/api/admin/cron/', {}, {
         all: {method: 'GET', isArray: true},
         action: {method: 'POST'}
      });

      this.user = {
         general: this.$resource('/api/users/:id', {id: '@_id'}, {
            get: {method: 'GET', isArray: true},
            save: {method: 'PUT'},
            remove: {method: 'DELETE'}
         }),
         register: this.$resource('/register', {}, {
            query: {method: 'POST'}
         }),
         login: this.$resource('/login', {}, {
            query: {method: 'POST'}
         })
      };

      this.requests = this.$resource('/api/requests/:id', {id: '@_id'}, {
         get: {method: 'GET', isArray: true},
         add: {method: 'POST'},
         save: {method: 'PUT'},
         remove: {method: 'DELETE'}
      });
   }
}

angular.module('eygle.services').service('Api', Api);