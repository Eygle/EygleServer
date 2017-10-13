import fs = require('fs');
import path = require('path');
import Permissions from '../modules/Permissions';
import Utils from "../config/Utils";
import {CustomEdError} from "../config/EdError";
import {EHTTPStatus} from "../typings/enums";

class Resty {
	private static _resources: any;

	/**
	 * Express middleware used for http connexions
	 * @param resourceDir
	 * @return {(req:any, res:any)=>undefined}
	 */
	public static httpMiddleware(resourceDir): Function {
		try {
			if (!this._resources) {
				this._resources = this._readResources(resourceDir);
			}

			return (req, res, next) => {
				const method = req.method.toLowerCase();
				const context = <IRestyContext>{
					data: method === 'get' ? req.query : req.body,
					user: req.user,
					req: req,
					ensureAuthorized: Permissions.ensureAuthorized
				};

				const { args, resource, error } = Resty._middlewareCommon(req.url, method, context);

				if (error) {
					return next(error);
				}

				args.push((data = undefined) => {
					if (data instanceof Error) {
						return next(data);
					}
					this._send(res, data);
				});

				args.unshift(context);
				// resource[method].data = context.data;
				// resource[method].user = context.user;
				// resource[method].req = context.req;
				// resource[method].ensureAuthorized = context.ensureAuthorized;
				resource[method].apply(this, args);
			};
		} catch (e) {
			Utils.logger.error('Resty error:', e);
		}
	}

	/**
	 * Send response
	 * @param res
	 * @param response
	 * @param code
	 * @private
	 */
	private static _send(res, response: any, code: number = 200) {
		res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
		res.setHeader("Pragma", "no-cache"); // HTTP 1.0.

		if (response === undefined) {
			res.sendStatus(code);
		}
		else {
			res.status(code).json(response);
		}
	}

	/**
	 * Common to both middleware
	 * This will return the arguments and the resource to use based on the given url and method
	 * @param url
	 * @param method
	 * @param context
	 * @return {{args: Array, resource: *, error: null}}
	 */
	private static _middlewareCommon(url, method, context): { args, resource, error } {
		const ret = {
			args: [],
			resource: this._resources,
			error: null
		};
		let collection = false;
		const components = url.split('?')[0].split('/');
		components.shift();
		components.shift();

		// Makes '/example/' and '/example' equivalent
		if (components[components.length - 1] === '') {
			components.pop();
		}

		for (let i = 0; i < components.length; i++) {
			ret.resource = ret.resource[components[i]];

			if (!ret.resource) {
				ret.error = new CustomEdError('Resource not found', EHTTPStatus.NotFound);
				return ret;
			}

			if ((i + 1) < components.length) {
				if (Utils.isMongoId(components[i + 1])) { // Use next component as a resource id
					ret.args.push(components[i + 1]);
					i++;
				}
			}
			else {
				collection = true;
			}
		}

		ret.resource = collection ? ret.resource._main.Collection : ret.resource._main.Resource;

		if (!ret.resource || !ret.resource[method]) {
			ret.error = new CustomEdError('Method not found', EHTTPStatus.NotFound);
			return ret;
		}

		for (let a of ret.args) {
			if (!Utils.isMongoId(a)) {
				ret.error = new CustomEdError(`Invalid mongo id ${a}`, EHTTPStatus.BadRequest);
				return ret;
			}
		}

		if (ret.resource.permissions) {
			const permission = ret.resource.permissions[method] || ret.resource.permissions.default;
			if (permission && !context.ensureAuthorized(context.user, permission)) {
				ret.error = new CustomEdError(`Permission denied (${permission}) for user ${context.user ? context.user.email : '[null]'}`, EHTTPStatus.Forbidden);
			}
		}

		return ret;
	}

	/**
	 * Read folder and return list of files
	 * @param resourceDir
	 * @return {{}}
	 * @private
	 */
	private static _readResources(resourceDir): any {
		const resources = {};

		for (let filename of fs.readdirSync(resourceDir)) {
			const folder = path.join(resourceDir, filename);
			const file = path.join(folder, filename + '.js');
			const stat = fs.statSync(folder);

			if (stat.isDirectory()) {
				resources[filename] = this._readResources(folder);
				if (fs.existsSync(file)) {
					resources[filename]._main = require(file);
				}
			}
		}

		return resources;
	}

	/**
	 * The route identifier  become the socket topic
	 * @param url
	 * @return {string}
	 */
	private static _exportTopicFromUrl(url) {
		const parts = url.split('/');
		const topicParts = [];
		let path = __dirname + '/../app/mapui';

		for (let p of parts) {
			if (!p) continue;
			if (fs.existsSync(path + "/" + p)) {
				topicParts.push(p);
				path += "/" + p;
			}
		}

		return topicParts.join("-");
	}
}

export default Resty;

export class RoutePermissions implements IRoutePermissions {
	public 'default': string;
	public get: string;
	public post: string;
	public put: string;
	public 'delete': string;

	constructor(def: string, get: string = null, postOrPut: string = null, del: string = null) {
		this.default = def;
		this.get = get;
		this.post = this.put = postOrPut;
		this.delete = del;
	}
}

export abstract class ARoutes {
	public user: IUser;

	/**
	 * Request data
	 */
	public data: any;

	/**
	 * Express request
	 */
	public req: any;

	/**
	 * Permission function
	 */
	public ensureAuthorized: any;
}