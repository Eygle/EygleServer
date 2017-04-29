class SmartTableController {

  private _columns;

  public loading;

  public get columns() {
    if (!this._columns)
      this._countColumns();
    return this._columns;
  }

  /** @ngInject */
  constructor(private $element: any) {
  }

  private _countColumns = () => {
    this._columns = Array.prototype.filter.call(this.$element[0].rows, (row) => {
      return !row.classList.contains('ng-leave');
    })
      .reduce((acc, current) => {
        return current.cells.length > acc ? current.cells.length : acc;
      }, 1);
  };
}

angular.module('core')
  .controller('SmartTableController', SmartTableController);
