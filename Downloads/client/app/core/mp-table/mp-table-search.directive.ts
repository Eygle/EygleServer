class MpTableSearchDirective implements ng.IDirective {

  public require;

  constructor() {
    this.require = this.require = ['^stTable'];
  }

  public link = (scope, iElement, iAttrs, ctrls) => {
    const stTableCtrl = ctrls[0];
    const searchElem = angular.element(document.getElementById("mp-table-search"));
    const predicates = iAttrs.mpTableSearch.split('|');
    const byString = (o, s) => {
      s = s.replace(/\[(\w+)\]/g, '.$1');
      s = s.replace(/^\./, '');
      const a = s.split('.');
      for (let i = 0, n = a.length; i < n; ++i) {
        const k = a[i];
        if (k in o) {
          o = o[k];
        } else {
          return;
        }
      }
      return o;
    };

    if (searchElem.length > 0) {
      searchElem.on('keyup', (event) => {
        if (!stTableCtrl.tableState().search.predicateObject)
          stTableCtrl.tableState().search.predicateObject = {};
        stTableCtrl.tableState().search.predicateObject.mpSearch = (value, index, array) => {
          for (const pred of predicates) {
            if (byString(value, pred)) {
              const lower = byString(value, pred).toLowerCase();

              if (~lower.indexOf(event.target.value.toLowerCase())) {
                return true;
              }
            }
          }
          return false;
        };
        scope.$evalAsync((scope) => {
          stTableCtrl.search(event.target.value);
        });
      });
    }

  };

  static factory() {
    const directive = () => new MpTableSearchDirective();

    directive.$inject = [];
    return directive;
  }
}

angular.module('core')
  .directive('mpTableSearch', MpTableSearchDirective.factory());
