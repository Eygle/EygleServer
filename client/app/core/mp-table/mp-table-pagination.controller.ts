class MpTablePaginationController {

   public columns;

   constructor() {
   }

   public totalPages = (totalItemCount, stItemsByPage) => {
      console.log("inside total pages")
      console.log(totalItemCount, stItemsByPage);
      return Math.ceil(totalItemCount / stItemsByPage);
   }
}

angular.module('core')
   .controller('MpTablePaginationController', MpTablePaginationController);
