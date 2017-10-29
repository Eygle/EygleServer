/**
 * Created by eygle on 5/6/17.
 */

class DurationFilter {
   public static filter() {
      return (minutes) => {
         const hours = Math.floor(minutes / 60);
         minutes = minutes % 60;

         return hours + 'h ' + (minutes < 10 ? '0' + minutes : minutes) + 'm';
      };
   }
}

angular.module('eygle')
   .filter("duration", DurationFilter.filter);