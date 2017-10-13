import * as q from 'q';
import * as os from 'os';
import * as clamscan from 'clamscan';

import Utils from '../config/Utils';

class Antivirus {
	/**
	 * Clamscan path
	 */
	private _binPath: string;

	/**
	 * ClamAV scanner
	 */
	private _clam;

	/**
	 * Log path
	 */
	private _logPath: string;

	constructor() {
		this._binPath = os.platform() == 'win32' ? 'C:\\Program Files\\ClamAV-x64\\clamscan.exe' : '/usr/local/bin/clamscan';
		this._logPath = os.platform() == 'win32' ? '../clamscan.log' : '/var/log/node-clam/all.log';
		this._clam = clamscan({
			                      remove_infected: true,
			                      scan_log: this._logPath,
			                      clamscan: {
				                      path: this._binPath
			                      },
			                      preference: 'clamscan'
		                      });
	}

	/**
	 * Check file using CLamAV
	 * @param file path
	 */
	public checkFile(file): Q.Promise<any> {
		const defer = q.defer();

		this._clam.is_infected(file, (err, file, is_infected) => {
			if (err) {
				Utils.logger.error("Error during virus scan", err);
				defer.reject(null);
			}

			if (is_infected) {
				defer.reject(null);
			}
			else {
				defer.resolve();
			}
		});

		return defer.promise;
	}
}

export default new Antivirus();
