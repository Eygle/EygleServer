import * as q from "q";
import * as sizeof from "object-sizeof";

import Utils from '../config/Utils';

class Cache {
	/**
	 * Node cache instance
	 */
	private _data: any;

	/**
	 * Cache size in bytes
	 */
	private _size: number;

	/**
	 * Number of keys in cache
	 */
	private _keys: number;

	/**
	 * Cache max size (bytes)
	 */
	private _maxSize: number;

	constructor() {
		this._data = {};
		this._size = 0;
		this._keys = 0;
		this._maxSize = 1024 * 1024 * 50; // 50MB

		setInterval(() => {
			this._removeExpired();
		}, 3600000);
	}

	/**
	 * Get cache item for given key
	 * @param {string} key
	 */
	public get(key: string): any {
		const entry = this._data[key];

		if (!entry) return null;
		if (entry.t && entry.t <= Date.now()) {
			this.remove(key, true);
			return null;
		}
		entry.u = Date.now();
		return entry.d;
	}

	/**
	 * Set cache item for given key
	 * @param {string} key
	 * @param value
	 * @param {number} TTL Time To Live (seconds)
	 */
	public set(key: string, value: any, TTL: number = 0): void {
		const previous = this._data[key];
		const entry = {
			t: TTL > 0 ? Date.now() + (TTL * 1000) : null,
			d: value,
			s: 0,
			u: Date.now()
		};

		entry.s = sizeof(entry) + sizeof(key);

		let action = `Added '${key}' to cache`;
		if (previous) {
			this._size -= previous.s;
			action = `Replaced '${key}' in cache`;
		}
		else {
			this._keys++;
		}

		this._data[key] = entry;
		this._size += entry.s;
		Utils.logger.trace(`${action} ${this._info()}`);
		this._checkCacheSize();
	}

	/**
	 * Remove key from cache
	 * @param {string} key
	 * @param {boolean} sendLBMsg
	 * @param expired
	 * @param log
	 */
	public remove(key: string, expired: boolean = false, log = true): void {
		const entry = this._data[key];

		if (entry) {
			delete this._data[key];
			this._size -= entry.s;
			this._keys--;
			if (log) {
				Utils.logger.trace(`Removed ${expired ? 'expired ' : ''}'${key}' from cache ${this._info()}`);
			}
		}
	}

	private _info() {
		return `(total: ${this._keys} keys - ${Utils.formatSize(this._size)})`;
	}

	/**
	 * Check cache size and remove oldest items if size exceed maximum
	 * @param {number} size
	 * @return {Q.Promise<void>}
	 * @private
	 */
	private _checkCacheSize(): q.Promise<any> {
		const defer = q.defer();

		if (this._maxSize && this._size > this._maxSize) {
			setTimeout(() => {
				// First remove expired values
				this._removeExpired();

				const limit = this._maxSize * 0.75; // Remove elements until cache size is under 3/4 of max size
				let nbr = 0;
				while (this._size > limit) {
					this._removeOldestValue();
					nbr++;
				}
				Utils.logger.info(`Cache size exceeded (${Utils.formatSize(this._maxSize)}). ${nbr} elements where removed. ${this._info()}`);
			});
		}
		defer.resolve();
		return defer.promise;
	}

	/**
	 * Remove expired cached values
	 * @private
	 */
	private _removeExpired() {
		const now = Date.now();
		for (let i in this._data) {
			if (this._data.hasOwnProperty(i) && this._data[i].t <= now) {
				this.remove(i, true);
			}
		}
	};

	/**
	 * Remove oldest value from cache
	 * @private
	 */
	private _removeOldestValue() {
		let key = null;
		let date = null;
		for (let i in this._data) {
			if (this._data.hasOwnProperty(i) && (!date || this._data[i].u <= date)) {
				date = this._data[i].u;
				key = i;
			}
		}

		if (key) {
			this.remove(key, false, false);
		}
	}
}

export default new Cache();