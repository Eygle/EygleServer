/**
 * Created by eygle on 5/7/17.
 */

class DurationFilter {
  public static filter() {
    return (total) => {
      const amount = total.toString();
      let res = "";

      let c = 0;
      for (let i = amount.length - 1; i >= 0; i--) {
        if (c % 3 === 0 && c > 0) {
          res = ',' + res;
        }
        res = amount[i] + res;
        c++;
      }

      return '$' + res;
    };
  }
}

angular.module('eygle')
  .filter("dollarCurrency", DurationFilter.filter);