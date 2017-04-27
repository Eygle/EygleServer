class NavigationController {
    public parts: Array;

    constructor() {
        this.parts = [
            {icon: 'icon-home', label: 'Accueil', state: 'eygle.home'},
            {icon: 'icon-home', label: 'Séries', state: 'eygle.tvshow'},
            {icon: 'icon-home', label: 'Films', state: 'eygle.movies'},
        ];
    }
}

angular
    .module('eygle')
    .controller('NavigationController', NavigationController);