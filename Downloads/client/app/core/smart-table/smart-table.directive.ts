class SmartTableDirective implements ng.IDirective {

  public restrict;
  public controller;
  public controllerAs;
  public bindToController;
  public scope;

  constructor() {
    this.restrict = 'A';
    this.controller = 'SmartTableController';
    this.controllerAs = 'vm';
    this.scope = {};
    this.bindToController = {
      loading: '=smart' +
      'Progress'
    };
  }

  public compile = (tElement, tAttrs) => {
    tElement.addClass('smart-table');
    if (tAttrs.hasOwnProperty('smartProgress')) {
      const body = tElement.find('tbody')[0];
      const progress = angular.element('<thead class="smart-table-progress" smart-table-progress>');

      if (body) {
        tElement[0].insertBefore(progress[0], body);
      }
    }
  };

  static factory() {
    const directive: any = () => new SmartTableDirective();

    directive.$inject = [];
    return directive;
  }
}

angular.module('core')
  .directive('smartTable', SmartTableDirective.factory());
