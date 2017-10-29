class MpTableDirective implements ng.IDirective {

   public restrict;
   public controller;
   public controllerAs;
   public bindToController;
   public scope;

   constructor() {
      this.restrict = 'A';
      this.controller = 'MpTableController';
      this.controllerAs = 'vm';
      this.scope = {};
      this.bindToController = {
         loading: '=mpProgress'
      };
   }

   public compile = (tElement, tAttrs) => {
      tElement.addClass('mp-table');
      if (tAttrs.hasOwnProperty('mpProgress')) {
         const body = tElement.find('tbody')[0];
         const progress = angular.element('<thead class="mp-table-progress" mp-table-progress>');

         if (body) {
            tElement[0].insertBefore(progress[0], body);
         }
      }
   };

   static factory() {
      const directive = () => new MpTableDirective();

      directive.$inject = [];
      return directive;
   }
}

angular.module('core')
   .directive('mpTable', MpTableDirective.factory());
