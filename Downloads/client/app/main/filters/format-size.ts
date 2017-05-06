/**
 * Created by Eygle on 15/02/2017.
 */

class FormatSizeFilter {
  public static filter() {
    return (bytes) => {
      if (!bytes) return '-';

      const precision = 1;
      const units = ['octets', 'ko', 'Mo', 'Go', 'To', 'Po'];
      const number = Math.floor(Math.log(bytes) / Math.log(1024));

      let result: String = (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision);

      if (result.length > 1 && result.substr(result.length - 2) === ".0") {
        result = result.substr(0, result.length - 2);
      }

      return result + ' ' + units[number];
    };
  }
}

angular.module('eygle')
  .filter("formatSize", FormatSizeFilter.filter);
