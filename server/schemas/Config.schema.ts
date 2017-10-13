import mongoose = require('mongoose');
import q = require('q');
import DB from '../modules/DB';
import ASchema from './ASchema.schema';

const _schema: mongoose.Schema = DB.createSchema({
	                                                 name: { type: String, required: true },
	                                                 data: mongoose.Schema.Types.Mixed
                                                 }, false);

class Config extends ASchema {
	/**
	 * Get list of permissions
	 * @return {Promise<Array<IPermission>>}
	 */
	public getPermissions(): Q.Promise<Array<IPermission>> {
		const defer: any = q.defer();

		this._model.findOne({ name: "permissions" })
		    .exec((err, permission: { data: Array<IPermission> }) => {
			    if (err) return defer.reject(err);
			    defer.resolve(permission ? permission.data : null);
		    });

		return defer.promise;
	}

	/**
	 * Get File schema
	 * @return {"mongoose".Schema}
	 */
	public getSchema(): mongoose.Schema {
		return _schema;
	}
}

const instance = new Config();

module.exports.schema = instance; // Used by DB models loader (need require)
export default instance; // Used anywhere else
