class MpVirtualPageSelectDirective implements ng.IDirective {

  public controller;
  public controllerAs;
  public require;

  constructor() {
    this.controller = 'MpVirtualPageSelectController';
    this.controllerAs = 'vm';
    this.require = this.require = ['^mpTablePagination'];
  }

  static factory() {
    const directive = () => new MpVirtualPageSelectDirective();

    directive.$inject = [];
    return directive;
  }
}

angular.module('core')
  .directive('mpVirtualPageSelect', MpVirtualPageSelectDirective.factory());
