class ModalConfirmComponent {
  public controller: string;
  public controllerAs: string;
  public templateUrl: string;
  public bindings: any;

  constructor() {
    this.controller = 'ModalConfirmController';
    this.controllerAs = 'vm';
    this.templateUrl = 'app/main/services/modal/modal-confirm/modal-confirm.html';
    this.bindings = {
      data: '<'
    };
  }
}

angular.module('eygle.services.modal')
  .component('modalConfirm', new ModalConfirmComponent());
