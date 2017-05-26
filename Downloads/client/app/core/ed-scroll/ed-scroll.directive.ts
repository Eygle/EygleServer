/**
 * Created by eygle on 5/12/17.
 */

class EDScrollDirective {
  public restrict;

  constructor(private $timeout, private edScrollConfig) {
    this.restrict = 'AE';
  }

  public compile = (tElement) => {
    // Add class
    tElement.addClass('ed-scroll');

    return function postLink(scope, iElement, iAttrs) {
      var options = {};

      // If options supplied, evaluate the given
      // value. This is because we don't want to
      // have an isolated scope but still be able
      // to use scope variables.
      // We don't want an isolated scope because
      // we should be able to use this everywhere
      // especially with other directives
      if (iAttrs.edScroll) {
        options = scope.$eval(iAttrs.edScroll);
      }

      // Extend the given config with the ones from provider
      options = angular.extend({}, this.edScrollConfig.getConfig(), options);

      // Initialize the scrollbar
      this.$timeout(function () {
        PerfectScrollbar.initialize(iElement[0], options);
      }, 0);

      // Update the scrollbar on element mouseenter
      iElement.on('mouseenter', updateScrollbar);

      // Watch scrollHeight and update
      // the scrollbar if it changes
      scope.$watch(function () {
        return iElement.prop('scrollHeight');
      }, function (current, old) {
        if (angular.isUndefined(current) || angular.equals(current, old)) {
          return;
        }

        updateScrollbar();
      });

      // Watch scrollWidth and update
      // the scrollbar if it changes
      scope.$watch(function () {
        return iElement.prop('scrollWidth');
      }, function (current, old) {
        if (angular.isUndefined(current) || angular.equals(current, old)) {
          return;
        }

        updateScrollbar();
      });

      /**
       * Update the scrollbar
       */
      function updateScrollbar() {
        PerfectScrollbar.update(iElement[0]);
      }

      // Cleanup on destroy
      scope.$on('$destroy', function () {
        iElement.off('mouseenter');
        PerfectScrollbar.destroy(iElement[0]);
      });
    };
  };

  static factory() {
    const directive: any = ($timeout, edScrollConfig) => new EDScrollDirective($timeout, edScrollConfig);

    directive.$inject = ['$timeout', 'edScrollConfig'];
    return directive;
  }
}

/** @ngInject */
class edScrollConfigProvider {
  public defaultConfiguration: any;

  constructor() {
    this.defaultConfiguration = {
      wheelSpeed: 1,
      wheelPropagation: false,
      swipePropagation: true,
      minScrollbarLength: null,
      maxScrollbarLength: null,
      useBothWheelAxes: false,
      useKeyboard: true,
      suppressScrollX: false,
      suppressScrollY: false,
      scrollXMarginOffset: 0,
      scrollYMarginOffset: 0,
      stopPropagationOnClick: true
    };
  }

  config(configuration) {
    this.defaultConfiguration = angular.extend({}, this.defaultConfiguration, configuration);
  }

  /**
   * Service
   */
  public $get() {
    return {
      getConfig: getConfig
    };

    //////////

    /**
     * Return the config
     */
    function getConfig() {
      return this.defaultConfiguration;
    }
  };
}

angular.module('core')
  .provider('edScrollConfig', edScrollConfigProvider)
  .directive('edScroll', EDScrollDirective.factory());