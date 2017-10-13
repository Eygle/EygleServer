class MpVirtualPageSelectController {

  private _content;
  private _watchers;
  private _total;

  public pages;

  /** @ngInject */
  constructor(private $element: any, private $scope: any) {
    this.pages = [];
    this._watchers = [];
    this._total = 0;
  }

  $onInit() {
    this._content = this.$element.find('md-content');
    this._content.on('scroll', () => {
      if ((this._content.prop('clientHeight') + this._content.prop('scrollTop')) >= this._content.prop('scrollHeight')) {
        this.$scope.$applyAsync(() => {
          this._setPages(this._getMin(this.pages.length + 10, this._total));
        });
      }
    });

    this._watchers.push(this.$scope.$watch('stItemsByPage', (total) => {
      this._total = this.$scope.totalItemCount / this.$scope.stItemsByPage;
    }));

    this._watchers.push(this.$scope.$watch('totalItemCount', (total) => {
      this._total = this.$scope.totalItemCount / this.$scope.stItemsByPage;
      this._setPages(this._getMin(Math.max(this.pages.length, 10), total));
    }));

    this._watchers.push(this.$scope.$watch('currentPage', (page) => {
      for (let i = this.pages.length; i < page; i++) {
        this.pages.push(i + 1);
      }
    }));

  }

  $onDestroy() {
    for (const watcher of this._watchers) {
      watcher();
    }
  }

  private _getMin = (pages, total) => {
    return Math.min(pages, isFinite(total) && this._isPositive(total) ? total : 1);
  };

  private _isPositive = (number) => {
    return number > 0;
  };

  private _setPages = (max) => {
    if (this.pages.length > max) {
      return this.pages.splice(max);
    }

    for (let i = this.pages.length; i < max; i++) {
      this.pages.push(i + 1);
    }
  };
}

angular.module('core')
  .controller('MpVirtualPageSelectController', MpVirtualPageSelectController);
