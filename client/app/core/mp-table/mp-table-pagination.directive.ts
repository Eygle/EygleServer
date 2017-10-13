class MpTablePaginationDirective implements ng.IDirective {

  public restrict;
  public scope;
  public templateUrl;
  public controller;
  public controllerAs;
  public require;
  public priority;

  constructor() {
    this.restrict = 'A';
    this.scope = {
      stItemsByPage: '=?'
    };
    this.templateUrl = "app/core/mp-table/templates/mp-table-pagination-wrapper.html";
    this.controller = "MpTablePaginationController";
    this.controllerAs = 'vm';
    this.require = ['^mpTable'];
    this.priority = 500;

  }

  public compile = (tElement) => {
    const postLink = (scope, iElement, iAttrs, ctrls) => {
      const mpTableCtrl = ctrls[0];

      scope.vm.columns = mpTableCtrl.columns;
    };

    return postLink;
  };

  static factory() {
    const directive = () => new MpTablePaginationDirective();

    directive.$inject = [];
    return directive;
  }
}

angular.module('core')
  .directive('mpTablePagination', MpTablePaginationDirective.factory());
