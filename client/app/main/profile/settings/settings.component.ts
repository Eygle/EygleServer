/**
 * Created by eygle on 4/26/17.
 */
class SettingsComponent {
   public controller: string;
   public controllerAs: string;
   public templateUrl: string;

   constructor() {
      this.controller = 'SettingsController';
      this.controllerAs = 'vm';
      this.templateUrl = 'app/main/profile/settings/settings.html';
   }
}

angular.module('eygle.profile.settings')
   .component('settings', new SettingsComponent());
