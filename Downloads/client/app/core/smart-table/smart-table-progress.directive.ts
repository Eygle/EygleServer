class SmartTableProgressDirective implements ng.IDirective {

  public require;
  public controller;
  public controllerAs;
  public templateUrl;
  public restrict;
  public scope;

  constructor() {
    this.restrict = 'A';
    this.require = ['^smartTable'];
    this.controller = 'SmartTableProgressController';
    this.controllerAs = 'vm';
    this.templateUrl = 'app/core/smart-table/templates/smart-table-progress.html';
    this.scope = {};

  }

  public compile = (tElement) => {
    return (scope, iElement, iAttrs, ctrls) => {
      const tableCtrl = ctrls[0];

      scope.vm.columns = tableCtrl.columns;
      scope.vm.loading = tableCtrl.loading;
    };
  };

  static factory = () => {
    const directive = () => new SmartTableProgressDirective();

    directive.$inject = [];
    return directive;
  }
}

angular.module('core')
  .directive('smartTableProgress', SmartTableProgressDirective.factory());
