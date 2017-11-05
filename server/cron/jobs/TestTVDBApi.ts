import AJob from "../AJob";
import TVDB, {ITVDBEpisode, ITVDBShow} from "../../modules/TVDB";
import {EEnv} from "../../typings/enums";


class TestTVDBApi extends AJob {

   constructor() {
      super(TestTVDBApi.name);
      this.scheduleRule = "* * * * *";
      this.environments = [EEnv.Prod];
   }

   /**
    * Run service
    */
   public run(): void {
      super.run();

      for (let title of [
         "a series of unfortunate events",
         "family guy",
         "the last man on earth",
         "suits"
      ]) {
         TVDB.searchByTitle(title)
            .then(() => this.logger.log(title, "OK"))
            .catch((err) => this.logger.error(title, "KO"))
      }

      this.end();
   }
}

module.exports = new TestTVDBApi();