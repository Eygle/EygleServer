class SmartVirtualPageSelectDirective implements ng.IDirective {

  public controller;
  public controllerAs;
  public require;

  constructor() {
    this.controller = 'SmartVirtualPageSelectController';
    this.controllerAs = 'vm';
    this.require = this.require = ['^smartTablePagination'];
  }

  static factory() {
    const directive: any = () => new SmartVirtualPageSelectDirective();

    directive.$inject = [];
    return directive;
  }
}

angular.module('core')
  .directive('smartVirtualPageSelect', SmartVirtualPageSelectDirective.factory());
