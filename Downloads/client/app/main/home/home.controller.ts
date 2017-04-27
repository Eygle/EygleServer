/**
 * Created by eygle on 4/26/17.
 */

class HomeController {
    constructor() {
        console.log("inside home ctrl");
    }

    $onInit() {}
}

angular.module('eygle.home')
    .controller('HomeController', HomeController);