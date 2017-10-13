import Utils from "../config/Utils";

import Config from '../schemas/Config.schema';

/**
 * List of permissions
 */
let list: Array<IPermission> = null;

class Permissions {

	/**
	 * Permission middleware
	 */
	public middleware(): Function {
		const self = this;
		return (req, res, next) => {
			if (!list) {
				Config.getPermissions()
				      .then((permissions: Array<IPermission>) => {
					      list = permissions;
					      next();
				      })
				      .catch((err: Error) => {
					      Utils.logger.error("Mongo error", err);
					      next(err);
				      });
			}
			else {
				next();
			}
		};
	}

	/**
	 * Ensure [[IUser]] has accessRole access
	 * @param user
	 * @param accessRole
	 * @return {boolean}
	 */
	public ensureAuthorized(user: IUser, accessRole: string) {
		const a = accessRole || "publicAccess";
		let userAccess = false;
		let hospitalAccess = false;
		let userRights;
		let hospitalRights;

		if (!user) {
			if (!list || !list.length) {
				return false;
			}
			for (const perm of list) {
				if (perm.name === a) {
					if (!!~perm.userRoles.indexOf("public")) {
						return true;
					}
				}
			}

			return false;
		}
		userRights = user.roles || ["public"];
		// If admin it's authorized
		if (!!~userRights.indexOf("admin")) {
			return true;
		}
		if (!list) {
			return false;
		}
		for (const perm of list) {
			if (perm.name === a) {
				for (const m of userRights) {
					if (!!~perm.userRoles.indexOf(m)) {
						userAccess = true;
						break;
					}
				}
				if (userAccess) {
					return true;
				}
			}
		}
		return false;
	}
}

const permission = new Permissions(); // Accessible via static methods

export default permission;
