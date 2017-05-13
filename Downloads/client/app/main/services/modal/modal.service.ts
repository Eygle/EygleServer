class ModalService {

  /** @ngInject */
  constructor(private $mdDialog: any,
              private $q: any) {
  }

  private _generatingBindingsName = (binding) => {
    let res = '';

    for (let i = 0; i < binding.length; ++i) {
      if (binding[i] == binding[i].toLowerCase()) {
        res += binding[i];
      } else {
        res += '-' + binding[i].toLowerCase();
      }
    }
    return res;
  };

  /**
   * Generate a template for the modal depending of the component
   * @param componentName The component name
   * @param bindings The component bindings
   * @returns {string} The template
   * @private
   */
  private _generateTemplate = (componentName, bindings) => {
    let tpl = '';

    tpl += '<' + componentName;
    for (const key in bindings) {
      if (bindings.hasOwnProperty(key)) {
        tpl += ' ' + this._generatingBindingsName(key) + '="vm.' + key + '"';
      }
    }
    tpl += '></' + componentName + '>';
    return tpl;
  };

  /**
   * Generate the resolve object to bind the component dependencies
   * @param bindings The component bindings
   * @returns {Object} The resolve object newly created
   * @private
   */
  private _generateResolve = (bindings) => {
    const resolve = {};

    // Use to save the loop closure else the closure will be override by the next one
    function saveClosure(ret) {
      return function () {
        return ret;
      };
    }

    for (const key in bindings) {
      if (bindings.hasOwnProperty(key)) {
        resolve[key] = saveClosure(bindings[key]);
      }
    }
    return resolve;
  };

  /**
   * Show the modal
   * @param options Provides options for the modal
   *  - `component` - `{string}`: The component name.
   *  - `bindings` - `{object}`: The component bindings.
   *  - `ev` - `{DOMClickEvent}`: A click's event object. When passed in as an option, the location of the click will be used as the starting point for the opening animation of the the dialog.
   *  - `escapeToClose` - `{boolean}`: Whether the user can press escape to close the modal.
   * @returns {Promise<T>|IPromise<T>}
   */
  public show = (options) => {
    const defer = this.$q.defer();

    this.$mdDialog.show({
      template: this._generateTemplate(options.component, options.bindings),
      parent: options.parent || angular.element(document.body),
      targetEvent: options.ev,
      escapeToClose: options.escapeToClose,
      clickOutsideToClose: options.escapeToClose !== undefined ? options.escapeToClose : true,
      multiple: true,
      controller: class ModalConstructor {
        constructor() {
        }
      },
      controllerAs: 'vm',
      bindToController: true,
      resolve: this._generateResolve(options.bindings)
    }).then((answer) => {
      defer.resolve(answer);
    }).catch(() => {
      defer.reject();
    });
    return defer.promise;
  };

  /**
   *
   */
  public cancel = (err) => {
    this.$mdDialog.cancel(err);
  };

  /**
   *
   * @param answer
   */
  public close = (answer) => {
    this.$mdDialog.hide(answer);
  };

}

angular.module('eygle.services.modal')
  .service('ModalService', ModalService);
