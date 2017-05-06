/**
 * Created by eygle on 4/29/17.
 */

class Api {
  public tvShows;
  public movies;
  public files;

  public user;

  public requests;

  constructor(private $resource: any) {
    this.tvShows = this.$resource('/api/tv-shows/:id', {id: '@_id'}, {
      get: {method: 'GET', isArray: true}
    });

    this.movies = this.$resource('/api/movies/:id', {id: '@id'}, {
      get: {method: 'GET'},
      all: {method: 'GET', isArray: true}
    });

    this.files = this.$resource('/api/files/:id', {id: '@_id'}, {
      get: {method: 'GET', isArray: true}
    });

    this.user = this.$resource('/api/users/:id', {id: '@_id'}, {
      get: {method: 'GET', isArray: true},
      save: {method: 'PUT'},
      delete: {method: 'DELETE'}
    });

    this.requests = this.$resource('/api/requests/:id', {id: '@_id'}, {
      get: {method: 'GET', isArray: true},
      add: {method: 'POST'},
      save: {method: 'PUT'},
      delete: {method: 'DELETE'}
    });
  }
}

angular.module('eygle.services').service('Api', Api);