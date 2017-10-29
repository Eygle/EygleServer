class MpTableProgressDirective implements ng.IDirective {

   public require;
   public controller;
   public controllerAs;
   public templateUrl;
   public restrict;
   public scope;

   constructor() {
      this.restrict = 'A';
      this.require = ['^mpTable'];
      this.controller = 'MpTableProgressController';
      this.controllerAs = 'vm';
      this.templateUrl = 'app/core/mp-table/templates/mp-table-progress.html';
      this.scope = {};

   }

   public compile = (tElement) => {
      const postLink = (scope, iElement, iAttrs, ctrls) => {
         const mpTableCtrl = ctrls[0];

         scope.vm.columns = mpTableCtrl.columns;
         scope.vm.loading = mpTableCtrl.loading;
      };

      return postLink;
   };

   static factory = () => {
      const directive = () => new MpTableProgressDirective();

      directive.$inject = [];
      return directive;
   }
}

angular.module('core')
   .directive('mpTableProgress', MpTableProgressDirective.factory());
