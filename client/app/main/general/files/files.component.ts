/**
 * Created by eygle on 4/29/17.
 */

class FilesComponent {
   public controller: string;
   public controllerAs: string;
   public templateUrl: string;

   constructor() {
      this.controller = 'FilesController';
      this.controllerAs = 'vm';
      this.templateUrl = 'app/main/general/files/files.html';
   }
}

angular.module('eygle.files')
   .component('files', new FilesComponent());