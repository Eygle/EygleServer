/**
 * Created by eygle on 5/11/17.
 */

class MediaProposalsComponent {
  public controller: string;
  public controllerAs: string;
  public templateUrl: string;

  constructor() {
    this.controller = 'MediaProposalsController';
    this.controllerAs = 'vm';
    this.templateUrl = 'app/main/admin/panel-admin/media-proposals/media-proposals.html';
  }
}

angular.module('eygle.admin.panel-admin')
  .component('mediaProposals', new MediaProposalsComponent());