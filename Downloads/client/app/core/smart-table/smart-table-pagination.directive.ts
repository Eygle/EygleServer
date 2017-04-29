class SmartTablePaginationDirective implements ng.IDirective {

  public restrict;
  public scope;
  public templateUrl;
  public controller;
  public controllerAs;
  public require;
  public priority;

  constructor() {
    this.restrict = 'A';
    this.scope = {};
    this.templateUrl = "app/core/smart-table/templates/smart-table-pagination-wrapper.html";
    this.controller = "SmartTablePaginationController";
    this.controllerAs = 'vm';
    this.require = ['^mpTable'];
    this.priority = 500;

  }

  public compile = (tElement) => {
    return (scope, iElement, iAttrs, ctrls) => {
      const tableCtrl = ctrls[0];

      scope.vm.columns = tableCtrl.columns;
    };
  };

  static factory() {
    const directive: any = () => new SmartTablePaginationDirective();

    directive.$inject = [];
    return directive;
  }
}

angular.module('core')
  .directive('smartTablePagination', SmartTablePaginationDirective.factory());
