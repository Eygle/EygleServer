import AJob from "../AJob";
import MediasManager from "../../modules/MediasManager"
import Utils from "../../config/Utils";

class SynchronizeMedias extends AJob {

    constructor() {
        super(SynchronizeMedias.name);
        this.scheduleRule = "* * * * *";
    }

    /**
     * Run service
     */
    public run(): void {
        super.run();

        MediasManager.synchronize()
            .catch(Utils.logger.error)
            .finally(() => {
                this.end();
            })
    }
}

module.exports = new SynchronizeMedias();