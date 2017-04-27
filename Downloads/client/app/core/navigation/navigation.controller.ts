class NavigationController {
    public parts: Array<any>;

    constructor(public $state) {
        this.parts = [];

        for (let s of $state.get()) {
            if (s.weight) {
                this.parts.push(s);
            }
        }
    }
}

angular
    .module('eygle')
    .controller('NavigationController', NavigationController);