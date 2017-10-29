/**
 * Created by eygle on 5/13/17.
 */

class ModalIdentifyFileComponent {
   public controller: string;
   public controllerAs: string;
   public templateUrl: string;
   public bindings: any;

   constructor() {
      this.controller = 'ModalIdentifyFileController';
      this.controllerAs = 'vm';
      this.templateUrl = 'app/main/services/files/modal-identify-file/modal-identify-file.html';
      this.bindings = {
         file: '<'
      };
   }
}

angular.module('eygle.services.files')
   .component('modalIdentifyFile', new ModalIdentifyFileComponent);