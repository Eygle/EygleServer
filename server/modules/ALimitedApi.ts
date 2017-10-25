import * as q from "q"

abstract class ALimitedApi {
    /**
     * Minimum interval (ms) between requests (see API limitation)
     */
    protected minRequestInterval: number;

    /**
     * Internal call queue
     */
    private _queue: Array<IApiQueueItem>;

    /**
     * Last call time
     */
    private _lastCalls: number;

    /**
     * Queue is processing
     */
    private _isProcessing: boolean;

    private _useCB: boolean;

    /**
     *
     * @param {boolean} cb do the request use callback ? (if not promises are used)
     */
    constructor(cb: boolean = false) {
        this._useCB = cb;
        this._queue = [];
        this._lastCalls = 0;
        this.minRequestInterval = 300;
    }

    /**
     * Request api
     * @param method
     * @param args
     * @return {Q.Promise<any>}
     */
    protected request(method: any, ...args) {
        const defer = q.defer();

        this._queue.push(<IApiQueueItem>{
            method: method,
            args: args,
            defer: defer
        });
        this._processQueue();

        return defer.promise;
    }

    /**
     * Process queue
     * @param {boolean} force
     * @private
     */
    private _processQueue(force: boolean = false) {
        if (!force && this._isProcessing) {
            return;
        }

        if (this._queue.length > 0) {
            this._isProcessing = true;
            const diff = Date.now() - this._lastCalls;
            if (diff > this.minRequestInterval) {
                this._lastCalls = Date.now();
                const item = this._queue.shift();

                this._callMethod(item)
                    .then(res => {
                        if (res) {
                            item.defer.resolve(res);
                        } else {
                            item.defer.reject(Error("No result"));
                        }

                        if (this._queue.length > 0) {
                            this._processQueue(true);
                        } else {
                            this._isProcessing = false;
                        }
                    })
                    .catch(err => item.defer.reject);
            } else {
                setTimeout(() => this._processQueue(true), this.minRequestInterval - diff);
            }
        }
    }

    /**
     * Do call method with arguments
     * @param {IApiQueueItem} item
     * @return {any}
     * @private
     */
    private _callMethod(item: IApiQueueItem) {
        if (this._useCB) {
            const defer = q.defer();

            item.method.apply(item.method, [...item.args, (err, res) => {
                if (err) {
                    defer.reject(err);
                } else {
                    defer.resolve(res);
                }
            }]);
            return defer.promise;
        }
        return item.method.apply(item.method, item.args);
    }
}

interface IApiQueueItem {
    method: any;
    args: any;
    defer: q.Deferred;
}

export default ALimitedApi;