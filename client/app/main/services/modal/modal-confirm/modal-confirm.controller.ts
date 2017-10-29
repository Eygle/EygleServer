class ModalConfirmController {

   public data;

   constructor(private ModalService: any) {
   };

   public ok = () => {
      this.ModalService.close();
   };

   public cancel = () => {
      this.ModalService.cancel();
   };
}


angular.module('eygle.services.modal')
   .controller('ModalConfirmController', ModalConfirmController);
