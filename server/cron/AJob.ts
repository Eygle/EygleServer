import * as tracer from "tracer";

import Utils from "../config/Utils";
import {EEnv} from "../typings/enums";

abstract class AJob implements ICronJob {
	/**
	 * Logger
	 */
	protected logger: ILogger;

	/**
	 * Task name
	 */
	public name: string;

	/**
	 * Job schedule rule
	 */
	public scheduleRule: string;

	/**
	 * Job status
	 */
	public status: string;

	/**
	 * Limited to specific environments (no limit if not set)
	 */
	public environments: Array<EEnv>;

   /**
	 * Job previous status
    */
	private _previousStatus: string;

	constructor(name: string) {
		this.name = name;
		if (EEnv.Prod === Utils.env || EEnv.Preprod === Utils.env) {
			this.logger = (<any>tracer).dailyfile({
				                                      root: `${Utils.root}/logs`,
				                                      maxLogFiles: 10,
				                                      allLogsFileName: `mapui-${this._formatName()}`,
				                                      format: "{{timestamp}} <{{title}}> {{message}}",
				                                      dateformat: "HH:MM:ss.L"
			                                      });
		}
		else {
			this.logger = (<any>tracer).colorConsole({
				                                         format: "{{timestamp}} <{{title}}> {{message}}",
				                                         dateformat: "HH:MM:ss.L"
			                                         });
		}
	}

	/**
	 * Allow to execute AJob instance of execute
	 * @return {() => any}
	 */
	public getExecutable() {
		return () => {
			this.execute();
		};
	}

	/**
	 * Execute service
	 */
	protected execute() {
		this._previousStatus = this.status || 'schedule';
		this.status = "running";
		this.logger.log(`Start task ${this.name}`);
	};

	/**
	 * end of service
	 */
	protected end() {
		this.status = this._previousStatus;
		this.logger.log(`End of task ${this.name}`);
	};

	/**
	 * Format name for log filename
	 * @return {string}
	 * @private
	 */
	private _formatName(): string {
		return this.name.match(/([A-Z][a-z]+)/g).join('-').toLowerCase();
	}
}

export default AJob;