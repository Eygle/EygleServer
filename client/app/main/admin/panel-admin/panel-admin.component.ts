/**
 * Created by eygle on 4/26/17.
 */

class PanelAdminComponent {
   public controller: string;
   public controllerAs: string;
   public templateUrl: string;

   constructor() {
      this.controller = 'PanelAdminController';
      this.controllerAs = 'vm';
      this.templateUrl = 'app/main/admin/panel-admin/panel-admin.html';
   }
}

angular.module('eygle.admin.panel-admin')
   .component('panelAdmin', new PanelAdminComponent());
